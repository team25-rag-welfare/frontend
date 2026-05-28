import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INTRO_FEATURES = [
  { icon: '🤰', label: '임신·출산·육아', desc: '전 과정에 걸친 복지 혜택을 한곳에' },
  { icon: '📍', label: '거주지·소득 맞춤', desc: '내 상황에 딱 맞는 혜택만 골라드려요' },
  { icon: '🤖', label: 'AI 대화 상담', desc: '편하게 물어보면 바로 찾아드려요' },
  { icon: '📋', label: '신청까지 한 번에', desc: '자격·금액·신청 방법까지 안내해요' },
];

const USAGE_STEPS = [
  {
    num: '1',
    title: '내 조건 입력하기',
    desc: '나이, 거주지, 임신 상태만 알려주시면 딱 맞는 혜택을 찾아드릴 수 있어요.',
  },
  {
    num: '2',
    title: '편하게 물어보기',
    desc: '"임신 중 교통비 지원 있어?" 처럼 말하듯 물어보시면 돼요.',
  },
  {
    num: '3',
    title: '혜택 바로 확인',
    desc: '신청 자격부터 지원 금액, 신청 방법까지 한눈에 확인하세요.',
  },
];

const done = (onClose, navigate, path) => {
  localStorage.setItem('guide_seen', 'true');
  onClose();
  navigate(path);
};

export default function GuideModal({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const handleClose = () => {
    localStorage.setItem('guide_seen', 'true');
    onClose();
  };

  return (
    <div className="guide-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="guide-modal">

        <button className="guide-close-btn" onClick={handleClose}>✕</button>

        {/* 슬라이드 인디케이터 */}
        <div className="guide-dots">
          {[0, 1, 2].map((i) => (
            <button key={i} className={`guide-dot${i === step ? ' active' : ''}`} onClick={() => setStep(i)} />
          ))}
        </div>

        {/* ── 슬라이드 1: 소개 ── */}
        {step === 0 && (
          <>
            <div className="guide-hero">
              <div className="guide-hero-icon">🌿</div>
              <h2 className="guide-hero-title">산책에 오신 것을<br />환영해요!</h2>
              <p className="guide-hero-desc">임신부터 출산 후 12개월까지,<br />내가 받을 수 있는 복지 혜택을 AI가 찾아드려요.</p>
            </div>
            <div className="guide-feature-list">
              {INTRO_FEATURES.map((f) => (
                <div key={f.label} className="guide-feature-row">
                  <span className="guide-feature-icon">{f.icon}</span>
                  <div>
                    <p className="guide-feature-label">{f.label}</p>
                    <p className="guide-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── 슬라이드 2: 사용법 ── */}
        {step === 1 && (
          <>
            <div className="guide-hero">
              <div className="guide-hero-icon">💬</div>
              <h2 className="guide-hero-title">이렇게 사용하면 돼요</h2>
              <p className="guide-hero-desc">세 단계만 따라오시면 바로 혜택을 찾을 수 있어요.</p>
            </div>
            <div className="guide-steps">
              {USAGE_STEPS.map((s, i) => (
                <div key={s.num} className="guide-step">
                  <div className="guide-step-left">
                    <div className="guide-step-num">{s.num}</div>
                    {i < USAGE_STEPS.length - 1 && <div className="guide-step-line" />}
                  </div>
                  <div className="guide-step-content">
                    <p className="guide-step-title">{s.title}</p>
                    <p className="guide-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── 슬라이드 3: 시작 ── */}
        {step === 2 && (
          <>
            <div className="guide-hero">
              <div className="guide-hero-icon">✨</div>
              <h2 className="guide-hero-title">준비 완료!</h2>
              <p className="guide-hero-desc">지금 바로 시작해보세요.<br />비회원도 바로 이용할 수 있어요.</p>
            </div>
            <div className="guide-cta-area">
              <div className="guide-cta-note">
                💡 로그인하면 대화 기록이 저장되고<br />내 조건에 맞는 혜택을 더 정확하게 찾아드려요.
              </div>
              <button className="guide-cta-primary" onClick={() => done(onClose, navigate, '/login')}>
                로그인하고 시작하기
              </button>
              <button className="guide-cta-secondary" onClick={() => done(onClose, navigate, '/chat')}>
                비회원으로 시작하기
              </button>
            </div>
          </>
        )}

        {/* 하단 네비게이션 */}
        <div className="guide-footer">
          {step > 0
            ? <button className="guide-nav-btn" onClick={() => setStep(p => p - 1)}>← 이전</button>
            : <div />
          }
          {step < 2 && (
            <button className="guide-nav-btn primary" onClick={() => setStep(p => p + 1)}>다음 →</button>
          )}
        </div>

      </div>
    </div>
  );
}
