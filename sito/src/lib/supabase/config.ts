export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/** Il sito funziona anche senza Supabase: in quel caso usa i dati statici. */
export const supabaseConfigurato = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0

export const BUCKET_MEDIA = process.env.SUPABASE_BUCKET ?? 'media'
