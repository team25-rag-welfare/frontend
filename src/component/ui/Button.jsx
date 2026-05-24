import React from 'react';

/**
 * variant: 'primary' | 'secondary' | 'mint' | 'ghost' | 'danger'
 * size:    'sm' | 'md' | 'lg'
 */
export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
