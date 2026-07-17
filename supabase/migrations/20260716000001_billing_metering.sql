-- Create tracking tables for Stripe customer profiles and dynamic system limits
create table public.tenant_billing (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade unique,
    stripe_customer_id text unique,
    stripe_subscription_id text unique,
    status text not null,
    current_period_end timestamp with time zone,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.tenant_usage_meters (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    metric_name text not null, -- 'scans_executed', 'tokens_consumed', 'docs_generated'
    quantity integer not null default 0,
    billing_period_start timestamp with time zone not null,
    billing_period_end timestamp with time zone not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(tenant_id, metric_name, billing_period_start)
);

-- Enable RLS
alter table public.tenant_billing enable row_level_security;
alter table public.tenant_usage_meters enable row_level_security;

-- Security Policies
create policy "Users can check workspace billing states"
    on public.tenant_billing for select
    using (
        tenant_id = auth.get_jwt_tenant_id() or
        exists (select 1 from public.tenant_memberships where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = tenant_billing.tenant_id)
    );

create policy "Users can check resource meter levels"
    on public.tenant_usage_meters for select
    using (
        tenant_id = auth.get_jwt_tenant_id() or
        exists (select 1 from public.tenant_memberships where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = tenant_usage_meters.tenant_id)
    );

-- Atomically increment tenant resource usage metrics securely
create or replace function public.increment_tenant_meter(
    p_tenant_id uuid,
    p_metric_name text,
    p_quantity integer,
    p_period_start timestamp with time zone,
    p_period_end timestamp with time zone
) returns void as $$
begin
    insert into public.tenant_usage_meters (tenant_id, metric_name, quantity, billing_period_start, billing_period_end)
    values (p_tenant_id, p_metric_name, p_quantity, p_period_start, p_period_end)
    on conflict (tenant_id, metric_name, billing_period_start)
    do update set 
        quantity = public.tenant_usage_meters.quantity + p_quantity,
        updated_at = timezone('utc'::text, now());
end;
$$ language plpgsql security definer;
