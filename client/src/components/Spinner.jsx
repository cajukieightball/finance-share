import React from 'react';

export function Spinner({ fullScreen = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-t-2',
    md: 'h-8 w-8 border-t-2',
    lg: 'h-12 w-12 border-t-4'
  };

  return (
    <div className={`flex justify-center items-center ${fullScreen ? 'h-screen' : 'p-4'}`}>
      <div 
        className={`animate-spin rounded-full border-gray-600 ${sizeClasses[size]}`}
        style={{ borderTopColor: '#09f' }} 
      />
    </div>
  );
}