'use client';

import React from 'react';

export const ComplianceScore: React.FC<{ score: number }> = ({ score }) => {
  const strokeDashoffset = 440 - (440 * score) / 100;

  return (
    <div className="relative flex flex-col items-center justify-center w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="transparent" />
        <circle
          cx="80" cy="80" r="70"
          stroke={score > 85 ? '#10b981' : score > 60 ? '#f59e0b' : '#ef4444'}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray="440"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
    </div>
  );
};
