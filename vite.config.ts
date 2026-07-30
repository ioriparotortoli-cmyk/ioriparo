import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Build del solo gestionale, per un'installazione presso un'altra attività.
 *
 * Il sito pubblico e il gestionale stanno nello stesso programma. Pubblicando
 * tutto sul dominio di un cliente, il suo indirizzo mostrerebbe il sito di Io
 * Riparo: chi siamo, le foto del laboratorio, le recensioni, i contatti. Con
 * questo interruttore le pagine del sito restano fuori dalle rotte e da qui si
 * ripulisce quel che resta del marchio nel guscio HTML e nei file statici.
 */
const soloGestionale = process.env.VITE_SOLO_GESTIONALE === '1'

/** Testa neutra: nessun nome, nessun indirizzo, e fuori dai motori di ricerca. */
const TESTA_NEUTRA = `    <title>Gestionale</title>
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#05070c" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <link rel="manifest" href="/gestionale.webmanifest" />`

const MANIFESTO_NEUTRO = {
  name: 'Gestionale',
  short_name: 'Gestionale',
  lang: 'it-IT',
  start_url: '/gestionale',
  scope: '/gestionale',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#05070c',
  theme_color: '#05070c',
}

function pluginSoloGestionale(): Plugin {
  return {
    name: 'io-riparo:solo-gestionale',
    apply: 'build',
    transformIndexHtml: {
      // `pre`, cioe' prima che Vite inserisca i suoi tag: la sostituzione
      // svuota la testa da un capo all'altro, e in coda a tutto si sarebbe
      // portata via anche lo script dell'applicazione, lasciando la pagina
      // bianca. Vite scrive i suoi tag dopo, nella testa gia' ripulita.
      order: 'pre',
      handler(html) {
        // Fuori titolo, descrizione, canonical, social, icone e manifesto.
        return html.replace(
          /(<meta name="viewport"[^>]*>)[\s\S]*?(\n\s*<\/head>)/,
          `$1\n\n${TESTA_NEUTRA}$2`,
        )
      },
    },
    closeBundle() {
      const dist = path.resolve(import.meta.dirname, 'dist')
      if (!fs.existsSync(dist)) return

      // Il marchio e le foto dei lavori sono di Io Riparo: sul dominio di un
      // altro non ci devono nemmeno arrivare. Il gestionale non li usa — il
      // logo dell'attività sta nel suo archivio, non in questi file.
      for (const via of ['marchio', 'foto', 'sitemap.xml', 'site.webmanifest']) {
        fs.rmSync(path.join(dist, via), { recursive: true, force: true })
      }

      fs.writeFileSync(
        path.join(dist, 'robots.txt'),
        '# Gestionale: area riservata, fuori dai motori di ricerca.\nUser-agent: *\nDisallow: /\n',
      )
      fs.writeFileSync(
        path.join(dist, 'gestionale.webmanifest'),
        JSON.stringify(MANIFESTO_NEUTRO, null, 2) + '\n',
      )
    },
  }
}

/**
 * Con `ANTEPRIMA=1` la build produce un solo file JavaScript, così
 * `npm run anteprima` può incorporare tutto in un'unica pagina HTML.
 * La build normale resta divisa per rotta, per non far scaricare ai
 * visitatori codice che non useranno.
 */
const anteprima = process.env.ANTEPRIMA === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ...(soloGestionale ? [pluginSoloGestionale()] : [])],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    ...(anteprima
      ? { rollupOptions: { output: { inlineDynamicImports: true } }, cssCodeSplit: false }
      : {}),
  },
})
