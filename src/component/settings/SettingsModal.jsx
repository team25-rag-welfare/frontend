import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MemoryTab from './MemoryTab';
import cryingCorgi from '../../assets/images/crying_corgi.png';

const API_URL = import.meta.env.VITE_API_URL;

const TABS = [
  { key: 'account', label: '계정정보' },
  { key: 'memory', label: '메모리' },
];

export default function SettingsModal({ onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 모달이 열리면 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingUser(true);
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await axios.get(`${API_URL}/api/v1/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUserInfo();
  }, []);

  // 회원 탈퇴 API 호출
  const handleWithdrawal = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('로그인 정보가 유효하지 않습니다.');
        return;
      }

      const response = await axios.delete(`${API_URL}/api/v1/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        alert('회원 탈퇴가 정상적으로 처리되었습니다. 그동안 이용해 주셔서 감사합니다.');
        localStorage.removeItem('access_token');
        setShowConfirm(false);
        onClose();
        navigate('/'); // 랜딩 또는 로그인 페이지로 이동
      } else {
        throw new Error('탈퇴 요청이 실패했습니다.');
      }
    } catch (error) {
      console.error('회원 탈퇴 에러:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다. 서버 상태를 확인하고 다시 시도해 주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal" style={{ width: '680px', maxHeight: '90vh' }}>

        <div className="settings-header">
          <span>설정</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="settings-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content" style={{ display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px 0' }}>계정정보</h3>
                <p style={{ fontSize: '13px', color: 'var(--ink-lt)', margin: 0 }}>로그인에 사용되는 기본 계정 정보예요.</p>
              </div>

              <div style={{
                flex: 1,
                background: 'var(--cream)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px'
              }}>
                {isLoadingUser ? (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px', animation: 'bounce 1s infinite' }}>💫</span>
                    <span style={{ fontSize: '13px', color: 'var(--ink-lt)', fontWeight: 'bold' }}>계정 정보를 불러오는 중...</span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ink-lt)', width: '90px' }}>사용자 이름</span>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--ink)' }}>{userInfo?.userName || '불러오지 못함'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ink-lt)', width: '90px' }}>계정 고유 ID</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ink-md)' }}>#{userInfo?.userId || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--ink-lt)', width: '90px' }}>연동 로그인</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(254, 229, 0, 0.15)',
                          border: '1px solid rgba(254, 229, 0, 0.4)',
                          color: '#8c7d00',
                          fontWeight: 'bold',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '11px'
                        }}>
                          <span>💬</span> 카카오 간편로그인 연동 완료
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '16px' }}>
                      <button
                        onClick={() => setShowConfirm(true)}
                        style={{
                          background: 'white',
                          color: '#FF7390',
                          fontWeight: 'bold',
                          border: '1px solid #FFCCD5',
                          borderRadius: '12px',
                          padding: '10px 20px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#FFF0F2'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        회원 탈퇴
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'memory' && <MemoryTab />}
        </div>
      </div>

      {/* 2차 확인 모달 (정말 탈퇴하시겠어요? overlay) */}
      {showConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            width: '460px',
            borderRadius: '24px',
            padding: '28px',
            background: 'linear-gradient(to bottom, #FFFFFF, var(--cream))',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                <img 
                  src={cryingCorgi} 
                  alt="우는 웰시코기" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>정말 탈퇴 하시겠어요?</h3>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--ink-lt)', margin: 0 }}>
                  아직 같이 알아보지 않은 정보들이 많아요
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleWithdrawal}
                disabled={isDeleting}
                style={{
                  background: '#E6F4EA',
                  color: '#34A853',
                  fontWeight: 'bold',
                  border: '1px solid #CEEAD6',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  opacity: isDeleting ? 0.5 : 1
                }}
              >
                {isDeleting ? '처리 중...' : '예'}
              </button>
              <button
                onClick={() => !isDeleting && setShowConfirm(false)}
                disabled={isDeleting}
                style={{
                  background: 'linear-gradient(135deg, #FFB7C5, #F096AD)',
                  color: 'white',
                  fontWeight: 900,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(255,183,197,.4)',
                  opacity: isDeleting ? 0.5 : 1
                }}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
