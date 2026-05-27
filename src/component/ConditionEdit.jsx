import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './ui/Button';
import Dropdown from './ui/Dropdown';

const API_URL = import.meta.env.VITE_API_URL;

const DISTRICTS = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];

function Field({ label, children, fullWidth }) {
  return (
    <div className={`field${fullWidth ? ' full-width' : ''}`}>
      <span className="field-label">{label}</span>
      {children}
    </div>
  );
}

function SectionDivider({ title }) {
  return (
    <div className="section-divider">
      <span className="section-divider-label">{title}</span>
      <div className="section-divider-line" />
    </div>
  );
}

function CheckRow({ checked, onChange, children }) {
  return (
    <label className="check-row">
      <span className={`check-box${checked ? ' checked' : ''}`}>
        {checked && <span className="check-box-mark">✓</span>}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      <span className="check-row-text">{children}</span>
    </label>
  );
}

/* ── Stepper ────────────────────────────── */
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

/* ── ChipSelect ─────────────────────────── */
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

const CHILD_COUNT_OPTIONS = [0,1,2,3,4].map(n => ({ value: n, label: `${n}명` })).concat({ value: 5, label: '5명+' });
const INFANT_MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}개월` }));

export default function ConditionEdit({ onClose, onSave }) {
  const [pregnancyStatus, setPregnancyStatus] = useState('');
  const [formData, setFormData] = useState({
    userAge: '',
    district: '',
    residenceMonths: '',
    childCount: '',
    incomeLevel: '',
    isHomeless: false,
    isForeigner: false,
    dueDate: '',
    isMultibirth: false,
    infantMonths: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    axios.get(`${API_URL}/api/v1/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const d = res.data;
      setPregnancyStatus(d.pregnancyStatus || '');
      setFormData({
        userAge: d.userAge ?? '',
        district: d.district || '',
        residenceMonths: d.residenceMonths ?? '',
        childCount: d.childCount ?? '',
        incomeLevel: d.incomeLevel ?? '',
        isHomeless: d.isHomeless || false,
        isForeigner: d.isForeigner || false,
        dueDate: d.dueDate || '',
        isMultibirth: d.isMultibirth || false,
        infantMonths: d.infantMonths ?? '',
      });
    }).catch(err => console.error(err));
  }, []);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`${API_URL}/api/v1/profile`, {
        pregnancyStatus,
        userAge: parseInt(formData.userAge),
        district: formData.district,
        residenceMonths: parseInt(formData.residenceMonths) || null,
        childCount: parseInt(formData.childCount),
        incomeLevel: parseInt(formData.incomeLevel) || null,
        isHomeless: formData.isHomeless,
        isForeigner: formData.isForeigner,
        dueDate: formData.dueDate || null,
        isMultibirth: formData.isMultibirth,
        infantMonths: parseInt(formData.infantMonths) || null,
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('저장되었습니다!');
      onSave?.();
      onClose();
    } catch {
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="condition-modal">

      {/* 헤더 */}
      <div className="condition-header">
        <div className="condition-header-text">
          <p>내 복지 조건</p>
          <h2>조건 수정하기</h2>
        </div>
        <button className="condition-close-btn" onClick={onClose}>✕</button>
      </div>

      {/* 임신 상태 */}
      <SectionDivider title="임신 상태" />
      <div className="pregnancy-tabs">
        {[
          { value: 'PLANNING', label: '임신 준비 중' },
          { value: 'PREGNANT', label: '임신 중' },
          { value: 'POSTPARTUM', label: '출산 후' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPregnancyStatus(value)}
            className={`pregnancy-tab${pregnancyStatus === value ? ' active' : ''}`}
          >{label}</button>
        ))}
      </div>

      {/* 기본 정보 */}
      <SectionDivider title="기본 정보" />
      <div className="condition-grid">
        <Field label="만 나이">
          <Stepper value={formData.userAge} onChange={v => set('userAge', v)} min={0} max={100} unit="세" />
        </Field>
        <Field label="거주 자치구">
          <Dropdown
            options={DISTRICTS.map(gu => ({ value: gu, label: gu }))}
            value={formData.district}
            onChange={v => set('district', v)}
          />
        </Field>
        <Field label="자치구 연속 거주 기간">
          <Stepper value={formData.residenceMonths} onChange={v => set('residenceMonths', v)} min={0} max={600} unit="개월" />
        </Field>
        <Field label="자녀 수">
          <ChipSelect
            options={CHILD_COUNT_OPTIONS}
            value={formData.childCount}
            onChange={v => set('childCount', v)}
          />
        </Field>
      </div>

      {/* 임신 중 추가 정보 */}
      {pregnancyStatus === 'PREGNANT' && (
        <>
          <SectionDivider title="임신 정보" />
          <div className="condition-grid">
            <Field label="출산 예정일">
              <input type="date" value={formData.dueDate} onChange={e => set('dueDate', e.target.value)} className="date-input" />
            </Field>
            <div className="condition-grid-align-end">
              <CheckRow checked={formData.isMultibirth} onChange={e => set('isMultibirth', e.target.checked)}>
                쌍둥이 이상 임신 중이에요
              </CheckRow>
            </div>
          </div>
        </>
      )}

      {/* 출산 후 추가 정보 */}
      {pregnancyStatus === 'POSTPARTUM' && (
        <>
          <SectionDivider title="출산 정보" />
          <div className="condition-grid">
            <Field label="자녀 생후 개월 수" fullWidth>
              <ChipSelect
                options={INFANT_MONTH_OPTIONS}
                value={formData.infantMonths}
                onChange={v => set('infantMonths', v)}
              />
            </Field>
            <div className="condition-grid-span">
              <CheckRow checked={formData.isMultibirth} onChange={e => set('isMultibirth', e.target.checked)}>
                미숙아 또는 선천성 이상아로 태어났어요
              </CheckRow>
            </div>
          </div>
        </>
      )}

      {/* 경제·주거 정보 */}
      <SectionDivider title="경제·주거 정보" />
      <div className="condition-grid condition-grid-last">
        <Field label="소득 구간">
          <Dropdown
            options={[1,2,3,4,5,6,7,8,9,10].map(n => ({ value: n, label: `${n}구간` }))}
            value={formData.incomeLevel}
            onChange={v => set('incomeLevel', v)}
          />
        </Field>
        <div className="condition-check-group">
          <CheckRow checked={formData.isHomeless} onChange={e => set('isHomeless', e.target.checked)}>
            무주택이에요
          </CheckRow>
          <CheckRow checked={formData.isForeigner} onChange={e => set('isForeigner', e.target.checked)}>
            외국인이에요
          </CheckRow>
        </div>
      </div>

      {/* 버튼 */}
      <div className="condition-footer">
        <Button variant="secondary" size="md" onClick={onClose} style={{ flex: 1 }}>취소</Button>
        <Button variant="primary" size="md" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
          {loading ? '저장 중...' : '저장하기'}
        </Button>
      </div>
    </div>
  );
}
