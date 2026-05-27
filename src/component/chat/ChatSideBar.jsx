import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../ui/Button';
import Input from '../ui/Input';
import MiniCalendar from '../ui/MiniCalendar';

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

export default function ChatSidebar({ isLoggedIn, user, messages = [], onLogout, onEditCondition, onDateSelect, onSearch, onOpenSettings }) {
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

  const [keyword, setKeyword] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const uniqueDates = [...new Set(
    messages.filter(m => m.createdAt).map(m => getDateKey(m.createdAt))
  )].reverse();
  const token = () => localStorage.getItem('access_token');
  if (!token) {
    alert("회원 전용 기능입니다. 로그인 하고 오십시오.");
    return;
  }

  const handleSearch = async () => {
    if (!keyword.trim()) {
      onSearch([], '');
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/api/v2/chats/search?keyword=${keyword}`,
        { headers: { Authorization: `Bearer ${token()}` } }
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

  const subStatus = [
    u.pregnancyWeeks ? `${u.pregnancyWeeks}주차` : null,
    u.infantMonths ? `영아 ${u.infantMonths}개월` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="sidebar">

      <div className="sidebar-logo-area">
        <img src="/logo.png" alt="산책" onClick={() => navigate('/')} className="sidebar-logo" />
      </div>

      <div className="sidebar-search-area">
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
              🔍
            </button>
          </div>
          <button
            onClick={() => setShowCalendar(v => !v)}
            className={`sidebar-cal-btn${showCalendar ? ' active' : ''}`}
          >
            📅
          </button>
        </div>
        {showCalendar && (
          <MiniCalendar
            activeDates={uniqueDates}
            onDateSelect={onDateSelect}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </div>

      <div className="sidebar-body chat-scroll">
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

      <div className="sidebar-footer">
        <div className="card-petal sidebar-card">
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

        <div className="sidebar-actions">
          {isLoggedIn
            ? <button onClick={onLogout} className="sidebar-logout-btn">로그아웃</button>
            : <button onClick={() => navigate('/login')} className="sidebar-login-btn">로그인</button>
          }
          <button onClick={onOpenSettings} className="sidebar-settings-btn">
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}
