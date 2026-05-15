import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    useEffect(() => {
        if (isCalled.current) return;
        isCalled.current = true;

        const code = new URL(window.location.href).searchParams.get('code');
        
        if (code) {
            axios.post('http://localhost:8080/api/auth/kakao', {
                auth_code: code
            })
            .then(response => {
                const { access_token, is_new_user } = response.data;
                localStorage.setItem('access_token', access_token);
                
                if (is_new_user) {
                    navigate('/terms');   // 신규 회원 → 약관동의 → 온보딩 순서
                } else {
                    navigate('/chat');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('로그인에 실패했습니다.');
                navigate('/');
            });
        } else {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <h2>카카오 로그인 처리 중입니다...</h2>
            <p>잠시만 기다려주세요.</p>
        </div>
    );
};

export default KakaoCallback;
