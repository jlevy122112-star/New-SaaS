-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom enum types for subscription tiers and workspace roles
create type subscription_tier as enum ('standard', 'agency', 'enterprise');
create type membership_role as enum ('system_admin', 'agency_owner', 'client_admin', 'compliance_auditor', 'dpo', 'view_only');

-- 1. Core Tenants Table
create table public.tenants (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    tier subscription_tier not null default 'standard',
    custom_domain text unique,
    is_active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on slugs and custom domains for fast middleware lookups
create index idx_tenants_slug on public.tenants(slug);
create index idx_tenants_custom_domain on public.tenants(custom_domain) where custom_domain is not null;

-- 2. White-Label Customization Table
create table public.tenant_branding (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade unique,
    logo_url text,
    primary_color text default '#4f46e5',
    accent_color text default '#06b6d4',
    custom_smtp_host text,
    custom_smtp_user text,
    custom_smtp_pass text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tenant User Memberships Table (Cross-Tenant Junction)
create table public.tenant_memberships (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role membership_role not null default 'view_only',
    ip_allowlist text[], -- Array of allowed CIDR blocks for ABAC constraints
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (tenant_id, user_id)
);

create index idx_memberships_user on public.tenant_memberships(user_id);
create index idx_memberships_tenant_user on public.tenant_memberships(tenant_id, user_id);

-- Enable Row-Level Security (RLS) across all core structural components
alter table public.tenants enable row_level_security;
alter table public.tenant_branding enable row_level_security;
alter table public.tenant_memberships enable row_level_security;

-- 4. Secure Helper Functions to Extract Tenant Metadata from Authenticated Session JWTs
create or replace function auth.get_jwt_tenant_id()
returns uuid as $$
    select nullif(current_setting('request.jwt.claims', true)::json->>'tenant_id', '')::uuid;
$$ language sql stable security definer;

-- 5. Establish RLS Policies
-- Tenants RLS
create policy "Users can view tenants they are members of"
    on public.tenants for select
    using (
        id = auth.get_jwt_tenant_id() or 
        exists (
            select 1 from public.tenant_memberships 
            where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = tenants.id
        )
    );

create policy "System administrators can manage tenants completely"
    on public.tenants for all
    using (
        exists (
            select 1 from public.tenant_memberships 
            where tenant_memberships.user_id = auth.uid() and tenant_memberships.role = 'system_admin'
        )
    );

-- Tenant Branding RLS
create policy "Users can view branding for their assigned tenant context"
    on public.tenant_branding for select
    using (
        tenant_id = auth.get_jwt_tenant_id() or
        exists (
            select 1 from public.tenant_memberships 
            where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = tenant_branding.tenant_id
        )
    );

create policy "Workspace managers can edit branding settings"
    on public.tenant_branding for all
    using (
        exists (
            select 1 from public.tenant_memberships 
            where tenant_memberships.user_id = auth.uid() 
            and tenant_memberships.tenant_id = tenant_branding.tenant_id 
            and tenant_memberships.role in ('system_admin', 'agency_owner', 'client_admin')
        )
    );

-- Tenant Memberships RLS
create policy "Members can view records within their same workspace cluster"
    on public.tenant_memberships for select
    using (
        tenant_id = auth.get_jwt_tenant_id() or 
        tenant_id in (select tm.tenant_id from public.tenant_memberships tm where tm.user_id = auth.uid())
    );

create policy "Workspace management can mutate profile authorization structures"
    on public.tenant_memberships for all
    using (
        exists (
            select 1 from public.tenant_memberships tm 
            where tm.user_id = auth.uid() 
            and tm.tenant_id = tenant_memberships.tenant_id 
            and tm.role in ('system_admin', 'agency_owner', 'client_admin')
        )
    );
