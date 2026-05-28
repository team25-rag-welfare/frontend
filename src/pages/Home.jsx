import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GuideModal from '../component/GuideModal';
import useAuthStore from '../store/authStore';

const BENEFITS = {
  '임신중': [
    { icon: '🏥', title: '국민행복카드 바우처', desc: '임신 확인 후 최대 100만원 지원' },
    { icon: '💊', title: '엽산·철분제 지원', desc: '보건소에서 임신 전 기간 무료 제공' },
    { icon: '🚌', title: '임산부 교통비 지원', desc: 'KTX·고속버스 최대 30% 할인' },
    { icon: '🏨', title: '산전검사비 지원', desc: '보건소 등록 후 무료 산전 검사' },
  ],
  '출산후': [
    { icon: '🎁', title: '출산 바우처', desc: '첫째 200만원 / 둘째 이상 300만원' },
    { icon: '🏠', title: '산모·신생아 건강관리사', desc: '출산 후 10~20일 가정 방문 지원' },
    { icon: '👶', title: '양육수당', desc: '어린이집 미이용 시 월 최대 20만원' },
    { icon: '💰', title: '아동수당', desc: '만 8세 미만 아동 월 10만원 지급' },
  ],
  '육아중': [
    { icon: '💼', title: '육아휴직 급여', desc: '통상임금 80%, 월 최대 150만원' },
    { icon: '👨‍👩‍👧', title: '3+3 부모육아휴직', desc: '부모 동시 사용 시 급여 100% 지급' },
    { icon: '🏫', title: '어린이집 보육료 지원', desc: '소득 무관 전 계층 지원' },
    { icon: '🔔', title: '부모급여', desc: '만 0세 월 100만원, 만 1세 월 50만원' },
  ],
};

const TAB_DESC = {
  '임신중': '임신이 확인된 순간부터 받을 수 있는 혜택이에요!',
  '출산후': '출산 후 바로 신청할 수 있는 혜택이에요!',
  '육아중': '아이를 키우면서 받을 수 있는 혜택이에요!',
};

const STATS = [
  { value: '47+', label: '복지 혜택 수록' },
  { value: '300만원', label: '최대 수령 가능' },
  { value: '24시간', label: 'AI 상담 운영' },
];

const TAB_ICON = { '임신중': '🤰', '출산후': '🍼', '육아중': '👶' };

export default function Home() {
  const navigate = useNavigate();
  const { user, fetchProfile, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('출산후');
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem('guide_seen'));
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!user) fetchProfile();
  }, []);

  return (
    <div className="home-root">

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

      {/* 네비게이션 */}
      <nav className="home-nav">
        <img src="/logo.png" alt="산책" className="home-nav-logo" />
        {user ? (
          <div className="home-nav-profile-wrap">
            <button onClick={() => setShowProfileMenu(v => !v)} className="home-nav-profile">
              <img
                src={user.profileImageUrl || '/Frame.svg'}
                alt="프로필"
                className="home-nav-profile-img"
              />
              <span className="home-nav-profile-name">{user.userName}</span>
            </button>
            {showProfileMenu && (
              <>
                <div className="home-nav-profile-backdrop" onClick={() => setShowProfileMenu(false)} />
                <div className="home-nav-profile-menu">
                  <button onClick={() => navigate('/chat')} className="home-nav-profile-menu-item">
                    💬 채팅 시작하기
                  </button>
                  <button onClick={() => { logout(); setShowProfileMenu(false); }} className="home-nav-profile-menu-item logout">
                    로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="btn-nav-text">
            로그인
          </button>
        )}
      </nav>

      {/* 배경 + 본문 */}
      <div className="home-content">

        {/* 배경 */}
        <div className="home-bg" />
        <div className="home-blob home-blob-mint-lg" />
        <div className="home-blob home-blob-mint-md" />
        <div className="home-blob home-blob-pink" />
        <div className="home-blob home-blob-white" />

        {/* 카드 영역 */}
        <div className="home-cards">

          {/* 왼쪽: 히어로 */}
          <div className="home-hero">
            <div className="home-badge">✦ 임산부·출산 후 12개월 복지 가이드</div>

            <h1 className="headline">
              내가 받을 수 있는<br />
              혜택이 <span className="hl">이렇게 많아?</span><br />
              <span className="hl-g">산책</span>이 찾아드릴게요
            </h1>

            <p className="home-desc">
              임신부터 출산 후 12개월까지,<br />
              놓치기 쉬운 복지 혜택을 한눈에 모아드려요.<br />
            </p>

            <div className="home-btn-row">
              <button onClick={() => user ? navigate('/chat') : setShowGuide(true)} className="home-cta-btn">
                🌿 시작하기
              </button>
            </div>

            <div className="home-stats">
              {STATS.map((s) => (
                <div key={s.label} className="home-stat-item">
                  <div className="home-stat-value">{s.value}</div>
                  <div className="home-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 혜택 카드 */}
          <div className="home-benefit-card">
            <div className="home-benefit-header">
              <div className="home-benefit-header-inner">
                <span className="home-tab-icon">{TAB_ICON[activeTab]}</span>
                <span className="home-tab-title">{activeTab}에 받을 수 있는 혜택</span>
              </div>
            </div>

            <div className="home-tabs">
              {Object.keys(BENEFITS).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`home-tab${activeTab === tab ? ' active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <p className="home-tab-desc">
              {activeTab}에 받을 수 있는 혜택!<br />{TAB_DESC[activeTab]}
            </p>

            <div className="home-benefit-list">
              {BENEFITS[activeTab].map((b) => (
                <div key={b.title} className="benefit-item">
                  <span className="benefit-icon">{b.icon}</span>
                  <div className="benefit-content">
                    <div className="benefit-title">{b.title}</div>
                    <div className="benefit-desc">{b.desc}</div>
                  </div>
                  <span className="benefit-arrow">›</span>
                </div>
              ))}
            </div>

            <div className="home-card-footer">
              <span className="home-card-footer-note">💡 소득 분위에 따라 금액이 달라져요</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
