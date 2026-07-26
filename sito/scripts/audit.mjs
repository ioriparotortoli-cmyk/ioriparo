/**
 * Audit funzionale del sito Io Riparo.
 * Uso: node audit.mjs [base]
 */
import { chromium } from 'playwright-core'
import { writeFileSync } from 'node:fs'

const BASE = process.argv[2] ?? 'http://localhost:3000'
const ESEGUIBILE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const esiti = []
const ok = (suite, nome, dettaglio = '') => esiti.push({ suite, nome, esito: 'OK', dettaglio })
const ko = (suite, nome, dettaglio = '') => esiti.push({ suite, nome, esito: 'KO', dettaglio })
const info = (suite, nome, dettaglio = '') => esiti.push({ suite, nome, esito: 'INFO', dettaglio })

const browser = await chromium.launch({ executablePath: ESEGUIBILE })

/** Contesto con raccolta di errori console, eccezioni e risorse fallite. */
async function apri(percorso, opzioni = {}) {
  const ctx = await browser.newContext({
    viewport: opzioni.viewport ?? { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    ...(opzioni.mobile ? { hasTouch: true, isMobile: true } : {}),
  })
  const p = await ctx.newPage()
  const diario = { console: [], eccezioni: [], fallite: [] }
  p.on('console', (m) => m.type() === 'error' && diario.console.push(m.text()))
  p.on('pageerror', (e) => diario.eccezioni.push(e.message))
  p.on('requestfailed', (r) => diario.fallite.push(`${r.url()} — ${r.failure()?.errorText}`))
  p.on('response', (r) => {
    if (r.status() >= 400) diario.fallite.push(`${r.url()} — HTTP ${r.status()}`)
  })
  await p.goto(`${BASE}${percorso}`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(700)
  return { ctx, p, diario }
}

const PAGINE = ['/', '/preventivo', '/prenota', '/privacy-policy', '/cookie-policy', '/admin/login', '/pagina-inesistente']

/* ============================== 1. Risorse, console, HTTP ================= */
const collegamentiRaccolti = new Map()

for (const percorso of PAGINE) {
  const { ctx, p, diario } = await apri(percorso)
  const suite = `1. Risorse ${percorso}`

  const stato = await p.evaluate(() => document.readyState)
  ok(suite, 'pagina caricata', `readyState=${stato}`)

  diario.eccezioni.length
    ? ko(suite, 'nessuna eccezione JavaScript', diario.eccezioni.join(' | '))
    : ok(suite, 'nessuna eccezione JavaScript')

  const erroriConsole = diario.console.filter(
    (v) => !(percorso === '/pagina-inesistente' && v.includes('404')),
  )
  erroriConsole.length
    ? ko(suite, 'console senza errori', erroriConsole.slice(0, 4).join(' | '))
    : ok(suite, 'console senza errori')

  const risorseKo = diario.fallite.filter(
    (v) => !v.includes('/pagina-inesistente') && !v.includes('_rsc='),
  )
  risorseKo.length
    ? ko(suite, 'nessuna risorsa mancante', risorseKo.slice(0, 6).join(' | '))
    : ok(suite, 'nessuna risorsa mancante')

  // Raccolta di link e pulsanti per la suite 2
  const collegamenti = await p.$$eval('a[href]', (nodi) =>
    nodi.map((n) => ({
      href: n.getAttribute('href'),
      testo: (n.textContent || '').trim().slice(0, 40),
      target: n.getAttribute('target'),
      rel: n.getAttribute('rel'),
      aria: n.getAttribute('aria-label'),
    })),
  )
  collegamenti.forEach((l) => collegamentiRaccolti.set(`${percorso}|${l.href}|${l.testo}`, { ...l, pagina: percorso }))

  const bottoni = await p.$$eval('button', (nodi) =>
    nodi.map((n) => ({
      testo: (n.textContent || '').trim().slice(0, 40),
      aria: n.getAttribute('aria-label'),
      tipo: n.getAttribute('type'),
      disabilitato: n.disabled,
    })),
  )
  const senzaNome = bottoni.filter((b) => !b.testo && !b.aria)
  senzaNome.length
    ? ko(suite, 'ogni pulsante ha un nome accessibile', `${senzaNome.length} senza nome`)
    : ok(suite, 'ogni pulsante ha un nome accessibile', `${bottoni.length} pulsanti`)

  /* --- controlli HTML strutturali --- */
  const struttura = await p.evaluate(() => {
    const problemi = []
    const visti = new Set()
    document.querySelectorAll('[id]').forEach((n) => {
      if (visti.has(n.id)) problemi.push(`id duplicato: ${n.id}`)
      visti.add(n.id)
    })
    document.querySelectorAll('img').forEach((i) => {
      if (!i.hasAttribute('alt')) problemi.push(`img senza alt: ${i.currentSrc || i.src}`)
      if (!i.getAttribute('width') && !i.style.width && i.clientWidth === 0)
        problemi.push(`img senza dimensioni: ${i.src}`)
    })
    document.querySelectorAll('[aria-controls]').forEach((n) => {
      const id = n.getAttribute('aria-controls')
      if (id && !document.getElementById(id)) problemi.push(`aria-controls verso id inesistente: ${id}`)
    })
    document.querySelectorAll('[aria-labelledby]').forEach((n) => {
      const id = n.getAttribute('aria-labelledby')
      if (id && !document.getElementById(id)) problemi.push(`aria-labelledby inesistente: ${id}`)
    })
    document.querySelectorAll('input, select, textarea').forEach((c) => {
      if (c.type === 'hidden') return
      const etichetta = c.labels?.length || c.getAttribute('aria-label') || c.getAttribute('aria-labelledby')
      if (!etichetta) problemi.push(`campo senza etichetta: ${c.name || c.id || c.type}`)
    })
    const titoli = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]))
    if (titoli.filter((t) => t === 1).length !== 1)
      problemi.push(`h1 presenti: ${titoli.filter((t) => t === 1).length}`)
    let precedente = titoli[0] ?? 1
    titoli.forEach((t) => {
      if (t - precedente > 1) problemi.push(`salto di livello nei titoli: h${precedente} → h${t}`)
      precedente = t
    })
    if (!document.querySelector('main')) problemi.push('manca il landmark main')
    if (document.documentElement.lang !== 'it') problemi.push('lang non impostato su it')
    return problemi
  })

  struttura.length
    ? ko(suite, 'HTML e ARIA coerenti', struttura.slice(0, 6).join(' | '))
    : ok(suite, 'HTML e ARIA coerenti')

  await ctx.close()
}

