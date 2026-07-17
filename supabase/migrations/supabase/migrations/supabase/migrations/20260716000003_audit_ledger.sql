create table public.tenant_audit_events (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    actor_id uuid not null,
    actor_email text not null,
    action text not null,
    resource text not null,
    payload jsonb not null default '{}'::jsonb,
    ip_address text not null,
    cryptographic_signature text not null, -- Stores tracking check for auditing
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_audit_tenant_time on public.tenant_audit_events(tenant_id, created_at desc);

alter table public.tenant_audit_events enable row_level_security;

create policy "Audit files accessible only by security managers and auditors"
    on public.tenant_audit_events for select using (
        (tenant_id = auth.get_jwt_tenant_id() or exists (select 1 from public.tenant_memberships where tenant_memberships.user_id = auth.uid() and tenant_memberships.tenant_id = tenant_audit_events.tenant_id))
        and exists (
            select 1 from public.tenant_memberships 
            where tenant_memberships.user_id = auth.uid() 
            and tenant_memberships.tenant_id = tenant_audit_events.tenant_id
            and tenant_memberships.role in ('system_admin', 'agency_owner', 'client_admin', 'compliance_auditor', 'dpo')
        )
    );

-- Throw database runtime error if any application layer attempts updating audit trails
create or replace function public.block_immutable_audit_mutations() 
returns trigger as $$
begin
    raise exception 'Data Protection Policy: Modifications to the cryptographic audit trail are strictly prohibited.';
end;
$$ language plpgsql;

create trigger check_immutable_audit_logs
    before update or delete on public.tenant_audit_events
    for each row execute function public.block_immutable_audit_mutations();
