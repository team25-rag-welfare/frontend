import React, { useState, useRef, useEffect } from 'react';
import Onboarding from '../Onboarding';
import Button from '../ui/Button';

const CHIPS = [
  { label: '🤰 임신 중 혜택',    text: '임신 중에 받을 수 있는 혜택이 뭐가 있나요?' },
  { label: '🍼 출산 바우처',     text: '출산 후 신청할 수 있는 바우처가 있나요?' },
  { label: '💼 육아휴직 급여',   text: '육아휴직 급여는 얼마나 받을 수 있나요?' },
  { label: '🏠 건강관리사',      text: '산모·신생아 건강관리사 서비스를 신청하고 싶어요' },
  { label: '👶 둘째 추가 혜택',  text: '둘째 아이 혜택은 첫째와 다른가요?' },
  { label: '📋 지금 신청할 혜택', text: '지금 당장 신청해야 할 혜택을 알려주세요' },
];

function Avatar({ type }) {
  const base = {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: 16,
  };
  if (type === 'user') {
    return (
      <div style={{ ...base, background: 'linear-gradient(135deg,#D5F3D8,#68B872)', color: 'white', fontSize: 12, fontWeight: 700 }}>
        나
      </div>
    );
  }
  return (
    <div style={{ ...base, background: 'linear-gradient(135deg,var(--petal),#F4A0B0)' }}>
      🌸
    </div>
  );
}

function highlightText(text, keyword) {
  if (!keyword) return text;
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={i} style={{ background: '#FFE066', borderRadius: 2, padding: '0 1px' }}>{part}</mark>
      : part
  );
}

function MessageRow({ msg, keyword }) {
  const isUser = msg.senderType === 'USER';
  return (
    <div
      id={`msg-${msg.id}`}
      className="anim-fadeup"
      style={{
        display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-start',
        borderRadius: 16, padding: '4px',
        background: 'transparent',
        transition: 'all .2s',
      }}
    >
      <Avatar type={isUser ? 'user' : 'ai'} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth: '68%' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-lt)', marginBottom: 4, fontWeight: 500 }}>
          {isUser ? '나' : '산책'}
        </span>
        <div className={isUser ? 'bubble-user' : 'bubble-ai'} style={{ whiteSpace: 'pre-wrap' }}>
          {highlightText(msg.content, keyword)}
        </div>
      </div>
    </div>
  );
}

function TypingRow() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <Avatar type="ai" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-lt)', marginBottom: 4, fontWeight: 500 }}>산책</span>
        <div className="bubble-ai">
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '2px 0' }}>
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

const getDateKey = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);
const formatDateLabel = (dateKey) => dateKey.replace(/-/g, '.');

