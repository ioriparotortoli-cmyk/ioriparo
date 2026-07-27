/**
 * Genera un'anteprima del sito in un unico file HTML.
 *
 * Serve per farlo provare prima della pubblicazione su un hosting qualsiasi:
 * CSS, JavaScript e immagini del marchio vengono incorporati nella pagina, la
 * navigazione passa dal fragment (#/servizi) e il file funziona anche aperto
 * da disco, senza server.
 *
 * Uso: npm run anteprima   →   anteprima/io-riparo.html
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const radice = join(dirname(fileURLToPath(import.meta.url)), '..')
const temporanea = join(radice, '.anteprima-build')
const destinazione = join(radice, 'anteprima')

/* 1 — build dedicata: un solo file JavaScript e navigazione con fragment */
rmSync(temporanea, { recursive: true, force: true })
execFileSync('npx', ['vite', 'build', '--outDir', temporanea, '--emptyOutDir'], {
  cwd: radice,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_ROUTER: 'hash',
    ANTEPRIMA: '1',
    VITE_ANTEPRIMA: '1',
  },
})

/* 2 — le risorse diventano parte della pagina */
const assets = join(temporanea, 'assets')
const file = readdirSync(assets)
const js = file.filter((f) => f.endsWith('.js'))
const css = file.filter((f) => f.endsWith('.css'))

if (js.length !== 1) {
  throw new Error(`attesi 1 file JavaScript, trovati ${js.length}: la build non è stata unificata`)
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' }

/** Contenuto di un'immagine come data URI, letto una sola volta. */
const cache = new Map()
function dataUri(percorso) {
  if (cache.has(percorso)) return cache.get(percorso)
  const disco = join(temporanea, percorso)
  if (!existsSync(disco)) return null
  const tipo = MIME[extname(percorso)] ?? 'application/octet-stream'
  const dati = `data:${tipo};base64,${readFileSync(disco).toString('base64')}`
  cache.set(percorso, dati)
  return dati
}

/** Nel CSS e nell'HTML il percorso viene sostituito dal contenuto. */
function incorporaImmagini(testo) {
  return testo.replace(/["'`(](\/marchio\/[\w.-]+)["'`)]/g, (intero, percorso) => {
    const dati = dataUri(percorso)
    return dati ? intero[0] + dati + intero[intero.length - 1] : intero
  })
}

/**
 * Nel JavaScript ogni immagine viene incorporata una sola volta in una mappa:
 * inserirla a ogni occorrenza gonficherebbe il file di alcuni megabyte.
 */
function collegaImmagini(testo) {
  const usate = new Set()
  const risultato = testo.replace(/(["'`])(\/marchio\/[\w.-]+)\1/g, (intero, _q, percorso) => {
    if (!dataUri(percorso)) return intero
    usate.add(percorso)
    return `__IMG__[${JSON.stringify(percorso)}]`
  })
  const mappa = Object.fromEntries([...usate].map((p) => [p, dataUri(p)]))
  return `const __IMG__ = ${JSON.stringify(mappa)};\n${risultato}`
}

const stile = incorporaImmagini(css.map((f) => readFileSync(join(assets, f), 'utf8')).join('\n'))
const script = collegaImmagini(readFileSync(join(assets, js[0]), 'utf8'))

let html = readFileSync(join(temporanea, 'index.html'), 'utf8')
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '')
  .replace(/<link[^>]*rel="stylesheet"[^>]*>/g, '')
  .replace(/<link[^>]*rel="(apple-touch-icon|manifest)"[^>]*>/g, '')

// prima si incorporano le immagini della pagina, poi si inseriscono stile e
// script: al contrario i percorsi già trasformati verrebbero espansi due volte
html = incorporaImmagini(html)
  .replace('</head>', () => `<style>${stile}</style>\n</head>`)
  .replace('</body>', () => `<script type="module">${script}</script>\n</body>`)

mkdirSync(destinazione, { recursive: true })
const uscita = join(destinazione, 'io-riparo.html')
writeFileSync(uscita, html)
rmSync(temporanea, { recursive: true, force: true })

console.log(`anteprima pronta: ${uscita} (${(html.length / 1024).toFixed(0)} kB)`)
