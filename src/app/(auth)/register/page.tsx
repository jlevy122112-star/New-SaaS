'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleRegistrationOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // User sign-up workflow
    const { data } = await supabase.auth.signUp({ email, password });
    
    if (data?.user) {
      // Trigger organizational creation hook configurations via functions or direct queries
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleRegistrationOnboarding} className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Create Hub Account</h2>
        <p className="text-sm text-slate-400 mt-1">Deploy automated risk mitigation structures</p>
      </div>
      <Input label="Organization Name" value={orgName} onChange={e => setOrgName(e.target.value)} required />
      <Input label="Administrator Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input label="Security Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <Button type="submit" isLoading={isLoading}>Provision Secure Infrastructure Instance</Button>
    </form>
  );
}
