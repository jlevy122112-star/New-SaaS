'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTenantContext } from '@/context/TenantContext';
import { Layers } from 'lucide-react';

export const Topbar: React.FC = () => {
  const supabase = createClient();
  const { currentTenant, switchWorkspaceScope } = useTenantContext();
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchAvailableWorkspaces = async () => {
      const { data } = await supabase.from('tenant_memberships').select('tenant_id, tenants(id, name)');
      if (data) setWorkspaces(data.map(w => w.tenants));
    };
    fetchAvailableWorkspaces();
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <Layers className="h-4 w-4 text-slate-400" />
        <select
          value={currentTenant?.id || ''}
          onChange={(e) => switchWorkspaceScope(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {workspaces.map(w => w && (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs px-2.5 py-1 font-semibold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {currentTenant?.tier} Activation
        </span>
      </div>
    </header>
  );
};
