import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('출산후');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Noto Sans KR', sans-serif" }}>

      {/* 네비게이션 */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 64, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(242,199,199,.3)', flexShrink: 0, zIndex: 10 }}>
        <img src="/logo.png" alt="산책" style={{ height: 56 }} />
        <button
          onClick={() => navigate('/login')}
          className="btn-nav"
        >
          시작하기 →
        </button>
      </nav>

      {/* 배경 + 본문 */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* 배경 그라디언트 */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #F4FBF5 0%, #FFFFFF 50%, #FFF5F7 100%)' }} />
        {/* 민트 블롭 */}
        <div style={{ position: 'absolute', width: 500, height: 400, background: 'rgba(213,243,216,0.5)', borderRadius: '50%', top: -80, left: '-5%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 350, height: 300, background: 'rgba(213,243,216,0.4)', borderRadius: '50%', bottom: -60, right: '10%', filter: 'blur(50px)' }} />
        {/* 핑크 블롭 (포인트) */}
        <div style={{ position: 'absolute', width: 300, height: 300, background: 'rgba(255,183,197,0.2)', borderRadius: '50%', top: '15%', right: '5%', filter: 'blur(50px)' }} />
        {/* 흰색 하이라이트 */}
        <div style={{ position: 'absolute', width: 250, height: 250, background: 'rgba(255,255,255,0.6)', borderRadius: '50%', top: '35%', left: '35%', filter: 'blur(45px)' }} />

        {/* 카드 영역 */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'center', gap: 24, padding: '0 48px' }}>

          {/* 왼쪽: 히어로 카드 */}
          <div style={{ flex: '0 0 52%', padding: '40px 44px' }}>
            {/* 태그 */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,183,197,.15)', border: '1px solid rgba(255,183,197,.4)', borderRadius: 9999, padding: '4px 14px', fontSize: 12, fontWeight: 600, color: '#D4718A', marginBottom: 24 }}>
              ✦ 임산부·출산 후 12개월 복지 가이드
            </div>

            {/* 헤드라인 */}
            <h1 className="headline">
              내가 받을 수 있는<br />
              혜택이 <span className="hl">이렇게 많아?</span><br />
              <span className="hl-g">산책</span>이 찾아드릴게요
            </h1>

            {/* 설명 */}
            <p style={{ fontSize: 14, color: '#7A5560', lineHeight: 1.8, marginBottom: 32 }}>
              임신부터 출산 후 12개월까지,<br />
              놓치기 쉬운 복지 혜택을 한눈에 모아드려요.<br />
              로그인 없이 바로 확인해보세요.
            </p>

            {/* 버튼 */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
              <button
                onClick={() => navigate('/chat')}
                style={{ flex: 1, padding: '14px 0', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#D5F3D8,#A8E6AD)', color: '#4A8C44', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(213,243,216,.6)' }}
              >
                🌿 혜택 바로 찾아보기
              </button>
            </div>

            {/* 통계 */}
            <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(200,180,168,.25)', paddingTop: 24 }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{ flex: 1, textAlign: 'center', borderRight: i < STATS.length - 1 ? '1px solid rgba(200,180,168,.25)' : 'none' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#C97A52', letterSpacing: '-0.5px' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#B8909A', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 혜택 카드 */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', borderRadius: 24, padding: '28px 32px', boxShadow: '0 8px 40px rgba(61,42,48,.12)', border: '1px solid rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column' }}>
            {/* 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{activeTab === '임신중' ? '🤰' : activeTab === '출산후' ? '🍼' : '👶'}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#3D2A30' }}>{activeTab}에 받을 수 있는 혜택</span>
              </div>
            </div>

            {/* 탭 */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
              {Object.keys(BENEFITS).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: '7px 0', borderRadius: 9999, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .18s',
                    background: activeTab === tab ? 'linear-gradient(135deg,#FFB7C5,#F096AD)' : 'rgba(242,199,199,.2)',
                    color: activeTab === tab ? 'white' : '#B8909A',
                    boxShadow: activeTab === tab ? '0 2px 10px rgba(255,183,197,.4)' : 'none',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 설명 */}
            <p style={{ fontSize: 12, color: '#B8909A', lineHeight: 1.6, marginBottom: 16 }}>
              {activeTab}에 받을 수 있는 혜택!<br />{TAB_DESC[activeTab]}
            </p>

            {/* 혜택 목록 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {BENEFITS[activeTab].map((b) => (
                <div key={b.title} className="benefit-item">
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{b.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#3D2A30', marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: '#B8909A' }}>{b.desc}</div>
                  </div>
                  <span style={{ color: '#D4B0B8', fontSize: 14, flexShrink: 0 }}>›</span>
                </div>
              ))}
            </div>

            {/* 푸터 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(242,199,199,.3)' }}>
              <span style={{ fontSize: 11, color: '#B8909A' }}>💡 소득 분위에 따라 금액이 달라져요</span>
              <button onClick={() => navigate('/chat')} style={{ fontSize: 12, fontWeight: 700, color: '#C97A52', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                더 보기 →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
