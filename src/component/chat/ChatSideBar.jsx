import React, { useState } from 'react';
import axios from 'axios';
import Button from '../ui/Button';
import Input from '../ui/Input';
import MiniCalendar from '../ui/MiniCalendar';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_LABEL = {
  PREGNANT: '임신 중',
  POSTPARTUM: '산후',
  PARENTING: '육아 중',
};

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--ink-lt)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--petal-dark)' : 'var(--ink-lt)' }}>
        {value ?? '미입력'}
      </span>
    </div>
  );
}

const getDateKey = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

export default function ChatSidebar({ user, messages = [], onLogout, onEditCondition, onDateSelect, onSearch, onOpenSettings }) {
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

  const statusLabel = STATUS_LABEL[u.pregnancyStatus] || '임신 중';

  const subStatus = [
    u.pregnancyWeeks ? `${u.pregnancyWeeks}주차` : null,
    u.infantMonths ? `영아 ${u.infantMonths}개월` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', background: 'var(--petal-bg)', borderRight: '1px solid var(--border)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>

      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/logo.png" alt="산책" style={{ height: 88, display: 'block' }} />
      </div>

      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Input
              shape="pill"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="내 대화 기록 찾기"
              style={{ paddingRight: 36, fontSize: 12 }}
            />
            <button onClick={handleSearch} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-lt)', fontSize: 13 }}>
              🔍
            </button>
          </div>
          <button
            onClick={() => setShowCalendar(v => !v)}
            style={{ flexShrink: 0, border: '1.5px solid var(--border)', background: showCalendar ? 'var(--petal-bg)' : 'var(--cream)', borderRadius: 'var(--r-pill)', padding: '6px 10px', cursor: 'pointer', fontSize: 14, transition: 'all .15s' }}
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

      <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>내 조건</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--petal)', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{statusLabel}</p>
            {subStatus && <p style={{ fontSize: 12, color: 'var(--ink-lt)' }}>{subStatus}</p>}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginBottom: 12 }}>
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

      <div style={{ padding: '12px 16px 20px', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="card-petal" style={{ padding: '12px 14px', marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>내 복지 조건</p>
          <p style={{ fontSize: 12, color: 'var(--ink-md)', lineHeight: 1.6, marginBottom: 10 }}>
            조건을 업데이트하면
            <br />
            더 정확한 혜택을 찾아드려요!
          </p>
          <Button variant="primary" size="sm" onClick={onEditCondition} style={{ width: '100%' }}>
            조건 수정하기
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
          <button onClick={onLogout} style={{ fontSize: 12, color: 'var(--ink-hint)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
            로그아웃
          </button>
          <button onClick={onOpenSettings} style={{ border: 'none', background: 'none', fontSize: 20, color: 'var(--ink-lt)', cursor: 'pointer' }}>
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}
