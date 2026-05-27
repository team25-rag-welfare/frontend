import React, { useEffect } from 'react';
import Button from './Button';

export default function Toast({ message, onLogin, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      <span className="toast-icon">🔒</span>
      <span className="toast-msg">{message}</span>
      <Button variant="primary" size="sm" onClick={onLogin} style={{ flexShrink: 0 }}>
        로그인하기
      </Button>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}