/* ============================== 2. Link e pulsanti ======================== */
{
  const suite = '2. Link'
  const tutti = [...collegamentiRaccolti.values()]
  const interni = new Set()
  const esterni = []
  const speciali = []

  tutti.forEach((l) => {
    const h = l.href
    if (!h) return ko(suite, 'href presente', JSON.stringify(l))
    if (h.startsWith('tel:') || h.startsWith('mailto:')) speciali.push(l)
    else if (h.startsWith('http')) esterni.push(l)
    else interni.add(h.split('#')[0] || '/')
  })

  // Link interni: verifica HTTP
  for (const percorso of [...interni].filter(Boolean)) {
    const r = await fetch(`${BASE}${percorso}`, { redirect: 'manual' })
    const buono = r.status < 400 || [301, 302, 307, 308].includes(r.status)
    buono
      ? ok(suite, `interno ${percorso}`, `HTTP ${r.status}`)
      : ko(suite, `interno ${percorso}`, `HTTP ${r.status}`)
  }

  // Link esterni: bersaglio e rel di sicurezza
  const senzaRel = esterni.filter((l) => l.target === '_blank' && !(l.rel || '').includes('noopener'))
  senzaRel.length
    ? ko(suite, 'link esterni con rel=noopener', senzaRel.map((l) => l.href).join(' | '))
    : ok(suite, 'link esterni con rel=noopener', `${esterni.length} link esterni`)

  const senzaTarget = esterni.filter((l) => l.target !== '_blank')
  senzaTarget.length
    ? info(suite, 'link esterni che aprono nella stessa scheda', senzaTarget.map((l) => l.href).join(' | '))
    : ok(suite, 'link esterni aprono in nuova scheda')

  // tel: e mailto: ben formati
  const malformati = speciali.filter((l) => {
    if (l.href.startsWith('tel:')) return !/^tel:\+?[0-9]{6,15}$/.test(l.href)
    return !/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(l.href)
  })
  malformati.length
    ? ko(suite, 'tel: e mailto: ben formati', malformati.map((l) => l.href).join(' | '))
    : ok(suite, 'tel: e mailto: ben formati', `${speciali.length} collegamenti`)

  // WhatsApp
  const wa = esterni.filter((l) => l.href.includes('wa.me'))
  const waKo = wa.filter((l) => !/^https:\/\/wa\.me\/\d{8,15}(\?text=.+)?$/.test(l.href))
  waKo.length
    ? ko(suite, 'link WhatsApp validi', waKo.map((l) => l.href).join(' | '))
    : ok(suite, 'link WhatsApp validi', `${wa.length} link`)
}

