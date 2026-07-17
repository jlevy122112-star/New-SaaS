'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';

export default function AgencyDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Agency Portal</h1>
        <p className="text-slate-400 mt-1">Aggregated tracking controls across sub-account clusters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Reseller Portfolio Ingestion</h3>
          <span className="text-4xl font-black text-blue-400">42 Managed Accounts</span>
        </Card>
        <Card>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Calculated Platform Core Margin Balance</h3>
          <span className="text-4xl font-black text-emerald-400">+34.8% Year-To-Date</span>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-slate-200 mb-4">Ported Tenant Manifest</h2>
        <Table>
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <th className="p-4">Sub-Tenant Profile</th>
              <th className="p-4">Assigned Plan Structural Matrix</th>
              <th className="p-4">Telemetry Extraction Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
              <td className="p-4 font-medium text-slate-200">Acme Downstream Subsidiary</td>
              <td className="p-4">Standard Operational Isolation</td>
              <td className="p-4 text-green-400">Fully Syncing</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
