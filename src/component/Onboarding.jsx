import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './ui/Dropdown';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

const DISTRICTS = [
  '강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구',
  '노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구',
  '성동구','성북구','송파구','양천구','영등포구','용산구','은평구',
  '종로구','중구','중랑구',
];

const PREGNANCY_OPTIONS = [
  { value: 'PLANNING', icon: '🌱', label: '임신 준비 중', desc: '임신을 계획하고 있어요' },
  { value: 'PREGNANT', icon: '🤰', label: '임신 중',     desc: '현재 임신 중이에요' },
  { value: 'POSTPARTUM', icon: '🍼', label: '출산 후',   desc: '아이를 출산했어요' },
];

const CHILD_COUNT_OPTIONS = [0,1,2,3,4].map(n => ({ value: n, label: `${n}명` })).concat({ value: 5, label: '5명+' });

const STEPS = [
  { icon: '🤰', label: '현재 상태', question: '지금 어떤 상황이세요?' },
  { icon: '🎂', label: '나이',     question: '만 나이를 알려주세요' },
  { icon: '📍', label: '거주지',   question: '어느 자치구에 살고 계세요?' },
  { icon: '👶', label: '자녀 수',  question: '자녀가 몇 명인가요?' },
];

function Stepper({ value, onChange, min = 0, max = 999, unit }) {
  const num = value === '' ? '' : Number(value);
  const dec = () => { if (num !== '' && num > min) onChange(num - 1); };
  const inc = () => { if (num === '' || num < max) onChange(num === '' ? min : num + 1); };
  return (
    <div className="ob-stepper-wrap">
      <div className="ob-stepper">
        <button type="button" onClick={dec} className="ob-stepper-btn">−</button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => {
            const v = e.target.value.replace(/[^0-9]/g, '');
            onChange(v === '' ? '' : Number(v));
          }}
          className="ob-stepper-input"
        />
        <button type="button" onClick={inc} className="ob-stepper-btn">+</button>
      </div>
      {unit && <span className="ob-unit">{unit}</span>}
    </div>
  );
}

export default function Onboarding({ onClose, initialData }) {
  const { accessToken } = useAuthStore();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    pregnancyStatus: initialData?.pregnancyStatus || '',
    userAge: initialData?.userAge ?? '',
    district: initialData?.district || '',
    childCount: initialData?.childCount ?? '',
  });

  useEffect(() => {
    if (!initialData) return;
    setFormData(prev => ({
      pregnancyStatus: prev.pregnancyStatus || initialData.pregnancyStatus || '',
      userAge: prev.userAge !== '' ? prev.userAge : (initialData.userAge ?? ''),
      district: prev.district || initialData.district || '',
      childCount: prev.childCount !== '' ? prev.childCount : (initialData.childCount ?? ''),
    }));
  }, [initialData]);

  const set = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    setError('');
  };

  const handleNext = () => {
    if (step === 0 && !formData.pregnancyStatus) { setError('현재 상태를 선택해주세요'); return; }
    if (step === 1 && (formData.userAge === '' || formData.userAge < 15)) { setError('만 15세 이상만 입력해주세요'); return; }
    if (step === 2 && !formData.district)         { setError('거주 구를 선택해주세요'); return; }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (formData.childCount === '') { setError('자녀 수를 선택해주세요'); return; }
    const payload = {
      pregnancyStatus: formData.pregnancyStatus,
      userAge: parseInt(formData.userAge),
      district: formData.district,
      childCount: parseInt(formData.childCount),
    };
    try {
      if (accessToken) {
        await axios.post(`${API_URL}/api/v1/profile/onboarding`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        onClose(null);
      } else {
        onClose(payload);
      }
    } catch {
      if (accessToken) {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      } else {
        onClose(payload);
      }
    }
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="ob-wrap">
      <div className="ob-card">

        {/* 진행 인디케이터 */}
        <div className="ob-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`ob-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />
          ))}
        </div>

        {/* 진행 바 */}
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* 헤더 */}
        <div className="ob-header">
          <p className="ob-header-label">{step + 1} / {STEPS.length} · {current.label}</p>
          <h2 className="ob-header-question">{current.question}</h2>
        </div>

        {/* 콘텐츠 */}
        <div className="ob-body">

          {step === 0 && (
            <div className="ob-status-list">
              {PREGNANCY_OPTIONS.map(({ value, icon, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('pregnancyStatus', formData.pregnancyStatus === value ? '' : value)}
                  className={`ob-status-card${formData.pregnancyStatus === value ? ' active' : ''}`}
                >
                  <span className="ob-status-icon">{icon}</span>
                  <div className="ob-status-text">
                    <p className="ob-status-label">{label}</p>
                    <p className="ob-status-desc">{desc}</p>
                  </div>
                  <span className={`ob-status-check${formData.pregnancyStatus === value ? ' visible' : ''}`}>✓</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="ob-age-area">
              <Stepper value={formData.userAge} onChange={v => set('userAge', v)} min={15} max={100} unit="세" />
              <p className="ob-hint">만 나이 기준으로 입력해주세요</p>
            </div>
          )}

          {step === 2 && (
            <Dropdown
              options={DISTRICTS.map(gu => ({ value: gu, label: gu }))}
              value={formData.district}
              onChange={v => set('district', v)}
            />
          )}

          {step === 3 && (
            <div className="ob-chip-wrap">
              {CHILD_COUNT_OPTIONS.map(opt => {
                const active = String(formData.childCount) === String(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('childCount', opt.value)}
                    className={`ob-chip${active ? ' active' : ''}`}
                  >{opt.label}</button>
                );
              })}
            </div>
          )}

        </div>

        <div style={{ height: '20px' }}>
          <p className="ob-error" style={{ opacity: error ? 1 : 0, margin: 0 }}>{error}</p>
        </div>

        {/* 하단 버튼 */}
        <div className="ob-footer">
          {step > 0
            ? <button className="ob-btn-prev" onClick={() => setStep(p => p - 1)}>← 이전</button>
            : <div />
          }
          <button
            className="ob-btn-next"
            onClick={isLast ? handleSubmit : handleNext}
          >
            {isLast ? '완료하기 ✓' : '다음 →'}
          </button>
        </div>

      </div>
    </div>
  );
}