export default function ChatWindow({ isLoggedIn, user, messages, onSendMessage, isLoading, showOnboarding, onOnboardingComplete, jumpToDate, searchMatches = [], searchKeyword = '', onClearSearch }) {
  const [inputText, setInputText] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const scrollRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    if (!jumpToDate) return;
    const container = scrollRef.current;
    const el = document.getElementById(`date-${jumpToDate}`);
    if (el && container) {
      container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior: 'smooth' });
    }
  }, [jumpToDate]);

  useEffect(() => { setSearchIndex(0); }, [searchMatches]);

  useEffect(() => {
    if (!searchMatches.length) return;
    const container = scrollRef.current;
    const el = document.getElementById(`msg-${searchMatches[searchIndex]}`);
    if (el && container) {
      const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
      container.scrollTo({ top, behavior: 'smooth' });
    }
  }, [searchIndex, searchMatches]);

  const handleSend = () => {
    if (!inputText.trim() || !isLoggedIn || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
    if (taRef.current) taRef.current.style.height = 'auto';
  };

  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const showWelcome = messages.length === 0 && !showOnboarding;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F6FBF6' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', background: 'var(--snow)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="badge badge-ghost">
            {isLoggedIn ? `✓ 회원 / 만 ${user?.userAge ?? ''}세` : '👤 비회원'}
          </span>
        </div>
        <Button variant="danger" size="sm">대화 삭제</Button>
      </div>

      {/* 검색 네비바 */}
      {searchMatches.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 32px', background: 'var(--petal-bg)', borderBottom: '1px solid var(--petal-light)', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--petal-dark)', fontWeight: 600 }}>
            "{searchKeyword}" — {searchIndex + 1} / {searchMatches.length}개
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setSearchIndex(i => Math.max(0, i - 1))} disabled={searchIndex === 0} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--petal-dark)', opacity: searchIndex === 0 ? 0.3 : 1 }}>↑</button>
            <button onClick={() => setSearchIndex(i => Math.min(searchMatches.length - 1, i + 1))} disabled={searchIndex === searchMatches.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--petal-dark)', opacity: searchIndex === searchMatches.length - 1 ? 0.3 : 1 }}>↓</button>
            <button onClick={onClearSearch} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--ink-lt)', marginLeft: 4 }}>✕</button>
          </div>
        </div>
      )}

      {/* 채팅 스크롤 */}
      <div ref={scrollRef} className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '36px 0', background: '#F6FBF6' }}>
        <div style={{ maxWidth: 800, width: '100%', margin: '0 auto', padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {showOnboarding && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
              <Onboarding onClose={onOnboardingComplete} />
            </div>
          )}

          {showWelcome && (
            <div className="anim-fadeup" style={{ textAlign: 'center', padding: '32px 0 16px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: 20, fontSize: 28, marginBottom: 16,
                background: 'linear-gradient(135deg,var(--petal-bg),#FFF0F2)',
                border: '1.5px solid rgba(255,183,197,.2)',
                boxShadow: 'var(--shadow-petal)',
              }}>
                🌿
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.5px', marginBottom: 8 }}>
                안녕하세요! 산책이에요 😊
              </h2>
              <p style={{ fontSize: 13, color: 'var(--ink-lt)', lineHeight: 1.8, marginBottom: 24 }}>
                임신부터 출산 후 12개월까지<br />꼭 받아야 할 복지 혜택을 찾아드릴게요.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {CHIPS.map(({ label, text }) => (
                  <button key={label} className="chip" onClick={() => isLoggedIn && onSendMessage(text)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const dateKey = msg.createdAt ? getDateKey(msg.createdAt) : null;
            const prevDateKey = i > 0 && messages[i-1].createdAt ? getDateKey(messages[i-1].createdAt) : null;
            const showSeparator = dateKey && dateKey !== prevDateKey;
            return (
              <React.Fragment key={msg.id}>
                {showSeparator && (
                  <div id={`date-${dateKey}`} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ fontSize: 11, color: 'var(--ink-hint)', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatDateLabel(dateKey)}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                )}
                <MessageRow msg={msg} keyword={searchKeyword} />
              </React.Fragment>
            );
          })}

          {isLoading && <TypingRow />}
        </div>
      </div>

      {/* 입력 */}
      <div style={{ padding: '12px 32px 20px', background: 'var(--snow)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ maxWidth: 800, width: '100%', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 10, padding: '10px 14px',
            background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 18,
            transition: 'all .2s',
          }}>
            <textarea
              ref={taRef}
              value={inputText}
              onChange={(e) => { setInputText(e.target.value); autoResize(e.target); }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isLoggedIn ? '궁금한 혜택을 편하게 물어보세요...' : '로그인 후 질문하실 수 있습니다.'}
              disabled={!isLoggedIn || isLoading}
              rows={1}
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontSize: 14, color: 'var(--ink)', resize: 'none', fontFamily: 'inherit',
                lineHeight: 1.6, minHeight: 24, maxHeight: 120, overflowY: 'auto',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!isLoggedIn || isLoading}
              style={{
                width: 38, height: 38, borderRadius: 12, border: 'none', flexShrink: 0,
                background: 'linear-gradient(135deg,var(--petal),#F096AD)',
                color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                boxShadow: 'var(--shadow-petal)', transition: 'all .2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (!isLoggedIn || isLoading) ? 0.4 : 1,
              }}
            >
              ↑
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--ink-hint)', marginTop: 8 }}>
            산책은 공식 정부 복지 정책 기반으로 안내드립니다 · 최종 확인은 관련 기관에 문의하세요
          </p>
        </div>
      </div>
    </div>
  );
}
