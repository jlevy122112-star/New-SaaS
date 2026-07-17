'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', isLoading, className, children, ...props }) => {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={cn(
        "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-50",
        variant === 'primary' && "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
        variant === 'secondary' && "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
        variant === 'danger' && "bg-red-600 hover:bg-red-700 text-white",
        className
      )}
      {...props}
    >
      {isLoading ? <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : null}
      {children}
    </button>
  );
};
