import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature')!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const adminClient = createAdminClient();

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const subscription = event.data.object as any;
    const stripeCustomerId = subscription.customer;
    const status = subscription.status;

    // Fetch corresponding tier mappings matching specific plan metadata records
    const tierMap: any = { 'enterprise-plan-id': 'enterprise', 'agency-plan-id': 'agency' };
    const resolvedTier = tierMap[subscription.items.data[0].plan.id] || 'standard';

    const { data: billingRecord } = await adminClient
      .from('tenant_billing')
      .select('tenant_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();

    if (billingRecord) {
      await adminClient.from('tenant_billing').update({ status, current_period_end: new Date(subscription.current_period_end * 1000).toISOString() }).eq('tenant_id', billingRecord.tenant_id);
      await adminClient.from('tenants').update({ tier: resolvedTier }).eq('id', billingRecord.tenant_id);
    }
  }

  return NextResponse.json({ received: true });
}
