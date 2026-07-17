import { serve } from "https://deno.land"

const SIEM_ENDPOINT = Deno.env.get("ENTERPRISE_SIEM_LOG_TARGET") || "https://datadoghq.com";
const INTERNAL_SECURITY_TOKEN = Deno.env.get("SIEM_FORWARDING_SECRET_KEY") || "";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { "Content-Type": "application/json" } });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${INTERNAL_SECURITY_TOKEN}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized Secure Hook Access' }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const eventPayload = await req.json();

    // Securely forward audit trail payload directly to SIEM endpoint
    const siemResponse = await fetch(SIEM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": Deno.env.get("DATADOG_API_KEY") || ""
      },
      body: JSON.stringify({
        ddsource: "compliance_governance_hub",
        service: `tenant-${eventPayload.tenant_id}`,
        message: eventPayload.action,
        timestamp: eventPayload.created_at,
        attributes: eventPayload
      })
    });

    return new Response(JSON.stringify({ forwarded: true, status: siemResponse.status }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
