'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Activity, FileText, Settings, Users, Briefcase } from 'lucide-react';
import { useTenantContext } from '@/context/TenantContext';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentTenant, activeRole } = useTenantContext();

  const links = [
    { name: 'Overview', href: '/dashboard', icon: Shield, allowed: true },
    { name: 'Drift Scanner', href: '/dashboard/scanner', icon: Activity, allowed: true },
    { name: 'AI Generator', href: '/dashboard/generator', icon: FileText, allowed: true },
    { name: 'Agency Hub', href: '/dashboard/agency', icon: Briefcase, allowed: activeRole === 'agency_owner' || activeRole === 'system_admin' },
    { name: 'Enterprise Hub', href: '/dashboard/enterprise', icon: Users, allowed: currentTenant?.tier === 'enterprise' },
    { name: 'Settings', href: '/dashboard/settings/branding', icon: Settings, allowed: true },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-lg tracking-wider">Ω</div>
          <span className="font-bold text-lg text-slate-100 tracking-tight">ComplianceHub</span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => link.allowed && (
            <Link key={link.href} href={link.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-150",
              pathname === link.href ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}>
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
        Active Workspace: <strong className="text-slate-400 block truncate">{currentTenant?.name || 'Loading...'}</strong>
      </div>
    </aside>
  );
};
