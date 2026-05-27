import React, { useState } from 'react';
import axios from 'axios';
import Button from './ui/Button';
import Dropdown from './ui/Dropdown';

const API_URL = import.meta.env.VITE_API_URL;

const DISTRICTS = [
  '강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구',
  '노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구',
  '성동구','성북구','송파구','양천구','영등포구','용산구','은평구',
  '종로구','중구','중랑구',
];

const PREGNANCY_OPTIONS = [
  { value: 'PLANNING', label: '임신 준비 중' },
  { value: 'PREGNANT', label: '임신 중' },
  { value: 'POSTPARTUM', label: '출산 후' },
];

const CHILD_COUNT_OPTIONS = [0,1,2,3,4].map(n => ({ value: n, label: `${n}명` })).concat({ value: 5, label: '5명+' });

function Stepper({ value, onChange, min = 0, max = 999, unit }) {
  const num = value === '' ? '' : Number(value);
  const dec = () => { if (num !== '' && num > min) onChange(num - 1); };
  const inc = () => { if (num === '' || num < max) onChange(num === '' ? min : num + 1); };
  return (
    <div className="with-unit">
      <div className="stepper">
        <button type="button" onClick={dec} className="stepper-btn">−</button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={e => {
            const v = e.target.value.replace(/[^0-9]/g, '');
            onChange(v === '' ? '' : Number(v));
          }}
          className="stepper-input"
        />
        <button type="button" onClick={inc} className="stepper-btn">+</button>
      </div>
      {unit && <span className="unit-label">{unit}</span>}
    </div>
  );
}

function ChipSelect({ options, value, onChange }) {
  return (
    <div className="chip-select">
      {options.map(opt => {
        const active = String(value) === String(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`chip-option${active ? ' active' : ''}`}
          >{opt.label}</button>
        );
      })}
    </div>
  );
}

const STEPS = [
  { label: '현재 상태를 알려주세요' },
  { label: '만 나이를 알려주세요' },
  { label: '거주중인 자치구를 알려주세요' },
  { label: '자녀 수를 알려주세요' },
];

export default function Onboarding({ onClose }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    pregnancyStatus: '',
    userAge: '',
    district: '',
    childCount: '',
  });

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleNext = () => {
    if (step === 0 && !formData.pregnancyStatus) { alert('현재 상태를 선택해주세요!'); return; }
    if (step === 1 && formData.userAge === '') { alert('만 나이를 입력해주세요!'); return; }
    if (step === 2 && !formData.district) { alert('거주 구를 선택해주세요!'); return; }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (formData.childCount === '') { alert('자녀 수를 입력해주세요!'); return; }
    const token = localStorage.getItem('access_token');
    try {
      if (token) {
        await axios.post(`${API_URL}/api/v1/profile/onboarding`, {
          pregnancyStatus: formData.pregnancyStatus,
          userAge: parseInt(formData.userAge),
          district: formData.district,
          childCount: parseInt(formData.childCount),
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      onClose();
    } catch {
      onClose();
    }
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div className="onboarding-wrap">
      <div className="condition-modal onboarding-card">

        {/* 헤더 */}
        <div className="condition-header">
          <div className="condition-header-text">
            <p>기본 정보 입력</p>
            <h2>{STEPS[step].label}</h2>
          </div>
          <div className="onboarding-step-badge">{step + 1} / {STEPS.length}</div>
        </div>

        {/* 진행 바 */}
        <div className="onboarding-progress-track">
          <div className="onboarding-progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {/* 스텝 내용 */}
        <div className="onboarding-body">
          {step === 0 && (
            <div className="pregnancy-tabs">
              {PREGNANCY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => set('pregnancyStatus', value)}
                  className={`pregnancy-tab${formData.pregnancyStatus === value ? ' active' : ''}`}
                >{label}</button>
              ))}
            </div>
          )}

          {step === 1 && (
            <Stepper value={formData.userAge} onChange={v => set('userAge', v)} min={0} max={100} unit="세" />
          )}

          {step === 2 && (
            <Dropdown
              options={DISTRICTS.map(gu => ({ value: gu, label: gu }))}
              value={formData.district}
              onChange={v => set('district', v)}
            />
          )}

          {step === 3 && (
            <ChipSelect
              options={CHILD_COUNT_OPTIONS}
              value={formData.childCount}
              onChange={v => set('childCount', v)}
            />
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="condition-footer">
          {step > 0
            ? <Button variant="secondary" size="md" onClick={() => setStep(p => p - 1)} style={{ flex: 1 }}>이전</Button>
            : <div style={{ flex: 1 }} />
          }
          {isLast
            ? <Button variant="primary" size="md" onClick={handleSubmit} style={{ flex: 1 }}>완료</Button>
            : <Button variant="primary" size="md" onClick={handleNext} style={{ flex: 1 }}>다음</Button>
          }
        </div>
      </div>
    </div>
  );
}
