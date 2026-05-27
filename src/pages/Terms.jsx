import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Terms = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAgree = async () => {
    if (!agreed) {
      alert('약관에 동의해주세요.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${API_URL}/api/auth/terms`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/onboarding');
    } catch (error) {
      console.error('약관 동의 실패:', error);
      alert('약관 동의 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terms-page">
      <div className="terms-card">
        <h2 className="terms-title">서비스 이용약관 동의</h2>
        <p className="terms-subtitle">산책 서비스 이용을 위해 아래 약관에 동의해주세요.</p>

        <div className="terms-content">
          <p><strong>[이용약관]</strong></p>
          <p>본 서비스는 임산부 및 영유아 가정을 위한 산책 정보 및 복지 정보를 제공합니다.</p>
          <br />
          <p><strong>제1조 (목적)</strong></p>
          <p>이 약관은 산책 서비스(이하 "서비스")의 이용 조건 및 절차, 이용자와 회사의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>
          <br />
          <p><strong>제2조 (개인정보 수집 및 이용)</strong></p>
          <p>서비스는 카카오 로그인을 통해 이메일, 닉네임 등 최소한의 개인정보를 수집하며, 수집된 정보는 서비스 제공 목적으로만 활용됩니다.</p>
          <br />
          <p><strong>제3조 (서비스 이용)</strong></p>
          <p>비회원도 산책로 조회 등 일부 서비스를 이용할 수 있으며, 회원 가입 시 더 많은 서비스를 이용하실 수 있습니다.</p>
        </div>

        <label className="terms-agree-label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="terms-agree-checkbox"
          />
          위 약관에 모두 동의합니다.
        </label>

        <button
          onClick={handleAgree}
          disabled={loading}
          className={`terms-submit-btn${agreed ? ' agreed' : ''}`}
        >
          {loading ? '처리 중...' : '동의하고 시작하기'}
        </button>
      </div>
    </div>
  );
};

export default Terms;
