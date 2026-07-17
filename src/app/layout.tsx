import React from 'react';
import '@/app/globals.css'; // Assuming Tailwind base configurations exist here

export const metadata = {
  title: 'Compliance SaaS Hub',
  description: 'Enterprise Governance Engine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-[#0b0f19] text-slate-100 antialiased selection:bg-blue-500/30">
      <body>{children}</body>
    </html>
  );
}
