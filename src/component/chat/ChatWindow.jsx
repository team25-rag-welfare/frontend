import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import Onboarding from '../Onboarding';
import Button from '../ui/Button';
import DeleteCalendar from '../ui/DeleteCalendar';

const CHIPS = [
  { label: '🤰 임신 중 혜택',    text: '임신 중에 받을 수 있는 혜택이 뭐가 있나요?' },
  { label: '🍼 출산 바우처',     text: '출산 후 신청할 수 있는 바우처가 있나요?' },
  { label: '💼 육아휴직 급여',   text: '육아휴직 급여는 얼마나 받을 수 있나요?' },
  { label: '🏠 건강관리사',      text: '산모·신생아 건강관리사 서비스를 신청하고 싶어요' },
  { label: '👶 둘째 추가 혜택',  text: '둘째 아이 혜택은 첫째와 다른가요?' },
  { label: '📋 지금 신청할 혜택', text: '지금 당장 신청해야 할 혜택을 알려주세요' },
];

function Avatar() {
  return (
    <img src="/Frame.svg" alt="산책" style={{ width: 52, height: 52, objectFit: 'contain', flexShrink: 0 }} />
  );
}

const HIGHLIGHT_STYLE = {
  background: 'var(--petal-light)',
  color: 'var(--petal-dark)',
  borderRadius: 3,
  padding: '0 2px',
  fontWeight: 700,
};

function splitHighlight(text, keyword) {
  if (!keyword) return text;
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={i} style={HIGHLIGHT_STYLE}>{part}</mark>
      : part
  );
}

function applyHighlight(node, keyword) {
  if (!keyword) return node;
  if (typeof node === 'string') {
    const parts = node.split(new RegExp(`(${keyword})`, 'gi'));
    if (parts.length === 1) return node;
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase()
        ? <mark key={i} style={HIGHLIGHT_STYLE}>{part}</mark>
        : part
    );
  }
  if (Array.isArray(node)) return node.map((child) => applyHighlight(child, keyword));
  if (React.isValidElement(node) && node.props.children) {
    return React.cloneElement(node, { key: node.key }, applyHighlight(node.props.children, keyword));
  }
  return node;
}

function mdComponents(keyword) {
  const wrap = (Tag) => ({ children, ...props }) => <Tag {...props}>{applyHighlight(children, keyword)}</Tag>;
  return {
    p: wrap('p'), li: wrap('li'), td: wrap('td'), th: wrap('th'),
    h1: wrap('h1'), h2: wrap('h2'), h3: wrap('h3'),
    strong: wrap('strong'), em: wrap('em'),
  };
}

function MessageRow({ msg, keyword, onRegenerate, isLoading }) {
  const isUser = msg.senderType === 'USER';
  return (
    <div id={`msg-${msg.id}`} className={`msg-row anim-fadeup ${isUser ? 'msg-row-user' : 'msg-row-ai'}`}>
      {!isUser && <Avatar />}
      <div className={`msg-bubble-wrapper ${isUser ? 'msg-bubble-wrapper-user' : 'msg-bubble-wrapper-ai'}`}>
        <div className={isUser ? 'bubble-user' : 'bubble-ai'}>
          {isUser
            ? <span style={{ whiteSpace: 'pre-wrap' }}>{splitHighlight(msg.content, keyword)}</span>
            : <div className="md-content"><ReactMarkdown remarkPlugins={[remarkBreaks]} components={mdComponents(keyword)}>{msg.content}</ReactMarkdown></div>
          }
        </div>
        {!isUser && (
          <button className="msg-regen-btn" onClick={() => onRegenerate(msg.id)} disabled={isLoading}>
            ↺
          </button>
        )}
      </div>
    </div>
  );
}

