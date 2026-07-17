'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function EnterpriseManagementHub() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Enterprise Settings</h1>
        <p className="text-slate-400 mt-1">Manage single-sign-on access and data isolation requirements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">SAML 2.0 Identity Federation</h3>
            <p className="text-sm text-slate-400 mt-1">Sync access management with Okta, Ping Identity, or Azure AD</p>
          </div>
          <div className="text-xs bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-slate-400 break-all">
            ACS URL: https://compliancesaas.com
          </div>
          <Button variant="secondary" className="w-fit">Configure SAML Certifications</Button>
        </Card>

        <Card className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">SIEM Audit Log Forwarder</h3>
            <p className="text-sm text-slate-400 mt-1">Stream immutable system events to external tracking architectures</p>
          </div>
          <div className="text-xs bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-emerald-400">
            Datadog Pipeline Status: Operational Connection Verified
          </div>
          <Button variant="secondary" className="w-fit">Modify Hook Secret Envelopes</Button>
        </Card>
      </div>
    </div>
  );
}
