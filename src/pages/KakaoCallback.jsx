import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
import useAuthStore from '../store/authStore';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    const setAccessToken = useAuthStore(
        (state) => state.setAccessToken
    );

    useEffect(() => {
        if (isCalled.current) return;
        isCalled.current = true;

        const code = new URL(window.location.href).searchParams.get('code');

        if (code) {
            axios.post(`${API_URL}/api/auth/kakao`, {
                auth_code: code
            })
            .then(response => {
                const { access_token, is_new_user } = response.data;

                setAccessToken(access_token);

                if (is_new_user) {
                    navigate('/terms');
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
            alert('카카오 인증 코드가 없습니다.');
            navigate('/');
        }
    }, [navigate, setAccessToken]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                fontFamily: "'Noto Sans KR', sans-serif",
                color: '#3D2A30',
            }}
        >
            <h2>카카오 로그인 처리 중입니다...</h2>
            <p>잠시만 기다려주세요.</p>
        </div>
    );
};

export default KakaoCallback;