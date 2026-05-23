import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleKakaoLogin = () => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };

  return (
    <div className="login-page">
      <nav className="login-nav">
        <img src="/logo.png" alt="산책" className="login-nav-logo" onClick={() => navigate('/')} />
        <button onClick={() => navigate('/')} className="btn-home">홈으로</button>
      </nav>

      <div className="login-bg">
        <div className="login-bg-gradient" />
        <div className="blob blob-mint-lg" style={{ top: -80, left: '-5%' }} />
        <div className="blob blob-mint-md" style={{ bottom: -60, right: '10%' }} />
        <div className="blob blob-pink-md" style={{ top: '15%', right: '5%' }} />
        <div className="blob blob-white"   style={{ top: '35%', left: '35%' }} />

        <div className="login-card-center">
          <div className="login-card">
            <img src="/logo.png" alt="산책" className="login-card-logo" />
            <div className="login-tag">✦ 맞춤 복지 혜택을 위한 로그인</div>
            <h1 className="login-title">
              산책을<br />시작해볼까요?
            </h1>
            <p className="login-desc">
              로그인하면 임신·출산·육아 상황에 맞는<br />
              복지 혜택을 더 정확하게 확인할 수 있어요.
            </p>
            <button onClick={handleKakaoLogin} className="btn-kakao">카카오로 시작하기</button>
            <button onClick={() => navigate('/chat')} className="btn-guest">로그인 없이 둘러보기</button>
            <p className="login-notice">로그인은 맞춤 혜택 추천과 상담 기록 저장을 위해 사용돼요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
