/**
 * Controlla che un sito pubblicato risponda correttamente.
 *
 *   node scripts/verifica-online.mjs https://ioriparo.vercel.app
 *
 * Verifica pagine, sitemap, robots, immagine Open Graph, canonical e dati
 * strutturati. Utile subito dopo il deploy e dopo il collegamento del dominio.
 */
const base = (process.argv[2] ?? '').replace(/\/$/, '')

if (!base) {
  console.error('Uso: node scripts/verifica-online.mjs https://iltuodominio.it')
  process.exit(1)
}

const controlli = []

const aggiungi = (nome, esito, dettaglio = '') =>
  controlli.push({ nome, esito, dettaglio })

async function pagina(percorso, attesi = []) {
  try {
    const risposta = await fetch(`${base}${percorso}`, { redirect: 'follow' })
    const testo = risposta.headers.get('content-type')?.includes('image')
      ? ''
      : await risposta.text()

    if (!risposta.ok) {
      aggiungi(percorso, false, `HTTP ${risposta.status}`)
      return ''
    }

    const mancanti = attesi.filter((atteso) => !testo.includes(atteso))
    aggiungi(
      percorso,
      mancanti.length === 0,
      mancanti.length ? `manca: ${mancanti.join(', ')}` : `HTTP ${risposta.status}`,
    )
    return testo
  } catch (errore) {
    aggiungi(percorso, false, errore instanceof Error ? errore.message : 'errore di rete')
    return ''
  }
}

const home = await pagina('/', [
  'Riparazione',
  'application/ld+json',
  '"@type":["LocalBusiness","ComputerRepairService"]',
])

await pagina('/preventivo', ['Richiedi preventivo gratuito', 'name="problema"'])
await pagina('/prenota', ['Prenota appuntamento', 'name="modalita"'])
await pagina('/privacy-policy', ['Privacy Policy'])
await pagina('/cookie-policy', ['Cookie Policy'])
await pagina('/sitemap.xml', ['<urlset', '/preventivo'])
await pagina('/robots.txt', ['Sitemap:', 'Disallow: /admin'])
await pagina('/og.png')

// L'area riservata deve rimandare al login quando non c'è una sessione.
// Senza Supabase configurato la pagina mostra invece l'avviso di setup.
try {
  const admin = await fetch(`${base}/admin`, { redirect: 'manual' })
  const posizione = admin.headers.get('location') ?? ''
  const reindirizza = [301, 302, 307, 308].includes(admin.status) || posizione.includes('/admin/login')
  const senzaSupabase =
    admin.status === 200 && (await admin.text()).includes('Supabase non è configurato')

  aggiungi(
    '/admin protetta',
    reindirizza || senzaSupabase,
    reindirizza
      ? `reindirizza a ${posizione}`
      : senzaSupabase
        ? 'Supabase non configurato: nessun dato esposto, ma il pannello non è utilizzabile'
        : `HTTP ${admin.status}`,
  )
} catch {
  aggiungi('/admin protetta', false, 'errore di rete')
}

// Il canonical deve puntare al dominio definitivo, non a *.vercel.app.
const canonical = home.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? ''
aggiungi(
  'canonical allineato al dominio',
  canonical.startsWith(base),
  canonical || 'assente',
)

// La sitemap deve usare lo stesso dominio (dipende da NEXT_PUBLIC_SITE_URL).
const sitemap = await fetch(`${base}/sitemap.xml`)
  .then((risposta) => risposta.text())
  .catch(() => '')
aggiungi('sitemap sul dominio corretto', sitemap.includes(`${base}/`), '')

const falliti = controlli.filter((controllo) => !controllo.esito)

console.log(`\nVerifica di ${base}\n`)
controlli.forEach((controllo) => {
  console.log(
    `${controllo.esito ? '  ok  ' : ' KO   '} ${controllo.nome}${controllo.dettaglio ? ` — ${controllo.dettaglio}` : ''}`,
  )
})
console.log(
  `\n${controlli.length - falliti.length}/${controlli.length} controlli superati.\n`,
)

process.exit(falliti.length > 0 ? 1 : 0)
