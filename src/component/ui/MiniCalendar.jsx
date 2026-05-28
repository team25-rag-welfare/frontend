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
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button onClick={prevMonth} className="mini-cal-nav-btn">‹</button>
        <span className="mini-cal-month">
          {viewYear}.{String(viewMonth + 1).padStart(2, '0')}
        </span>
        <button onClick={nextMonth} className="mini-cal-nav-btn">›</button>
      </div>

      <div className="mini-cal-day-labels">
        {DAY_LABELS.map(d => (
          <div key={d} className="mini-cal-day-label">{d}</div>
        ))}
      </div>

      <div className="mini-cal-grid">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isActive = activeDateSet.has(dateKey);
          return (
            <button
              key={i}
              disabled={!isActive}
              onClick={() => { onDateSelect(dateKey); onClose(); }}
              className={`mini-cal-day-btn${isActive ? ' active' : ''}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
