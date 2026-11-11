import React from 'react';

export default function Logo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <img
      src="/logo.svg"
      alt="MyLala Logo"
      className={`${selectedSize} object-contain rounded-xl shadow-xs ${className}`}
    />
  );
}

