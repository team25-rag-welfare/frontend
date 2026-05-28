import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../ui/Button';
import Input from '../ui/Input';
import MiniCalendar from '../ui/MiniCalendar';
import useAuthStore from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_LABEL = {
  PLANNING: '임신 준비 중',
  PREGNANT: '임신 중',
  POSTPARTUM: '출산 후'
};

function InfoRow({ label, value, highlight }) {
  return (
    <div className="info-row">
      <span className="info-row-label">{label}</span>
      <span className={`info-row-value${highlight ? ' highlight' : ''}`}>
        {value ?? '미입력'}
      </span>
    </div>
  );
}

const getDateKey = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

export default function ChatSidebar({ isLoggedIn, user, messages = [], onLogout, onEditCondition, onDateSelect, onSearch, onOpenSettings, onShowDeleteAll, onShowDeleteByDate }) {
  const navigate = useNavigate();
  const u = user || {
    userName: null,
    userAge: null,
    pregnancyStatus: null,
    district: null,
    childCount: null,
    isMultibirth: null,
    isForeigner: null,
    residenceMonths: null,
    pregnancyWeeks: null,
    infantMonths: null,
    incomeLevel: null,
    isHomeless: null,
  };

  const { accessToken } = useAuthStore();
  const [keyword, setKeyword] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const deleteMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (deleteMenuRef.current && !deleteMenuRef.current.contains(e.target)) {
        setShowDeleteMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const uniqueDates = [...new Set(
    messages.filter(m => m.createdAt).map(m => getDateKey(m.createdAt))
  )].reverse();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      onSearch([], '');
      return;
    }

    if (!isLoggedIn) {
      const matchedIds = messages
        .filter(m => m.content?.includes(keyword))
        .map(m => m.id);
      onSearch(matchedIds, keyword);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/v2/chats/search?keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const resultTimes = new Set(res.data.content.map(r => r.createdAt));
      const matchedIds = messages
        .filter(m => m.createdAt && resultTimes.has(m.createdAt))
        .map(m => m.id);
      onSearch(matchedIds, keyword);
    } catch {
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const statusLabel = STATUS_LABEL[u.pregnancyStatus] || '미입력';

  const calcPregnancyWeeks = (dueDate) => {
    if (!dueDate) return null;
    const weeks = 40 - Math.round((new Date(dueDate) - new Date()) / (7 * 24 * 60 * 60 * 1000));
    return weeks >= 1 && weeks <= 42 ? weeks : null;
  };

  const pregnancyWeeks = calcPregnancyWeeks(u.dueDate);

  const subStatus = [
    u.pregnancyStatus === 'PREGNANT' && pregnancyWeeks ? `${pregnancyWeeks}주차` : null,
    u.pregnancyStatus === 'POSTPARTUM' && u.infantMonths ? `영아 ${u.infantMonths}개월` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="sidebar">

      <div className="sidebar-logo-area">
        <img src="/logo.png" alt="산책" onClick={() => navigate('/')} className="sidebar-logo" />
      </div>

      <div className="sidebar-search-area">
        <div className="sidebar-search-icon-row">
          <button
            onClick={() => { setShowSearch(v => !v); setShowCalendar(false); }}
            className={`sidebar-icon-btn${showSearch ? ' active' : ''}`}
            title="검색"
          >
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {isLoggedIn && (
            <div ref={deleteMenuRef} className="sidebar-delete-wrap">
              <button
                onClick={() => setShowDeleteMenu(v => !v)}
                className={`sidebar-icon-btn${showDeleteMenu ? ' active' : ''}`}
                title="대화 삭제"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4h10M6 4V2.5h3V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 4l.5 9h7l.5-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showDeleteMenu && (
                <div className="sidebar-delete-menu">
                  <button className="sidebar-delete-menu-item" onClick={() => { setShowDeleteMenu(false); onShowDeleteAll(); }}>전체 삭제</button>
                  <button className="sidebar-delete-menu-item" onClick={() => { setShowDeleteMenu(false); onShowDeleteByDate(); }}>날짜별 삭제</button>
                </div>
              )}
            </div>
          )}
        </div>

        {showSearch && (
          <div className="sidebar-search-row">
            <div className="sidebar-search-input-wrap">
              <Input
                shape="pill"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="내 대화 기록 찾기"
                style={{ paddingRight: 36, fontSize: 12 }}
              />
              <button onClick={handleSearch} className="sidebar-search-btn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <button
              onClick={() => setShowCalendar(v => !v)}
              className={`sidebar-cal-btn${showCalendar ? ' active' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {showSearch && showCalendar && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, padding: '0 16px' }}>
            <MiniCalendar
              activeDates={uniqueDates}
              onDateSelect={onDateSelect}
              onClose={() => setShowCalendar(false)}
            />
          </div>
        )}
      </div>

      <div className="sidebar-body chat-scroll">
        <div className="sidebar-user-section">
          {!isLoggedIn && (
            <div className="sidebar-login-gate">
              <span className="sidebar-login-gate-icon">🔒</span>
              <p className="sidebar-login-gate-text">로그인 후<br />이용 가능합니다</p>
              <button onClick={() => navigate('/login')} className="sidebar-login-gate-btn">
                로그인하기
              </button>
            </div>
          )}
          <div className={isLoggedIn ? '' : 'sidebar-section-blurred'}>
            <div className="sidebar-profile-card">
              <div className="sidebar-profile-avatar">
                <img
                  src={u.profileImageUrl || '/Frame.svg'}
                  alt="프로필"
                  className="sidebar-profile-img"
                />
              </div>
              <div className="sidebar-profile-info">
                <span className="sidebar-profile-name">{u.userName || '반가워요!'}</span>
                <span className="sidebar-profile-id">#{u.userId ? u.userId : '비회원'}</span>
              </div>
            </div>

            <p className="sidebar-section-title">내 조건</p>

            <div className="sidebar-status">
              <span className="sidebar-status-dot" />
              <div>
                <p className="sidebar-status-label">{statusLabel}</p>
                {subStatus && <p className="sidebar-status-sub">{subStatus}</p>}
              </div>
            </div>

            <div className="sidebar-info-list">
              <InfoRow label="거주지" value={u.district ?? null} highlight={u.district != null} />
              <InfoRow label="만 나이" value={u.userAge != null ? `${u.userAge}세` : null} highlight={u.userAge != null} />
              <InfoRow label="자녀 수" value={u.childCount != null ? `${u.childCount}명` : null} highlight={u.childCount != null} />
              <InfoRow label="주택 소유" value={u.isHomeless == null ? null : u.isHomeless ? '없음' : '보유'} highlight={u.isHomeless != null} />
              <InfoRow label="소득 구간" value={u.incomeLevel != null ? `${u.incomeLevel}분위` : null} highlight={u.incomeLevel != null} />
              <InfoRow label="다태아 여부" value={u.isMultibirth == null ? null : u.isMultibirth ? '해당' : '해당 없음'} highlight={u.isMultibirth === true} />
              <InfoRow label="외국인 여부" value={u.isForeigner == null ? null : u.isForeigner ? '해당' : '해당 없음'} highlight={u.isForeigner === true} />
              <InfoRow label="거주 기간" value={u.residenceMonths != null ? `${u.residenceMonths}개월` : null} highlight={u.residenceMonths != null} />
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-card-wrap">
          <div className={`card-petal sidebar-card${isLoggedIn ? '' : ' sidebar-section-blurred'}`}>
            <p className="sidebar-card-title">내 복지 조건</p>
            <p className="sidebar-card-desc">
              조건을 업데이트하면
              <br />
              더 정확한 혜택을 찾아드려요!
            </p>
            <Button variant="primary" size="sm" onClick={onEditCondition} style={{ width: '100%' }}>
              조건 수정하기
            </Button>
          </div>
        </div>

        <div className="sidebar-actions">
          {isLoggedIn && (
            <button onClick={onLogout} className="sidebar-logout-btn">로그아웃</button>
          )}
          <button onClick={onOpenSettings} className="sidebar-icon-btn sidebar-settings-btn">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7.5 1.5v1.2M7.5 12.3v1.2M1.5 7.5h1.2M12.3 7.5h1.2M3.4 3.4l.85.85M10.75 10.75l.85.85M3.4 11.6l.85-.85M10.75 4.25l.85-.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
