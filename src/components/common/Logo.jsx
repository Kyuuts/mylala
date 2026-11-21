import React from 'react';

export default function Logo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <img
      src="/logo.svg"
      alt="MyLala Logo"
      className={`${selectedSize} object-contain transition-transform hover:scale-105 ${className}`}
    />
  );
}

