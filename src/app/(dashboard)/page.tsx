'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ComplianceScore } from '@/components/dashboard/ComplianceScore';

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Governance Control Room</h1>
        <p className="text-slate-400 mt-1">Real-time cross-tenant vector state analysis telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall Posture Rating</span>
            <span className="text-4xl font-extrabold text-green-400 mt-1">94%</span>
          </div>
          <ComplianceScore score={94} />
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Indexed Compliance Control Vectors</span>
          <span className="text-5xl font-black text-slate-100 mt-4">14,821</span>
          <span className="text-xs text-slate-500 mt-2">Active mappings across systems</span>
        </Card>

        <Card className="flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Drift Isolation Routines</span>
          <span className="text-5xl font-black text-amber-500 mt-4">0</span>
          <span className="text-xs text-emerald-400 mt-2">All assets currently resolved</span>
        </Card>
      </div>
    </div>
  );
}
