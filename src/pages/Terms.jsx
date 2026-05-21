import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Terms = () => {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAgree = async () => {
        if (!agreed) {
            alert('약관에 동의해주세요.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                'http://localhost:8080/api/auth/terms',
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // 약관 동의 완료 → 온보딩 페이지로 이동
            navigate('/onboarding');
        } catch (error) {
            console.error('약관 동의 실패:', error);
            alert('약관 동의 처리에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            backgroundColor: '#f9f9f9'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
                <h2 style={{ marginBottom: '8px', fontSize: '22px' }}>서비스 이용약관 동의</h2>
                <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
                    산책 서비스 이용을 위해 아래 약관에 동의해주세요.
                </p>

                {/* 약관 내용 */}
                <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    height: '200px',
                    overflowY: 'auto',
                    fontSize: '13px',
                    lineHeight: '1.7',
                    color: '#555',
                    marginBottom: '20px',
                    backgroundColor: '#fafafa'
                }}>
                    <p><strong>[이용약관]</strong></p>
                    <p>본 서비스는 임산부 및 영유아 가정을 위한 산책 정보 및 복지 정보를 제공합니다.</p>
                    <br />
                    <p><strong>제1조 (목적)</strong></p>
                    <p>이 약관은 산책 서비스(이하 "서비스")의 이용 조건 및 절차, 이용자와 회사의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>
                    <br />
                    <p><strong>제2조 (개인정보 수집 및 이용)</strong></p>
                    <p>서비스는 카카오 로그인을 통해 이메일, 닉네임 등 최소한의 개인정보를 수집하며, 수집된 정보는 서비스 제공 목적으로만 활용됩니다.</p>
                    <br />
                    <p><strong>제3조 (서비스 이용)</strong></p>
                    <p>비회원도 산책로 조회 등 일부 서비스를 이용할 수 있으며, 회원 가입 시 더 많은 서비스를 이용하실 수 있습니다.</p>
                </div>

                {/* 동의 체크박스 */}
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    fontSize: '15px'
                }}>
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    위 약관에 모두 동의합니다.
                </label>

                {/* 동의 버튼 */}
                <button
                    onClick={handleAgree}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: agreed ? '#FEE500' : '#e0e0e0',
                        color: agreed ? '#3c1e1e' : '#aaa',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: agreed ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? '처리 중...' : '동의하고 시작하기'}
                </button>
            </div>
        </div>
    );
};

export default Terms;