function TypingRow() {
  return (
    <div className="typing-row">
      <Avatar />
      <div className="typing-row-inner">
        <span className="typing-label">산책</span>
        <div className="bubble-ai">
          <div className="typing-dots">
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

export default function ChatWindow({ isLoggedIn, user, messages, onSendMessage, onRegenerate, isLoading, showOnboarding, onOnboardingComplete, jumpToDate, searchMatches = [], searchKeyword = '', onClearSearch, onDeleteAll, onDeleteByDate }) {
  const [inputText, setInputText] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDateDelete, setShowDateDelete] = useState(false);
  const scrollRef = useRef(null);
  const taRef = useRef(null);
  const dropdownRef = useRef(null);

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
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading && taRef.current) taRef.current.focus();
  }, [isLoading]);

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
    if (!inputText.trim() || isLoading) return;
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
    <div className="chat-window">

      {/* 헤더 */}
      <div className="chat-header">
        <span className="badge badge-ghost">
          {isLoggedIn ? `✓ 회원 / 만 ${user?.userAge ?? ''}세` : '👤 비회원'}
        </span>

        {/* 대화 삭제 드롭다운 */}
        <div ref={dropdownRef} className="chat-delete-dropdown">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDropdown(v => !v)}
          >
            대화 삭제 ▾
          </Button>
          {showDropdown && (
            <div className="chat-delete-dropdown-list">
              <button
                className="chat-delete-dropdown-item"
                onClick={() => { setShowDropdown(false); setShowDeleteAllModal(true); }}
              >전체 삭제</button>
              <div className="chat-delete-dropdown-divider" />
              <button
                className="chat-delete-dropdown-item"
                onClick={() => { setShowDropdown(false); setShowDateDelete(true); }}
              >날짜별 삭제</button>
            </div>
          )}
        </div>
      </div>

      {/* 검색 네비바 */}
      {searchMatches.length > 0 && (
        <div className="chat-search-nav">
          <span className="chat-search-nav-text">
            "{searchKeyword}" — {searchIndex + 1} / {searchMatches.length}개
          </span>
          <div className="chat-search-nav-btns">
            <button className="chat-search-nav-btn" onClick={() => setSearchIndex(i => Math.max(0, i - 1))} disabled={searchIndex === 0}>↑</button>
            <button className="chat-search-nav-btn" onClick={() => setSearchIndex(i => Math.min(searchMatches.length - 1, i + 1))} disabled={searchIndex === searchMatches.length - 1}>↓</button>
            <button className="chat-search-nav-close" onClick={onClearSearch}>✕</button>
          </div>
        </div>
      )}

      {/* 채팅 스크롤 */}
      <div ref={scrollRef} className="chat-scroll chat-body">
        <div className="chat-messages">

          {showOnboarding && (
            <div className="chat-onboarding-center">
              <Onboarding onClose={onOnboardingComplete} />
            </div>
          )}

          {showWelcome && (
            <div className="chat-welcome anim-fadeup">
              <div className="chat-welcome-icon">🌿</div>
              <h2 className="chat-welcome-title">안녕하세요! 산책이에요 😊</h2>
              <p className="chat-welcome-desc">
                임신부터 출산 후 12개월까지<br />꼭 받아야 할 복지 혜택을 찾아드릴게요.
              </p>
              <div className="chat-chips">
                {CHIPS.map(({ label, text }) => (
                  <button key={label} className="chip" onClick={() => onSendMessage(text)}>
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
                  <div id={`date-${dateKey}`} className="chat-date-separator">
                    <div className="chat-date-line" />
                    <span className="chat-date-label">{formatDateLabel(dateKey)}</span>
                    <div className="chat-date-line" />
                  </div>
                )}
                <MessageRow msg={msg} keyword={searchKeyword} onRegenerate={onRegenerate} isLoading={isLoading} />
              </React.Fragment>
            );
          })}

          {isLoading && <TypingRow />}
        </div>
      </div>

      {/* 전체 삭제 확인 모달 */}
      {showDeleteAllModal && (
        <div className="modal-overlay">
          <div className="modal-card delete-all-modal">
            <div className="delete-all-modal-icon">🗑️</div>
            <div>
              <h2>전체 대화 삭제</h2>
              <p>
                지금까지의 모든 대화 내용이<br />
                <span className="delete-all-modal-highlight">영구적으로 삭제</span>됩니다.<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="delete-all-modal-btns">
              <Button variant="secondary" size="md" onClick={() => setShowDeleteAllModal(false)} style={{ flex: 1 }}>취소</Button>
              <Button variant="primary" size="md" onClick={() => { setShowDeleteAllModal(false); onDeleteAll(); }} style={{ flex: 1 }}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {/* 날짜별 삭제 모달 */}
      {showDateDelete && (
        <DeleteCalendar
          activeDates={[...new Set(messages.filter(m => m.createdAt).map(m => getDateKey(m.createdAt)))]}
          onConfirm={onDeleteByDate}
          onClose={() => setShowDateDelete(false)}
        />
      )}

      {/* 입력 */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <div className="chat-input-row">
            <img src="/dog.png" alt="" className="chat-mascot" />
            <div className="chat-input-box">
              <textarea
                ref={taRef}
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); autoResize(e.target); }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder='궁금한 혜택을 물어보세요'
                disabled={isLoading}
                rows={1}
                className="chat-textarea"
              />
              <button onClick={handleSend} disabled={isLoading} className="chat-send-btn">
                ↑
              </button>
            </div>
          </div>
          <p className="chat-footer-text">
            산책은 공식 정부 복지 정책 기반으로 안내드립니다 · 최종 확인은 관련 기관에 문의하세요
          </p>
        </div>
      </div>
    </div>
  );
}
