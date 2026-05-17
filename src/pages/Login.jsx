import React from 'react';
import bgImage from '../assets/images/bg.png';

const Login = () => {
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex flex-col font-sans"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-4 bg-white/40 backdrop-blur-sm shadow-sm z-10 absolute top-0 left-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-[#FFA07A] flex items-center gap-1">
            산책
            <span className="text-sm">♥</span>
          </h1>
          <span className="text-xs text-gray-600 font-medium tracking-tight">산모를 위한 복지 체크</span>
        </div>
        
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-gray-800 transition-colors">서비스 소개</a>
          <a href="#" className="hover:text-gray-800 transition-colors">혜택 안내</a>
          <a href="#" className="hover:text-gray-800 transition-colors">이용 방법</a>
          <button className="bg-pink-300 hover:bg-pink-400 text-white px-5 py-2 rounded-full font-bold shadow-md transition-colors">
            시작하기 &rarr;
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-between w-full max-w-7xl mx-auto px-8 pt-20">
        
        {/* Left Side: Typography */}
        <div className="flex flex-col gap-4 text-gray-800">
          <div className="mb-2">
            <h1 className="text-6xl font-extrabold text-[#FFA07A] flex items-center gap-2 drop-shadow-md">
              산책
              <span className="text-3xl text-pink-400">♥</span>
            </h1>
            <p className="text-xl font-semibold text-gray-700 mt-1">산모를 위한 복지 체크</p>
          </div>
          
          <div className="text-2xl leading-relaxed font-bold text-gray-700 drop-shadow-sm">
            <p>산모를 위한 <span className="text-[#FFA07A]">복지 혜택</span>을</p>
            <p>함께 쉽고 편리하게 확인하세요.</p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-10 w-[420px] shadow-2xl flex flex-col items-center border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">간편하게 시작해보세요</h2>
          <p className="text-sm text-gray-500 mb-8 font-medium">자주 사용하는 계정으로 빠르게 로그인할 수 있어요</p>
          
          <button 
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#F4DC00] text-black/85 font-semibold py-4 px-6 rounded-xl transition-all shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 2C4.02944 2 0 5.16335 0 9.06604C0 11.5541 1.5833 13.7431 3.99222 15.0118L3.11186 18.2325C3.04586 18.4735 3.32757 18.6366 3.51319 18.4619L7.29177 14.9084C7.84275 14.9818 8.41369 15.0211 9 15.0211C13.9706 15.0211 18 11.8577 18 7.95506C18 4.05237 13.9706 2 9 2Z" fill="#000000"/>
            </svg>
            Kakao로 시작하기
          </button>
        </div>

      </main>
    </div>
  );
};

export default Login;
