import React from 'react';
import { cn } from '@/lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={cn("bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl", className)} {...props}>
      {children}
    </div>
  );
};