/* ============================== 3. Ancore e scroll ======================== */
{
  const suite = '3. Ancore'
  const { ctx, p } = await apri('/')
  const voci = await p.$$eval('header nav a[href^="/#"]', (n) => n.map((a) => a.getAttribute('href')))

  for (const href of voci) {
    const id = href.split('#')[1]
    await p.evaluate(() => window.scrollTo(0, 0))
    await p.locator(`header nav a[href="${href}"]`).click()
    await p.waitForTimeout(1100)
    const misura = await p.evaluate((sezione) => {
      const el = document.getElementById(sezione)
      if (!el) return null
      const r = el.getBoundingClientRect()
      const header = document.querySelector('header')?.getBoundingClientRect().height ?? 0
      return { top: Math.round(r.top), header: Math.round(header) }
    }, id)

    if (!misura) ko(suite, `sezione #${id} esiste`)
    else if (misura.top >= -2 && misura.top <= misura.header + 40)
      ok(suite, `scroll su #${id}`, `top=${misura.top}px, header=${misura.header}px`)
    else ko(suite, `scroll su #${id}`, `sezione a ${misura.top}px dal bordo`)
  }

  // Ancora profonda verso una card servizio
  await p.goto(`${BASE}/#servizio-riparazione-mac`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)
  const cardOk = await p.evaluate(() => {
    const el = document.getElementById('servizio-riparazione-mac')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return r.top > -5 && r.top < 200
  })
  cardOk ? ok(suite, 'ancora profonda #servizio-riparazione-mac') : ko(suite, 'ancora profonda #servizio-riparazione-mac')

  await ctx.close()
}

