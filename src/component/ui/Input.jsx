import React from 'react';

/**
 * shape: 'base' | 'pill'
 */
export default function Input({ shape = 'base', className = '', ...props }) {
  return (
    <input
      className={`input-${shape} ${className}`}
      {...props}
    />
  );
}
