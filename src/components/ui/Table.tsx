import React from 'react';
import { cn } from '@/lib/utils';

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ className, children, ...props }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-800">
      <table className={cn("w-full text-left border-collapse text-sm text-slate-300", className)} {...props}>
        {children}
      </table>
    </div>
  );
};