/* ============================== 4. Menu mobile =========================== */
{
  const suite = '4. Menu mobile'
  const { ctx, p } = await apri('/', { viewport: { width: 390, height: 844 }, mobile: true })

  const apriMenu = p.locator('header button[aria-label="Apri il menu"]')
  ;(await apriMenu.isVisible()) ? ok(suite, 'pulsante hamburger visibile') : ko(suite, 'pulsante hamburger visibile')

  await apriMenu.click()
  await p.waitForTimeout(600)
  const drawer = p.locator('nav[aria-label="Menu mobile"]')
  ;(await drawer.isVisible()) ? ok(suite, 'apertura del pannello') : ko(suite, 'apertura del pannello')

  const espanso = await apriMenu.getAttribute('aria-expanded')
  espanso === 'true' ? ok(suite, 'aria-expanded aggiornato') : ko(suite, 'aria-expanded aggiornato', `valore=${espanso}`)

  const bloccoScroll = await p.evaluate(() => document.body.style.overflow)
  bloccoScroll === 'hidden' ? ok(suite, 'scroll di fondo bloccato') : ko(suite, 'scroll di fondo bloccato', bloccoScroll)

  const vociMenu = await drawer.locator('a').count()
  vociMenu >= 9 ? ok(suite, 'voci di menu presenti', `${vociMenu} link`) : ko(suite, 'voci di menu presenti', `${vociMenu}`)

  // Navigazione da una voce del menu
  await drawer.locator('a[href="/#servizi"]').click()
  await p.waitForTimeout(1200)
  const chiuso = !(await drawer.isVisible().catch(() => false))
  chiuso ? ok(suite, 'il menu si chiude dopo il clic') : ko(suite, 'il menu si chiude dopo il clic')

  const suServizi = await p.evaluate(() => {
    const r = document.getElementById('servizi')?.getBoundingClientRect()
    return r ? Math.round(r.top) : null
  })
  suServizi !== null && suServizi < 140
    ? ok(suite, 'scroll alla sezione servizi', `top=${suServizi}px`)
    : ko(suite, 'scroll alla sezione servizi', `top=${suServizi}`)

  // Chiusura con il pulsante X
  await p.evaluate(() => window.scrollTo(0, 0))
  await p.locator('header button[aria-label="Apri il menu"]').click()
  await p.locator('nav[aria-label="Menu mobile"]').waitFor({ state: 'visible' })
  await p.waitForTimeout(700)
  await p.locator('button[aria-label="Chiudi il menu"]').click()
  await p.waitForTimeout(900)
  const riChiuso = !(await p.locator('nav[aria-label="Menu mobile"]').isVisible().catch(() => false))
  riChiuso ? ok(suite, 'chiusura dal pulsante X') : ko(suite, 'chiusura dal pulsante X')

  const scrollRipristinato = await p.evaluate(() => document.body.style.overflow)
  scrollRipristinato !== 'hidden'
    ? ok(suite, 'scroll ripristinato alla chiusura')
    : ko(suite, 'scroll ripristinato alla chiusura')

  await ctx.close()
}

