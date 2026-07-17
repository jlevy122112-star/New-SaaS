export type SubscriptionTier = 'standard' | 'agency' | 'enterprise';

export type MembershipRole = 
  | 'system_admin' 
  | 'agency_owner' 
  | 'client_admin' 
  | 'compliance_auditor' 
  | 'dpo' 
  | 'view_only';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  tier: SubscriptionTier;
  custom_domain: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TenantBranding {
  tenant_id: string;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  custom_smtp_host: string | null;
}

export interface UserMembership {
  id: string;
  tenant_id: string;
  user_id: string;
  role: MembershipRole;
  ip_allowlist: string[] | null;
}

export interface DriftLog {
  id: string;
  system_target: string;
  status: 'compliant' | 'drift_detected' | 'remediated';
  details: Record<string, any>;
  detected_at: string;
  remediated_at: string | null;
}
