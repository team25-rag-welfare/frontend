import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function ConditionEdit({ onClose }) {
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
    axios.get('${API_URL}/api/v1/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      const d = response.data;
      setPregnancyStatus(d.pregnancyStatus || '');
      setFormData({
        userAge: d.userAge || '',
        district: d.district || '',
        residenceMonths: d.residenceMonths || '',
        childCount: d.childCount || '',
        incomeLevel: d.incomeLevel || '',
        isHomeless: d.isHomeless || false,
        isForeigner: d.isForeigner || false,
        dueDate: d.dueDate || '',
        isMultibirth: d.isMultibirth || false,
        infantMonths: d.infantMonths || '',
      });
    }).catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      await axios.put('${API_URL}/api/v1/profile', {
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
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('저장되었습니다!');
      onClose();
    } catch (error) {
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, children) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', color: '#999' }}>{label}</label>
      {children}
    </div>
  );

  const input = (key, type = 'number') => (
    <input
      type={type}
      value={formData[key]}
      onChange={e => setFormData({...formData, [key]: e.target.value})}
      style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', outline: 'none', width: '100%' }}
    />
  );

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '36px', width: '560px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxHeight: '80vh', overflowY: 'auto' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>조건 입력</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>

        {/* 임신 상태 */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '28px' }}>
          {['임신 준비 중', '임신 중', '출산 후'].map(status => (
            <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: pregnancyStatus === status ? '#FF8585' : '#666', fontWeight: pregnancyStatus === status ? 'bold' : 'normal' }}>
              <input type="radio" value={status} checked={pregnancyStatus === status} onChange={() => setPregnancyStatus(status)} />
              {status}
            </label>
          ))}
        </div>

        {/* 기본 정보 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          {field('만 나이',
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {input('userAge')}
              <span style={{ fontSize: '13px', color: '#999', whiteSpace: 'nowrap' }}>세</span>
            </div>
          )}
          {field('거주 자치구',
            <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', outline: 'none' }}>
              <option value="">선택</option>
              {['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'].map(gu => (
                <option key={gu} value={gu}>{gu}</option>
              ))}
            </select>
          )}
          {field('자치구 연속 거주',
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {input('residenceMonths')}
              <span style={{ fontSize: '13px', color: '#999', whiteSpace: 'nowrap' }}>개월</span>
            </div>
          )}
          {field('자녀 수',
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {input('childCount')}
              <span style={{ fontSize: '13px', color: '#999', whiteSpace: 'nowrap' }}>명</span>
            </div>
          )}
        </div>

        {/* 임신 중 추가 정보 */}
        {pregnancyStatus === '임신 중' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            {field('출산 예정일',
              <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
                style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', outline: 'none' }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
              <input type="checkbox" checked={formData.isMultibirth} onChange={e => setFormData({...formData, isMultibirth: e.target.checked})}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>쌍둥이 이상 임신 중이에요</label>
            </div>
          </div>
        )}

        {/* 출산 후 추가 정보 */}
        {pregnancyStatus === '출산 후' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            {field('자녀 생후 개월 수',
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {input('infantMonths')}
                <span style={{ fontSize: '13px', color: '#999', whiteSpace: 'nowrap' }}>개월</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
              <input type="checkbox" checked={formData.isMultibirth} onChange={e => setFormData({...formData, isMultibirth: e.target.checked})}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>미숙아 또는 선천성 이상아로 태어났어요</label>
            </div>
          </div>
        )}

        {/* 경제/주거 정보 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {field('소득 구간',
            <select value={formData.incomeLevel} onChange={e => setFormData({...formData, incomeLevel: e.target.value})}
              style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', outline: 'none' }}>
              <option value="">선택</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}구간</option>)}
            </select>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#666' }}>
              <input type="checkbox" checked={formData.isHomeless} onChange={e => setFormData({...formData, isHomeless: e.target.checked})}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              무주택이에요
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#666' }}>
              <input type="checkbox" checked={formData.isForeigner} onChange={e => setFormData({...formData, isForeigner: e.target.checked})}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              외국인이에요
            </label>
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose}
            style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid #eee', cursor: 'pointer', fontSize: '14px', color: '#666' }}>
            취소
          </button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: '10px 24px', borderRadius: '10px', backgroundColor: '#FF8585', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}