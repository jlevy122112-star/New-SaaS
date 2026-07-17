'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, MembershipRole } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface TenantContextProps {
  currentTenant: Tenant | null;
  activeRole: MembershipRole | null;
  switchWorkspaceScope: (tenantId: string) => Promise<void>;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [activeRole, setActiveRole] = useState<MembershipRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const switchWorkspaceScope = async (tenantId: string) => {
    setIsLoading(true);
    // Overriding session variables locally to enable secure context transformation
    const { data, error } = await supabase
      .from('tenant_memberships')
      .select('role, tenants(*)')
      .eq('tenant_id', tenantId)
      .single();

    if (!error && data) {
      setActiveRole(data.role);
      setCurrentTenant(data.tenants as unknown as Tenant);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchInitialContext = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('tenant_memberships').select('role, tenants(*)').limit(1).single();
        if (data) {
          setActiveRole(data.role);
          setCurrentTenant(data.tenants as unknown as Tenant);
        }
      }
      setIsLoading(false);
    };
    fetchInitialContext();
  }, []);

  return (
    <TenantContext.Provider value={{ currentTenant, activeRole, switchWorkspaceScope, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenantContext must be executed within an explicit TenantProvider wrapper");
  return context;
};
