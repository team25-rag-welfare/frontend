import React from 'react';

const KakaoLoginButton = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code`;

    const handleLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    return (
        <button onClick={handleLogin} style={{
            backgroundColor: '#FEE500', 
            color: '#000000', 
            border: 'none', 
            borderRadius: '12px', 
            padding: '15px 30px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
        }}>
            카카오 계정으로 로그인
        </button>
    );
};

export default KakaoLoginButton;
