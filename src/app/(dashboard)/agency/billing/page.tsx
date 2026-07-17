'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function AgencyBillingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Reseller Margin Tracking</h1>
        <p className="text-slate-400 mt-1">Live updates on infrastructure consumption costs versus customer pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Stripe wholesale fee index</span>
          <p className="text-2xl font-bold text-slate-200 mt-2">$4,120.00</p>
        </Card>
        <Card>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Invoiced Client Totals</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">$8,540.00</p>
        </Card>
        <Card>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Net System Spread Yield</span>
          <p className="text-2xl font-bold text-blue-400 mt-2">+$4,420.00</p>
        </Card>
      </div>
    </div>
  );
}
