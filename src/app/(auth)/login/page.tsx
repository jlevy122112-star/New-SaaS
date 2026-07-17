'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSso, setIsSso] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleStandardAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await supabase.auth.signInWithPassword({ email, password });
    window.location.href = '/dashboard';
  };

  const handleSsoRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Leverage native Supabase Single Sign-On mapping protocols
    await supabase.auth.signInWithSSO({ domain: email.split('@')[1] });
  };

  return (
    <form onSubmit={isSso ? handleSsoRedirect : handleStandardAuth} className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Welcome back</h2>
        <p className="text-sm text-slate-400 mt-1">Access the core multi-tenant compliance terminal</p>
      </div>

      <Input label="Business Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      {!isSso && <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />}

      <Button type="submit" isLoading={isLoading}>{isSso ? 'Initiate Enterprise SAML Link' : 'Secure Terminal Login'}</Button>

      <button type="button" onClick={() => setIsSso(!isSso)} className="text-xs text-blue-400 hover:text-blue-300 font-medium text-center cursor-pointer">
        {isSso ? "Switch back to Password entry protocol" : "Accessing via Corporate SSO/SAML?"}
      </button>
    </form>
  );
}
