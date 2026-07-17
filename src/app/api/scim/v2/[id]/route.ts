import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const adminClient = createAdminClient();
    const { active } = await request.json();

    if (active === false) {
      // Hard separation constraint or termination configuration mapping
      await adminClient.auth.admin.deleteUser(params.id);
      return NextResponse.json(null, { status: 204 });
    }

    return NextResponse.json({ message: "SCIM operation state matched update profiles parameters without mutation actions" });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 500 });
  }
}
