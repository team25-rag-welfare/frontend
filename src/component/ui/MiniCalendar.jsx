import React, { useState } from 'react';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function MiniCalendar({ activeDates, onDateSelect, onClose }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const activeDateSet = new Set(activeDates);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ background: 'var(--snow)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '14px 12px', boxShadow: 'var(--shadow-md)' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button onClick={prevMonth} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-lt)', fontSize: 16, padding: '2px 6px', fontFamily: 'inherit' }}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
          {viewYear}.{String(viewMonth + 1).padStart(2, '0')}
        </span>
        <button onClick={nextMonth} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-lt)', fontSize: 16, padding: '2px 6px', fontFamily: 'inherit' }}>›</button>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: 'var(--ink-hint)', padding: '2px 0' }}>{d}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isActive = activeDateSet.has(dateKey);
          return (
            <button
              key={i}
              disabled={!isActive}
              onClick={() => { onDateSelect(dateKey); onClose(); }}
              style={{
                border: 'none',
                background: isActive ? 'var(--petal-bg)' : 'transparent',
                color: isActive ? 'var(--petal-dark)' : 'var(--ink-hint)',
                fontWeight: isActive ? 700 : 400,
                fontSize: 12,
                borderRadius: 'var(--r-sm)',
                padding: '5px 0',
                cursor: isActive ? 'pointer' : 'default',
                fontFamily: 'inherit',
                opacity: isActive ? 1 : 0.4,
                transition: 'all .15s',
              }}
              onMouseEnter={e => { if (isActive) e.currentTarget.style.background = 'var(--petal-light)'; }}
              onMouseLeave={e => { if (isActive) e.currentTarget.style.background = 'var(--petal-bg)'; }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
