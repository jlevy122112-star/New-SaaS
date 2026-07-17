-- Enable vector search support
create extension if not exists vector;

-- Security Compliance Assets Storage and Tracking
create table public.compliance_frameworks (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    name text not null, -- 'SOC2', 'ISO27001', 'HIPAA'
    version text not null,
    is_enabled boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.compliance_vectors (
    id uuid primary key default uuid_generate_v4(),
    framework_id uuid not null references public.compliance_frameworks(id) on delete cascade,
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    control_id text not null, -- e.g., 'CC6.1'
    content text not null,
    embedding vector(1536),   -- Standard dimension mapping for modern embedding architectures
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.compliance_drift_logs (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    system_target text not null, -- e.g., 'AWS_IAM_POLICY_01'
    status text not null,        -- 'compliant', 'drift_detected', 'remediated'
    details jsonb not null default '{}'::jsonb,
    detected_at timestamp with time zone default timezone('utc'::text, now()) not null,
    remediated_at timestamp with time zone
);

create index idx_compliance_vectors_embedding on public.compliance_vectors using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Enable RLS across data parsing spaces
alter table public.compliance_frameworks enable row_level_security;
alter table public.compliance_vectors enable row_level_security;
alter table public.compliance_drift_logs enable row_level_security;

-- Frameworks and Vectors Workspace boundaries
create policy "Workspace access lock for compliance frameworks"
    on public.compliance_frameworks for all using (
        tenant_id = auth.get_jwt_tenant_id() or
        exists (select 1 from public.tenant_memberships where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = compliance_frameworks.tenant_id)
    );

create policy "Workspace access lock for security vector storage"
    on public.compliance_vectors for all using (
        tenant_id = auth.get_jwt_tenant_id() or
        exists (select 1 from public.tenant_memberships where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = compliance_vectors.tenant_id)
    );

create policy "Workspace access lock for compliance logs"
    on public.compliance_drift_logs for all using (
        tenant_id = auth.get_jwt_tenant_id() or
        exists (select 1 from public.tenant_memberships where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = compliance_drift_logs.tenant_id)
    );
