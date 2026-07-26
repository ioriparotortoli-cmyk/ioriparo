import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/**
 * Rinnova la sessione Supabase a ogni richiesta e protegge `/admin`:
 * senza sessione valida si viene rimandati al login.
 */
export async function middleware(request: NextRequest) {
  let risposta = NextResponse.next({ request })

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return risposta

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (elenco) => {
        elenco.forEach(({ name, value }) => request.cookies.set(name, value))
        risposta = NextResponse.next({ request })
        elenco.forEach(({ name, value, options }) => risposta.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const percorso = request.nextUrl.pathname
  const areaProtetta = percorso.startsWith('/admin') && !percorso.startsWith('/admin/login')

  if (areaProtetta && !user) {
    const login = request.nextUrl.clone()
    login.pathname = '/admin/login'
    login.searchParams.set('successivo', percorso)
    return NextResponse.redirect(login)
  }

  if (percorso === '/admin/login' && user) {
    const pannello = request.nextUrl.clone()
    pannello.pathname = '/admin'
    pannello.search = ''
    return NextResponse.redirect(pannello)
  }

  return risposta
}

export const config = {
  matcher: ['/admin/:path*'],
}
