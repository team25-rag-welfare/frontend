import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/bg.png';

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  const handleGoogleLogin = () => {
    alert('구글 간편로그인은 서비스 준비 중입니다. 카카오 로그인을 이용해 주세요!');
  };

  const handleNaverLogin = () => {
    alert('네이버 간편로그인은 서비스 준비 중입니다. 카카오 로그인을 이용해 주세요!');
  };

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      localStorage.removeItem('access_token');
      setIsLoggedIn(false);
      alert('로그아웃 되었습니다.');
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-no-repeat bg-cover bg-center md:bg-[size:110%_auto] md:bg-[position:70%_20%] relative flex flex-col font-sans select-none"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-4 bg-white/45 backdrop-blur-xl border-b border-white/30 z-20 absolute top-0 left-0">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/')}>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#FF9E9E] relative leading-none tracking-tight font-jua">
              산책
              <span className="absolute -top-1.5 -right-3 text-sm text-[#FF8585] animate-heartbeat">♥</span>
            </h1>
            <span className="text-[10px] text-[#8FA691] font-bold tracking-widest mt-1.5 font-gowun">산모를 위한 복지 체크</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-6 md:gap-10 text-sm font-bold text-[#FF9E9E] font-gowun">
          <a href="#" className="hover:text-[#FF8585] transition-colors relative group py-1 hidden sm:inline-block">
            서비스 소개
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF8585] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-[#FF8585] transition-colors relative group py-1 hidden sm:inline-block">
            혜택 안내
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF8585] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" className="hover:text-[#FF8585] transition-colors relative group py-1 hidden sm:inline-block">
            이용 방법
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF8585] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <button 
            onClick={() => isLoggedIn ? navigate('/chat') : handleKakaoLogin()}
            className="bg-[#FFB3C1] hover:bg-[#FFA0B2] text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_14px_rgba(255,179,193,0.4)] hover:shadow-[0_6px_20px_rgba(255,179,193,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
          >
            <span>시작하기</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-12 gap-12 lg:gap-0">
        
        {/* Left Side: Typography */}
        <div className="flex flex-col gap-6 text-gray-800 max-w-lg lg:self-center select-none text-center lg:text-left">
          <div className="flex flex-col gap-1 items-center lg:items-start">
            <h1 className="text-6xl font-bold text-[#FF9E9E] relative leading-none tracking-tight font-jua w-fit">
              산책
              <span className="absolute -top-3.5 -right-7 text-3xl text-[#FF8585] animate-heartbeat">♥</span>
            </h1>
            <p className="text-lg font-bold text-[#8FA691] tracking-wider mt-3 ml-1 font-gowun">산모를 위한 복지 체크</p>
          </div>
          
          <div className="text-3xl md:text-[34px] leading-relaxed font-bold text-[#D46A6A] mt-6 tracking-tight drop-shadow-xs font-gowun">
            <p className="md:inline-block">산모를 위한 <span className="text-[#FF6B6B] border-b-4 border-[#FFCCD5] pb-0.5 font-extrabold">복지 혜택</span>을</p>
            <p className="mt-2 md:mt-3">함께 쉽고 편리하게 확인하세요.</p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="bg-white/65 backdrop-blur-xl rounded-[32px] p-8 md:p-10 w-full max-w-[420px] shadow-[0_20px_50px_rgba(255,182,193,0.2)] flex flex-col items-center border border-white/60 z-10">
          <h2 className="text-2xl font-bold text-[#6D5A5A] tracking-tight font-gowun">간편하게 시작해보세요</h2>
          <p className="text-xs text-[#8F8282] mt-2.5 mb-8 tracking-tight font-medium font-gowun">자주 사용하는 계정으로 빠르게 로그인할 수 있어요</p>
          
          {isLoggedIn ? (
            <div className="flex flex-col items-center w-full gap-5 font-gowun">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 w-full text-center flex flex-col gap-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <span className="text-2xl animate-bounce-subtle">🎉</span>
                <p className="text-emerald-700 font-bold text-sm">이미 정상적으로 로그인되어 있습니다.</p>
              </div>
              
              <button 
                onClick={() => navigate('/chat')}
                className="w-full h-[52px] flex items-center justify-center bg-[#FF9E9E] hover:bg-[#FF8585] text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_4px_14px_rgba(255,158,158,0.35)] hover:shadow-[0_6px_20px_rgba(255,158,158,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-base"
              >
                대화하러 가기 &rarr;
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full h-[52px] flex items-center justify-center bg-white hover:bg-red-50/50 text-red-400 hover:text-red-500 font-semibold rounded-2xl transition-all duration-300 border border-red-100 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex flex-col w-full gap-4">
              {/* Google Button */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full h-[52px] relative flex items-center bg-white hover:bg-gray-50/80 text-[#374151] font-bold rounded-2xl transition-all duration-300 border border-gray-200/80 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-gowun"
              >
                <div className="absolute left-6 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                </div>
                <span className="w-full text-center font-bold">Google로 시작하기</span>
              </button>

              {/* Kakao Button */}
              <button 
                onClick={handleKakaoLogin}
                className="w-full h-[52px] relative flex items-center bg-[#FEE500] hover:bg-[#FADA0A] text-[#3C1E1E] font-bold rounded-2xl transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-gowun"
              >
                <div className="absolute left-6 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 3c-4.97 0-9 3.163-9 7.066 0 2.488 1.583 4.677 3.992 5.946L6.112 19.23c-.066.24.228.404.413.229l3.78-3.553c.55.073 1.12.112 1.7.112 4.97 0 9-3.163 9-7.066C21 6.163 16.97 3 12 3z" fill="#3C1E1E"/>
                  </svg>
                </div>
                <span className="w-full text-center font-bold">Kakao로 시작하기</span>
              </button>

              {/* Naver Button */}
              <button 
                onClick={handleNaverLogin}
                className="w-full h-[52px] relative flex items-center bg-[#03C75A] hover:bg-[#02B552] text-white font-bold rounded-2xl transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-gowun"
              >
                <div className="absolute left-6 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.2 3H21v18h-4.8l-8.4-12v12H3V3h4.8l8.4 12V3z" fill="#FFFFFF"/>
                  </svg>
                </div>
                <span className="w-full text-center font-bold">Naver로 시작하기</span>
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Login;
