import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Onboarding({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pregnancyStatus: '',
    userAge: '',
    district: '',
    childCount: '',
  });

  const handleNext = () => {
  if (step === 1 && !formData.pregnancyStatus) {
    alert('현재 상태를 선택해주세요!');
    return;
  }
  if (step === 2 && !formData.userAge) {
    alert('만 나이를 입력해주세요!');
    return;
  }
  if (step === 3 && !formData.district) {
    alert('거주 구를 선택해주세요!');
    return;
  }
  setStep((prev) => prev + 1);
};
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!formData.childCount && formData.childCount !== 0) {
    alert('자녀 수를 입력해주세요!');
    return;
  }
  const token = localStorage.getItem('access_token');
  
  try {
    if (token) {
      // 회원이면 API에 저장
      await axios.post(`${API_URL}/api/v1/profile/onboarding`, {
        pregnancyStatus: formData.pregnancyStatus,
        userAge: parseInt(formData.userAge),
        district: formData.district,
        childCount: parseInt(formData.childCount),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    onClose();
  } catch (error) {
    onClose(); // 실패해도 일단 닫기
  }
};

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFE4E8', borderRadius: '20px',
        padding: '40px', width: '400px', position: 'relative'
      }}>
        <p style={{ color: '#FF8585', fontWeight: 'bold', marginBottom: '8px' }}>
          기본 정보를 알려주세요 ({step}/4)
        </p>

        {step === 1 && (
          <div>
            <p style={{ marginBottom: '16px' }}>현재 상태</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['임신중', '출산 후', '태담 입문'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFormData({ ...formData, pregnancyStatus: status })}
                  style={{
                    padding: '10px 16px', borderRadius: '10px', border: '2px solid',
                    borderColor: formData.pregnancyStatus === status ? '#FF8585' : '#ddd',
                    backgroundColor: formData.pregnancyStatus === status ? '#FF8585' : 'white',
                    color: formData.pregnancyStatus === status ? 'white' : '#555',
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ marginBottom: '16px' }}>만 나이를 입력해 주세요</p>
            <input
              type="number"
              value={formData.userAge}
              onChange={(e) => setFormData({ ...formData, userAge: e.target.value })}
              placeholder="나이 입력"
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd', width: '100%' }}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ marginBottom: '16px' }}>현재 거주중인 구를 알려주세요</p>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd', width: '100%' }}
            >
              <option value="">선택해주세요</option>
              {['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구',
                '노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구',
                '성동구','성북구','송파구','양천구','영등포구','용산구','은평구',
                '종로구','중구','중랑구'].map((gu) => (
                <option key={gu} value={gu}>{gu}</option>
              ))}
            </select>
          </div>
        )}

        {step === 4 && (
          <div>
            <p style={{ marginBottom: '16px' }}>현재 자녀의 수를 알려주세요</p>
            <input
              type="number"
              value={formData.childCount}
              onChange={(e) => setFormData({ ...formData, childCount: e.target.value })}
              placeholder="자녀 수 입력"
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ddd', width: '100%' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          {step > 1 && (
            <button onClick={handlePrev} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer' }}>
              이전
            </button>
          )}
          {step < 4 ? (
            <button onClick={handleNext} style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: '10px', backgroundColor: '#FF8585', color: 'white', border: 'none', cursor: 'pointer' }}>
              다음
            </button>
          ) : (
            <button onClick={handleSubmit} style={{ marginLeft: 'auto', padding: '10px 20px', borderRadius: '10px', backgroundColor: '#FF8585', color: 'white', border: 'none', cursor: 'pointer' }}>
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}