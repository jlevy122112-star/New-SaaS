import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const adminClient = createAdminClient();
    const { tenant_id, metric_name, quantity } = await request.json();

    const startPeriod = new Date();
    startPeriod.setDate(1); // Set base floor metric timeline anchor markers
    const endPeriod = new Date(startPeriod);
    endPeriod.setMonth(endPeriod.getMonth() + 1);

    await adminClient.rpc('increment_tenant_meter', {
      p_tenant_id: tenant_id,
      p_metric_name: metric_name,
      p_quantity: quantity,
      p_period_start: startPeriod.toISOString(),
      p_period_end: endPeriod.toISOString()
    });

    return NextResponse.json({ tracked: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
