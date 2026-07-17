import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { Providers } from '@/app/providers';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-[#0b0f19]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="p-8 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
