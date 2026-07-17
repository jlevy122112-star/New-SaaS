'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AgencySubaccountsPage() {
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);

  const handleSubaccountProvisioning = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);
    // Direct cross-tenant configuration injection logic
    setTimeout(() => {
      setIsProvisioning(false);
      setSubName('');
      setSubSlug('');
    }, 1500);
  };

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Deploy New Client Account</h1>
        <p className="text-slate-400 mt-1">Instantly spin up isolated database architectures and subdomains</p>
      </div>

      <Card>
        <form onSubmit={handleSubaccountProvisioning} className="flex flex-col gap-6">
          <Input label="Subaccount Enterprise Name" value={subName} onChange={e => setSubName(e.target.value)} required placeholder="e.g. Nexus Logistics Corp" />
          <Input label="Subdomain Identifier Code" value={subSlug} onChange={e => setSubSlug(e.target.value)} required placeholder="e.g. nexus-logistics" />
          <Button type="submit" isLoading={isProvisioning} className="w-full">Initialize Isolated Sub-Tenant Context</Button>
        </form>
      </Card>
    </div>
  );
}
