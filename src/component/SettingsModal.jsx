import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cryingCorgi from '../assets/images/crying_corgi.png';

export default function SettingsModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account'); // 'account', 'condition', 'history'
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 모달이 열리면 유저 정보 조회
  useEffect(() => {
    if (isOpen) {
      const fetchUserInfo = async () => {
        setIsLoadingUser(true);
        try {
          const token = localStorage.getItem('access_token');
          if (token) {
            const response = await axios.get('http://localhost:8080/api/v1/profile', {
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
    } else {
      // 닫힐 때 상태 리셋
      setShowConfirm(false);
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 회원 탈퇴 API 호출
  const handleWithdrawal = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('로그인 정보가 유효하지 않습니다.');
        return;
      }

      const response = await axios.delete('http://localhost:8080/api/v1/profile', {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300">
      
      {/* 메인 설정 창 */}
      <div className="bg-[#FFF8F9] w-[800px] h-[550px] rounded-[36px] shadow-2xl border border-pink-100 p-10 flex flex-col relative animate-fadeIn max-w-full overflow-hidden">
        
        {/* 닫기 버튼 (우측 상단 검정색 동그라미 X) */}
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 cursor-pointer z-20"
        >
          ✕
        </button>

        {/* 탭 바 영역 (우측 정렬) */}
        <div className="flex justify-end border-b border-pink-100/50 pb-3 mb-6">
          <div className="flex gap-8 mr-12">
            {[
              { id: 'account', label: '계정정보' },
              { id: 'condition', label: '조건입력' },
              { id: 'history', label: '상담 히스토리' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-base font-bold pb-2 transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-gray-800 font-extrabold' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-800 rounded-full animate-stretch"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 별 본문 영역 */}
        {activeTab === 'account' && (
          <div className="flex-1 flex flex-col">
            {/* 헤더 */}
            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-800 mb-2">계정정보</h2>
              <p className="text-sm font-medium text-gray-400">로그인에 사용되는 기본 계정 정보예요.</p>
            </div>

            {/* 카드 박스 */}
            <div className="flex-1 bg-white/70 border border-pink-50 rounded-[24px] p-8 shadow-inner flex flex-col justify-between relative">
              {isLoadingUser ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <span className="text-3xl animate-bounce">💫</span>
                  <span className="text-sm text-gray-400 font-bold">계정 정보를 불러오는 중...</span>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-bold text-gray-400 w-24 shrink-0">사용자 이름</span>
                      <span className="text-lg font-black text-gray-700">{userInfo?.userName || '불러오지 못함'}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-bold text-gray-400 w-24 shrink-0">계정 고유 ID</span>
                      <span className="text-lg font-bold text-gray-600">#{userInfo?.userId || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-bold text-gray-400 w-24 shrink-0">연동 로그인</span>
                      <div className="flex items-center gap-2 bg-[#FEE500]/10 border border-[#FEE500]/30 text-[#8c7d00] font-bold px-3 py-1.5 rounded-full text-xs">
                        <span className="text-sm">💬</span> 카카오 간편로그인 연동 완료
                      </div>
                    </div>
                  </div>

                  {/* 회원 탈퇴 버튼 */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="bg-white hover:bg-red-50 text-red-500 font-extrabold border border-red-200 rounded-2xl px-6 py-3.5 transition-all shadow-sm transform active:scale-95 cursor-pointer text-sm"
                    >
                      회원 탈퇴
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'condition' && (
          <div className="flex-1 flex flex-col justify-center items-center gap-3">
            <span className="text-4xl">🛠️</span>
            <h3 className="text-xl font-bold text-gray-700">조건입력 관리</h3>
            <p className="text-sm text-gray-400">준비 중인 기능입니다.</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 flex flex-col justify-center items-center gap-3">
            <span className="text-4xl">📚</span>
            <h3 className="text-xl font-bold text-gray-700">상담 히스토리</h3>
            <p className="text-sm text-gray-400">준비 중인 기능입니다.</p>
          </div>
        )}
      </div>

      {/* 2차 확인 모달 (정말 탈퇴하시겠어요? overlay) */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div 
            className="w-[520px] rounded-[30px] p-8 shadow-2xl border border-white/60 flex flex-col relative animate-scaleIn bg-white"
            style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.96), rgba(255, 245, 247, 0.98))',
            }}
          >
            {/* 메인 내용 (가로 배치) */}
            <div className="flex items-center gap-6 mb-6">
              {/* 우는 웰시코기 이미지 */}
              <div className="w-28 h-28 flex items-center justify-center shrink-0">
                <img 
                  src={cryingCorgi} 
                  alt="우는 웰시코기" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* 텍스트 내용 */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">정말 탈퇴 하시겠어요?</h3>
                <p className="text-sm font-medium text-gray-500 leading-snug">
                  아직 같이 알아보지 않은 정보들이 많아요
                </p>
              </div>
            </div>

            {/* 분홍색 얇은 구분선 */}
            <div className="border-t border-[#FFCCD5]/60 my-2"></div>

            {/* 하단 버튼 영역 */}
            <div className="flex justify-end gap-3.5 mt-4">
              <button
                onClick={handleWithdrawal}
                disabled={isDeleting}
                className="bg-[#E6F4EA] hover:bg-[#CEEAD6] text-[#34A853] font-bold border border-[#CEEAD6] px-7 py-3 rounded-2xl transition-all shadow-sm transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
              >
                {isDeleting ? '처리 중...' : '예'}
              </button>
              <button
                onClick={() => !isDeleting && setShowConfirm(false)}
                disabled={isDeleting}
                className="bg-[#FFB3C1] hover:bg-[#FFA3B5] text-white font-black px-7 py-3 rounded-2xl transition-all shadow-md transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
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
