import React, { useState } from 'react';
import Button from './Button';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function DeleteCalendar({ activeDates, onConfirm, onClose }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

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

  const formatTag = (dateKey) => {
    const [, m, d] = dateKey.split('-');
    return `${parseInt(m)}월 ${parseInt(d)}일`;
  };

  return (
    <div className="del-cal-overlay">
      <div className="del-cal-modal">

        {/* 타이틀 */}
        <div>
          <p className="del-cal-title-sub">대화 삭제</p>
          <h2 className="del-cal-title">날짜를 선택해주세요</h2>
        </div>

        {/* 월 헤더 */}
        <div className="del-cal-nav">
          <button className="del-cal-nav-btn" onClick={prevMonth}>‹</button>
          <span className="del-cal-nav-label">{viewYear}년 {viewMonth + 1}월</span>
          <button className="del-cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        {/* 요일 헤더 */}
        <div className="del-cal-day-labels">
          {DAY_LABELS.map(d => (
            <div key={d} className="del-cal-day-label">{d}</div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="del-cal-grid">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isActive = activeDateSet.has(dateKey);
            const isSelected = selectedDate === dateKey;
            return (
              <div key={i} className="del-cal-cell">
                <button
                  disabled={!isActive}
                  onClick={() => setSelectedDate(prev => prev === dateKey ? null : dateKey)}
                  className={`del-cal-day-btn${isActive ? ' active' : ''}${isSelected ? ' selected' : ''}`}
                >
                  {day}
                </button>
                <div className={`del-cal-dot${isSelected ? ' selected' : isActive ? ' active' : ''}`} />
              </div>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="del-cal-legend">
          {[
            { color: 'rgba(180,160,165,0.4)', label: '대화 없음' },
            { color: 'var(--petal-light)', label: '대화 있음' },
            { color: 'var(--petal)', label: '선택됨' },
          ].map(({ color, label }) => (
            <div key={label} className="del-cal-legend-item">
              <div className="del-cal-legend-dot" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>

        {/* 선택된 날짜 태그 */}
        <div className="del-cal-tag-row">
          {selectedDate && (
            <span className="badge badge-petal" style={{ gap: 6 }}>
              {formatTag(selectedDate)}
              <button
                onClick={() => setSelectedDate(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--petal-dark)', fontSize: 13, padding: 0, lineHeight: 1, fontFamily: 'inherit' }}
              >×</button>
            </span>
          )}
        </div>

        {/* 버튼 */}
        <div className="del-cal-footer">
          <Button variant="secondary" size="md" onClick={onClose} style={{ flex: 1 }}>취소</Button>
          <Button
            variant="primary"
            size="md"
            disabled={!selectedDate}
            onClick={() => { onConfirm(selectedDate); onClose(); }}
            style={{ flex: 1 }}
          >삭제</Button>
        </div>
      </div>
    </div>
  );
}