/* ============================== 5. Moduli ================================ */
{
  const suite = '5. Moduli'

  // 5a. Contatti in home
  {
    const { ctx, p } = await apri('/')
    await p.locator('#contatti').scrollIntoViewIfNeeded()
    await p.waitForTimeout(500)

    const invio = p.locator('form:has(textarea[name="messaggio"]) button[type="submit"]')
    await invio.click()
    await p.waitForTimeout(400)
    const bloccato = await p.evaluate(
      () => !document.querySelector('input[name="nome"]').validity.valid,
    )
    bloccato ? ok(suite, 'contatti: campi obbligatori bloccano l’invio') : ko(suite, 'contatti: validazione nativa')

    await p.fill('form:has(textarea[name="messaggio"]) input[name="nome"]', 'Mario Rossi')
    await p.fill('form:has(textarea[name="messaggio"]) input[name="email"]', 'mario@example.com')
    await p.fill('form:has(textarea[name="messaggio"]) textarea[name="messaggio"]', 'Ho lo schermo rotto, quanto costa?')
    await p.check('form:has(textarea[name="messaggio"]) input[name="privacy"]')
    await invio.click()
    await p.waitForTimeout(2500)
    const esito = await p.locator('form:has(textarea[name="messaggio"]) [role="status"]').textContent().catch(() => null)
    esito ? ok(suite, 'contatti: invio con esito mostrato', esito.slice(0, 70)) : ko(suite, 'contatti: nessun esito mostrato')

    const svuotato = await p.inputValue('form:has(textarea[name="messaggio"]) input[name="nome"]')
    svuotato === '' ? ok(suite, 'contatti: modulo azzerato dopo l’invio') : ko(suite, 'contatti: modulo non azzerato')
    await ctx.close()
  }

  // 5b. Preventivo con validazione lato server
  {
    const { ctx, p } = await apri('/preventivo')
    await p.fill('input[name="nome"]', 'A')
    await p.fill('input[name="telefono"]', '3401234567')
    await p.fill('input[name="email"]', 'test@example.com')
    await p.fill('input[name="dispositivo"]', 'iPhone 13')
    await p.fill('textarea[name="problema"]', 'Schermo rotto dopo una caduta, il touch non risponde.')
    await p.check('input[name="privacy"]')
    // Aggira la validazione nativa per verificare quella del server
    await p.evaluate(() => document.querySelector('form').setAttribute('novalidate', ''))
    await p.locator('button[type="submit"]').click()
    await p.waitForTimeout(2500)
    const errore = await p.locator('[role="status"]').textContent().catch(() => '')
    ;/almeno 2 caratteri|Nome/i.test(errore ?? '')
      ? ok(suite, 'preventivo: errore del server mostrato', errore.slice(0, 70))
      : ko(suite, 'preventivo: errore del server non mostrato', String(errore).slice(0, 70))

    await p.fill('input[name="nome"]', 'Mario Rossi')
    await p.locator('button[type="submit"]').click()
    await p.waitForTimeout(2500)
    const successo = await p.locator('[role="status"]').textContent().catch(() => '')
    ;/PRV-|inviata|registrata/i.test(successo ?? '')
      ? ok(suite, 'preventivo: invio riuscito', successo.slice(0, 80))
      : ko(suite, 'preventivo: invio non riuscito', String(successo).slice(0, 80))

    // Servizio preselezionato dal link della card
    await p.goto(`${BASE}/preventivo?servizio=${encodeURIComponent('Riparazione Mac')}`, { waitUntil: 'networkidle' })
    await p.waitForTimeout(900)
    const preselezionato = await p.inputValue('select[name="servizio"]')
    preselezionato === 'Riparazione Mac'
      ? ok(suite, 'preventivo: servizio preselezionato dal link')
      : ko(suite, 'preventivo: servizio non preselezionato', preselezionato)
    await ctx.close()
  }

  // 5c. Prenotazione appuntamento
  {
    const { ctx, p } = await apri('/prenota')
    const domani = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
    await p.fill('input[name="nome"]', 'Giulia Serra')
    await p.fill('input[name="telefono"]', '3401234567')
    await p.fill('input[name="email"]', 'giulia@example.com')
    await p.selectOption('select[name="servizio"]', { label: 'Cambio Batteria' })
    await p.fill('input[name="data"]', domani)
    await p.locator('label:has(input[name="ora"][value="10:00"])').click()
    await p.check('input[name="privacy"]')
    await p.locator('button[type="submit"]').click()
    await p.waitForTimeout(2500)
    const esito = await p.locator('[role="status"]').textContent().catch(() => '')
    ;/APP-|richiesto|registrato/i.test(esito ?? '')
      ? ok(suite, 'appuntamento: invio riuscito', esito.slice(0, 80))
      : ko(suite, 'appuntamento: invio non riuscito', String(esito).slice(0, 80))

    // Data passata rifiutata dal server
    await p.evaluate(() => {
      const campo = document.querySelector('input[name="data"]')
      campo.removeAttribute('min')
      campo.value = '2020-01-01'
      campo.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await p.fill('input[name="nome"]', 'Giulia Serra')
    await p.fill('input[name="telefono"]', '3401234567')
    await p.fill('input[name="email"]', 'giulia@example.com')
    await p.selectOption('select[name="servizio"]', { label: 'Cambio Batteria' })
    await p.locator('label:has(input[name="ora"][value="10:00"])').click()
    await p.check('input[name="privacy"]')
    await p.locator('button[type="submit"]').click()
    await p.waitForTimeout(2200)
    const rifiuto = await p.locator('[role="status"]').textContent().catch(() => '')
    ;/data futura|Data/i.test(rifiuto ?? '')
      ? ok(suite, 'appuntamento: data passata rifiutata', rifiuto.slice(0, 70))
      : ko(suite, 'appuntamento: data passata accettata', String(rifiuto).slice(0, 70))
    await ctx.close()
  }
}

/* ============================== 6. Interazioni ========================== */
{
  const suite = '6. Interazioni'
  const { ctx, p } = await apri('/')

  // Ricerca
  await p.keyboard.press('Control+k')
  await p.waitForTimeout(600)
  const dialogo = p.locator('[role="dialog"][aria-label="Ricerca nel sito"]')
  ;(await dialogo.isVisible()) ? ok(suite, 'ricerca: apertura con Ctrl+K') : ko(suite, 'ricerca: apertura con Ctrl+K')

  await p.keyboard.type('batteria')
  await p.waitForTimeout(500)
  const risultati = await dialogo.locator('li a').count()
  risultati > 0 ? ok(suite, 'ricerca: risultati pertinenti', `${risultati} risultati`) : ko(suite, 'ricerca: nessun risultato')

  await p.keyboard.press('Escape')
  await p.waitForTimeout(500)
  !(await dialogo.isVisible().catch(() => false))
    ? ok(suite, 'ricerca: chiusura con Escape')
    : ko(suite, 'ricerca: chiusura con Escape')

  // Tema
  const temaIniziale = await p.evaluate(() => document.documentElement.dataset.theme)
  await p.locator('header button[aria-label*="tema"]').click()
  await p.waitForTimeout(400)
  const temaDopo = await p.evaluate(() => document.documentElement.dataset.theme)
  const salvato = await p.evaluate(() => localStorage.getItem('ioriparo-tema'))
  temaIniziale !== temaDopo && salvato === temaDopo
    ? ok(suite, 'tema: commutazione e persistenza', `${temaIniziale} → ${temaDopo}`)
    : ko(suite, 'tema: commutazione', `${temaIniziale} → ${temaDopo}, salvato=${salvato}`)

  await p.reload({ waitUntil: 'networkidle' })
  const temaRicaricato = await p.evaluate(() => document.documentElement.dataset.theme)
  temaRicaricato === temaDopo ? ok(suite, 'tema: mantenuto dopo il ricaricamento') : ko(suite, 'tema: perso al ricaricamento')

  // Filtri servizi
  await p.locator('#servizi').scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  const totale = await p.locator('#servizi ul > li').count()
  await p.locator('#servizi button[aria-pressed]', { hasText: 'Software' }).first().click()
  await p.waitForTimeout(900)
  const filtrati = await p.locator('#servizi ul > li').count()
  filtrati > 0 && filtrati < totale
    ? ok(suite, 'servizi: filtro per categoria', `${totale} → ${filtrati}`)
    : ko(suite, 'servizi: filtro non funzionante', `${totale} → ${filtrati}`)
  await p.locator('#servizi button[aria-pressed]').first().click()
  await p.waitForTimeout(700)

  // FAQ
  await p.locator('#faq').scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  const bottoneFaq = p.locator('#faq button[aria-expanded]').nth(2)
  await bottoneFaq.click()
  await p.waitForTimeout(600)
  const aperta = await bottoneFaq.getAttribute('aria-expanded')
  aperta === 'true' ? ok(suite, 'FAQ: apertura della risposta') : ko(suite, 'FAQ: risposta non aperta')

  // Galleria
  await p.locator('#galleria').scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.locator('#galleria li button').first().click()
  await p.waitForTimeout(700)
  const lente = p.locator('[role="dialog"]').last()
  ;(await lente.isVisible()) ? ok(suite, 'galleria: ingrandimento immagine') : ko(suite, 'galleria: ingrandimento')
  await p.keyboard.press('Escape')
  await p.waitForTimeout(600)
  !(await lente.isVisible().catch(() => false))
    ? ok(suite, 'galleria: chiusura con Escape')
    : ko(suite, 'galleria: chiusura con Escape')

  await ctx.close()
}

/* ============================== 7. Accessibilità ======================== */
{
  const suite = '7. Accessibilità'
  const { ctx, p } = await apri('/')

  // Salta al contenuto
  await p.keyboard.press('Tab')
  const primo = await p.evaluate(() => {
    const a = document.activeElement
    return { tag: a?.tagName, testo: (a?.textContent || '').trim().slice(0, 30), href: a?.getAttribute?.('href') }
  })
  primo.href === '#contenuto'
    ? ok(suite, 'primo Tab: collegamento "Vai al contenuto"')
    : ko(suite, 'primo Tab: collegamento salta-contenuto', JSON.stringify(primo))

  // Focus visibile
  const focus = await p.evaluate(() => {
    const stile = getComputedStyle(document.activeElement)
    return { outline: stile.outlineWidth, colore: stile.outlineColor }
  })
  parseFloat(focus.outline) > 0 ? ok(suite, 'indicatore di focus visibile', JSON.stringify(focus)) : ko(suite, 'focus non visibile')

  // Percorso da tastiera fino al primo CTA
  let trovato = null
  for (let i = 0; i < 25 && !trovato; i += 1) {
    await p.keyboard.press('Tab')
    const corrente = await p.evaluate(() => {
      const a = document.activeElement
      return { testo: (a?.textContent || '').trim(), href: a?.getAttribute?.('href') }
    })
    if (corrente.testo.includes('Richiedi Preventivo')) trovato = corrente
  }
  trovato ? ok(suite, 'CTA principale raggiungibile da tastiera') : ko(suite, 'CTA principale non raggiunta in 25 Tab')

  // Attivazione con Invio
  if (trovato) {
    await p.keyboard.press('Enter')
    await p.waitForTimeout(1500)
    const url = p.url()
    url.includes('/preventivo') ? ok(suite, 'CTA attivabile con Invio', url) : ko(suite, 'CTA non attivabile con Invio', url)
    await p.goBack({ waitUntil: 'networkidle' })
  }

  // Contrasto dei testi tenui sul fondo
  const contrasto = await p.evaluate(() => {
    const luminanza = (c) => {
      const [r, g, b] = c.match(/\d+/g).slice(0, 3).map((v) => {
        const s = Number(v) / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const el = document.querySelector('.testo-tenue')
    if (!el) return null
    const testo = luminanza(getComputedStyle(el).color)
    const fondo = luminanza(getComputedStyle(document.body).backgroundColor)
    const chiaro = Math.max(testo, fondo)
    const scuro = Math.min(testo, fondo)
    return Math.round(((chiaro + 0.05) / (scuro + 0.05)) * 100) / 100
  })
  contrasto >= 4.5
    ? ok(suite, 'contrasto testo secondario', `${contrasto}:1`)
    : ko(suite, 'contrasto testo secondario insufficiente', `${contrasto}:1`)

  await ctx.close()
}

/* ============================== 8. Responsive =========================== */
{
  const suite = '8. Responsive'
  const formati = [
    { nome: 'smartphone 320', width: 320, height: 720 },
    { nome: 'smartphone 390', width: 390, height: 844 },
    { nome: 'tablet 768', width: 768, height: 1024 },
    { nome: 'tablet 1024', width: 1024, height: 768 },
    { nome: 'desktop 1440', width: 1440, height: 900 },
    { nome: 'desktop 1920', width: 1920, height: 1080 },
  ]

  for (const f of formati) {
    for (const percorso of ['/', '/preventivo', '/prenota']) {
      const { ctx, p } = await apri(percorso, { viewport: { width: f.width, height: f.height } })
      const misura = await p.evaluate(() => {
        window.scrollTo(600, 0)
        const scorso = window.scrollX
        window.scrollTo(0, 0)
        return {
          documento: document.documentElement.scrollWidth,
          finestra: window.innerWidth,
          scorso,
        }
      })
      misura.scorso === 0 && misura.documento <= misura.finestra + 1
        ? ok(suite, `${f.nome} ${percorso}: nessuno scorrimento orizzontale`)
        : ko(
            suite,
            `${f.nome} ${percorso}: scorrimento orizzontale`,
            `scrollWidth ${misura.documento} vs ${misura.finestra}, scorrimento reale ${misura.scorso}px`,
          )
      await ctx.close()
    }
  }

  // Aree toccabili sul telefono
  const { ctx, p } = await apri('/', { viewport: { width: 390, height: 844 }, mobile: true })
  const piccoli = await p.$$eval('header a, header button, main a[href], main button', (nodi) =>
    nodi
      .filter((n) => n.offsetParent !== null)
      .map((n) => {
        const r = n.getBoundingClientRect()
        return { testo: (n.textContent || n.getAttribute('aria-label') || '').trim().slice(0, 25), w: Math.round(r.width), h: Math.round(r.height) }
      })
      .filter((n) => (n.w < 40 || n.h < 40) && n.w > 0),
  )
  piccoli.length === 0
    ? ok(suite, 'aree toccabili ≥ 40px')
    : info(suite, 'aree toccabili sotto i 40px', piccoli.slice(0, 5).map((n) => `${n.testo} ${n.w}x${n.h}`).join(' | '))
  await ctx.close()
}

/* ============================== 9. Prestazioni ========================== */
{
  const suite = '9. Prestazioni'
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  const risorse = []
  p.on('response', async (r) => {
    const tipo = r.request().resourceType()
    if (['document', 'script', 'stylesheet', 'font', 'image'].includes(tipo)) {
      const lunghezza = Number(r.headers()['content-length'] ?? 0)
      risorse.push({ tipo, url: r.url().slice(-60), peso: lunghezza })
    }
  })
  await p.goto(BASE, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)

  const metriche = await p.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    return {
      domInteractive: Math.round(nav.domInteractive),
      caricamento: Math.round(nav.loadEventEnd),
      fcp: Math.round(paint.find((v) => v.name === 'first-contentful-paint')?.startTime ?? 0),
      trasferito: performance.getEntriesByType('resource').reduce((t, r) => t + (r.transferSize || 0), 0),
    }
  })

  const perTipo = risorse.reduce((acc, r) => {
    acc[r.tipo] = (acc[r.tipo] ?? 0) + 1
    return acc
  }, {})

  info(suite, 'risorse caricate', JSON.stringify(perTipo))
  info(suite, 'peso totale trasferito', `${Math.round(metriche.trasferito / 1024)} kB`)
  metriche.fcp < 1800
    ? ok(suite, 'first contentful paint', `${metriche.fcp} ms`)
    : ko(suite, 'first contentful paint lento', `${metriche.fcp} ms`)
  metriche.caricamento < 3000
    ? ok(suite, 'evento load', `${metriche.caricamento} ms`)
    : ko(suite, 'evento load lento', `${metriche.caricamento} ms`)

  // Spostamenti di layout
  const cls = await p.evaluate(
    () =>
      new Promise((risolvi) => {
        let totale = 0
        new PerformanceObserver((lista) => {
          lista.getEntries().forEach((e) => {
            if (!e.hadRecentInput) totale += e.value
          })
        }).observe({ type: 'layout-shift', buffered: true })
        setTimeout(() => risolvi(Math.round(totale * 1000) / 1000), 1500)
      }),
  )
  cls < 0.1 ? ok(suite, 'cumulative layout shift', String(cls)) : ko(suite, 'layout shift elevato', String(cls))

  // Immagini con dimensioni dichiarate
  const senzaDimensioni = await p.$$eval('img', (nodi) =>
    nodi.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.src.slice(-50)),
  )
  senzaDimensioni.length === 0
    ? ok(suite, 'immagini con width e height')
    : ko(suite, 'immagini senza dimensioni', senzaDimensioni.slice(0, 4).join(' | '))

  await ctx.close()
}

await browser.close()

/* ============================== Riepilogo =============================== */
const perSuite = {}
esiti.forEach((e) => {
  perSuite[e.suite] = perSuite[e.suite] ?? []
  perSuite[e.suite].push(e)
})

console.log('\n================ AUDIT ================\n')
Object.entries(perSuite).forEach(([suite, voci]) => {
  console.log(`## ${suite}`)
  voci.forEach((v) => console.log(`  ${v.esito.padEnd(4)} ${v.nome}${v.dettaglio ? ` — ${v.dettaglio}` : ''}`))
  console.log('')
})

const ko_ = esiti.filter((e) => e.esito === 'KO')
console.log(`Totale: ${esiti.length} controlli — ${esiti.filter((e) => e.esito === 'OK').length} OK, ${ko_.length} KO, ${esiti.filter((e) => e.esito === 'INFO').length} INFO`)
writeFileSync(new URL('../audit.json', import.meta.url), JSON.stringify(esiti, null, 2))
process.exit(ko_.length ? 1 : 0)
