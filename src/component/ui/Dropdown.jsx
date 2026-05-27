import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({ options, value, onChange, placeholder = '선택해주세요' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="dropdown">
      {/* 트리거 */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`dropdown-trigger${open ? ' open' : ''}${selected ? ' has-value' : ''}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className={`dropdown-chevron${open ? ' open' : ''}`}>▼</span>
      </button>

      {/* 목록 */}
      {open && (
        <div className="dropdown-list">
          {options.map((opt) => {
            const active = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`dropdown-option${active ? ' active' : ''}`}
              >
                {opt.label}
                {active && <span className="dropdown-option-check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
