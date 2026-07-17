import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const adminClient = createAdminClient();
    const scimPayload = await request.json();

    const email = scimPayload.emails?.[0]?.value;
    const tenantId = request.headers.get('X-SCIM-Tenant-Id');

    if (!email || !tenantId) {
      return NextResponse.json({ schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"], detail: "Missing parameter matrices" }, { status: 400 });
    }

    // Ingest users into Supabase Auth programmatically
    const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { source: 'scim_sync' }
    });

    if (userError || !userData.user) throw userError;

    // Attach membership links
    await adminClient.from('tenant_memberships').insert({
      tenant_id: tenantId,
      user_id: userData.user.id,
      role: 'view_only'
    });

    return NextResponse.json({ schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"], id: userData.user.id, userName: email, active: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
