import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Initialize Supabase configuration for middleware context processing
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set({ name, value, ...options }));
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Extract tenant context via subdomain routing structures
  let tenantSlug = '';
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000';
  
  if (hostname !== baseDomain && hostname.endsWith(`.${baseDomain}`)) {
    tenantSlug = hostname.replace(`.${baseDomain}`, '');
  }

  // Rewrite URLs based on the active subdomain slug safely
  if (tenantSlug) {
    url.pathname = `/_tenant/${tenantSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Core authorization route guardrails
  if (!session && url.pathname.includes('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
