import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Dropdown({ options, value, onChange, placeholder = '선택해주세요' }) {
  const [open, setOpen] = useState(false);
  const [listStyle, setListStyle] = useState({});
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));

  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        listRef.current && !listRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const maxH = 220;
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openUpward = spaceBelow < maxH && spaceAbove > spaceBelow;
    if (openUpward) {
      setListStyle({
        position: 'fixed',
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(maxH, spaceAbove),
        zIndex: 9999,
      });
    } else {
      setListStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.min(maxH, spaceBelow),
        zIndex: 9999,
      });
    }
  }, [open]);

  return (
    <div ref={triggerRef} className="dropdown">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`dropdown-trigger${open ? ' open' : ''}${selected ? ' has-value' : ''}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className={`dropdown-chevron${open ? ' open' : ''}`}>▼</span>
      </button>

      {open && createPortal(
        <div ref={listRef} className="dropdown-list" style={listStyle}>
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
        </div>,
        document.body
      )}
    </div>
  );
}
