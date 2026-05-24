import React from 'react';

/**
 * variant: 'petal' | 'mint' | 'blossom' | 'ghost'
 */
export default function Badge({ variant = 'petal', children, className = '', ...props }) {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
