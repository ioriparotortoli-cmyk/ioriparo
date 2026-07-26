/**
 * Genera un'anteprima autonoma della home in un unico file HTML.
 *
 * Il file riusa il markup e il CSS reali della build (nessun layout
 * riscritto): serve a mostrare il sito dove non è possibile eseguire
 * Next.js, ad esempio in una pagina statica condivisa.
 *
 * Uso: avviare il sito (`npm run build && npm run start`) e poi
 *   node scripts/genera-anteprima.mjs [url] [file-di-uscita]
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://localhost:3000'
const USCITA = process.argv[3] ?? path.resolve(import.meta.dirname, '..', 'anteprima', 'index.html')
const CHROMIUM =
  process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const RADICE = path.resolve(import.meta.dirname, '..')

const browser = await chromium.launch({ executablePath: CHROMIUM })
const contesto = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const pagina = await contesto.newPage()

await pagina.goto(BASE, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(1200)


/* --- risposte delle FAQ: nel DOM ne esiste una sola per volta ------------- */
const faq = []
const bottoniFaq = pagina.locator('#faq button[aria-controls^="risposta-"]')
for (let indice = 0; indice < (await bottoniFaq.count()); indice += 1) {
  const bottone = bottoniFaq.nth(indice)
  const aperta = (await bottone.getAttribute('aria-expanded')) === 'true'
  if (!aperta) await bottone.click()
  await pagina.waitForTimeout(400)
  faq.push({
    domanda: (await bottone.innerText()).trim(),
    risposta: (await pagina.locator(`#risposta-${indice} p`).innerText()).trim(),
  })
  await bottone.click()
  await pagina.waitForTimeout(300)
}

/* --- categorie: si ricavano filtrando e leggendo cosa resta visibile ------ */
async function mappaCategorie(sezione, selettoreVoce, chiave) {
  const chip = pagina.locator(`${sezione} button[aria-pressed]`)
  const etichette = await chip.allInnerTexts()
  const mappa = {}

  for (const etichetta of etichette.slice(1)) {
    await pagina.locator(`${sezione} button[aria-pressed]`, { hasText: etichetta }).first().click()
    await pagina.waitForTimeout(600)
    const visibili = await pagina.$$eval(
      `${sezione} ${selettoreVoce}`,
      (voci, attributo) =>
        voci.map((voce) =>
          attributo === 'id' ? voce.id : (voce.textContent ?? '').trim(),
        ),
      chiave,
    )
    visibili.filter(Boolean).forEach((voce) => {
      mappa[voce] = etichetta.trim()
    })
  }

  await pagina.locator(`${sezione} button[aria-pressed]`).first().click()
  await pagina.waitForTimeout(700)
  return mappa
}

const categorieServizi = await mappaCategorie('#servizi', 'li[id^="servizio-"]', 'id')
const categorieGalleria = await mappaCategorie('#galleria', 'li', 'testo')

/* --- didascalie della galleria per la finestra di ingrandimento ----------- */
const galleria = await pagina.$$eval('#galleria li button', (bottoni) =>
  bottoni.map((bottone) => ({
    titolo: bottone.querySelector('span:last-child span:last-child')?.textContent ?? '',
  })),
)

/* --- scorrimento completo: fa concludere le animazioni di comparsa -------- */
await pagina.evaluate(async () => {
  const altezza = document.body.scrollHeight
  for (let y = 0; y < altezza; y += 400) {
    window.scrollTo(0, y)
    await new Promise((risolvi) => setTimeout(risolvi, 60))
  }
  window.scrollTo(0, 0)
})
await pagina.waitForTimeout(1500)

/* --- immagini incorporate: l'anteprima non deve fare richieste esterne ---- */
await pagina.evaluate(async () => {
  const inLinea = async (url) => {
    const risposta = await fetch(url)
    const contenuto = await risposta.blob()
    return new Promise((risolvi) => {
      const lettore = new FileReader()
      lettore.onload = () => risolvi(lettore.result)
      lettore.readAsDataURL(contenuto)
    })
  }

  for (const immagine of document.querySelectorAll('img')) {
    const sorgente = immagine.currentSrc || immagine.src
    if (!sorgente || sorgente.startsWith('data:')) continue
    immagine.removeAttribute('srcset')
    immagine.removeAttribute('sizes')
    immagine.removeAttribute('loading')
    try {
      immagine.src = await inLinea(sorgente)
    } catch {
      // Se una risorsa non è raggiungibile si lascia il riferimento originale.
    }
  }
})
await pagina.waitForTimeout(600)

const documento = await pagina.content()
await browser.close()

/* ------------------------------------------------------------ montaggio -- */

const corpo = documento.slice(documento.indexOf('<body'), documento.lastIndexOf('</body>'))
let html = corpo.slice(corpo.indexOf('>') + 1)

// Via gli script di Next: l'anteprima è statica e usa un proprio script.
html = html.replace(/<script[\s\S]*?<\/script>/g, '')
html = html.replace(/<next-route-announcer[\s\S]*?<\/next-route-announcer>/g, '')
html = html.replace(/<template[\s\S]*?<\/template>/g, '')

// Stati iniziali delle animazioni: senza Framer Motion resterebbero invisibili.
// Si rimuovono anche le altezze azzerate dei pannelli chiusi (FAQ), che nel
// file statico sono governati dal solo `display`.
html = html.replace(/style="([^"]*)"/g, (intero, stile) => {
  const nascosto = /opacity:\s*0/.test(stile)
  if (!nascosto && !/transform:\s*translate/.test(stile)) return intero
  const pulito = stile
    .split(';')
    .filter((regola) => {
      if (/^\s*(opacity|transform)\s*:/.test(regola)) return false
      if (nascosto && /^\s*height\s*:\s*0/.test(regola)) return false
      return true
    })
    .join(';')
  return pulito.trim() ? `style="${pulito}"` : ''
})

// La mappa incorporata richiede Google: nell'anteprima diventa un riquadro
// con l'indirizzo e il collegamento alla scheda.
const cartaMappa = `<div class="grid h-80 place-items-center px-6 text-center superficie-alt">
  <div>
    <p class="text-sm font-bold uppercase tracking-[0.16em] text-elettrico-400">Dove siamo</p>
    <p class="mt-3 text-lg font-bold">Via Gianni Rodari 13</p>
    <p class="mt-1 text-sm testo-tenue">08048 Tortolì (NU) — Sardegna</p>
    <a class="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-elettrico-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-elettrico-500"
       href="https://www.google.com/maps/search/?api=1&amp;query=Via%20Gianni%20Rodari%2013%2C%2008048%20Tortol%C3%AC%20(NU)"
       target="_blank" rel="noopener noreferrer">Apri in Google Maps</a>
    <p class="mt-4 text-xs testo-tenue">Nel sito reale qui è incorporata la mappa interattiva.</p>
  </div>
</div>`

html = html.replace(/<iframe[^>]*google\.com\/maps[\s\S]*?<\/iframe>/g, cartaMappa)

// Foglio di stile compilato, con i caratteri incorporati come data URI.
const cartellaCss = path.join(RADICE, '.next', 'static', 'css')
const fogli = await readdir(cartellaCss)
let css = (
  await Promise.all(fogli.map((foglio) => readFile(path.join(cartellaCss, foglio), 'utf8')))
).join('\n')

const caratteri = [...css.matchAll(/url\((\/_next\/static\/media\/[^)]+\.woff2)\)/g)]
for (const [intero, percorso] of caratteri) {
  const dati = await readFile(path.join(RADICE, '.next', percorso.replace('/_next/', '')))
  css = css.replace(intero, `url(data:font/woff2;base64,${dati.toString('base64')})`)
}

const dati = {
  faq,
  categorieServizi,
  categorieGalleria,
  galleria,
}

const script = `
(function () {
  var dati = ${JSON.stringify(dati)};
  var radice = document.documentElement;
  if (!radice.getAttribute('data-theme')) radice.setAttribute('data-theme', 'dark');

  /* Tema chiaro/scuro */
  document.querySelectorAll('button[aria-label*="tema"]').forEach(function (bottone) {
    bottone.addEventListener('click', function () {
      var scuro = radice.getAttribute('data-theme') !== 'light';
      radice.setAttribute('data-theme', scuro ? 'light' : 'dark');
    });
  });

  /* Filtri di servizi e galleria */
  function filtra(sezione, mappa, chiave) {
    var contenitore = document.querySelector(sezione);
    if (!contenitore) return;
    var chip = contenitore.querySelectorAll('button[aria-pressed]');
    var voci = contenitore.querySelectorAll('ul > li');
    chip.forEach(function (bottone) {
      bottone.addEventListener('click', function () {
        var scelta = bottone.textContent.trim();
        chip.forEach(function (altro) {
          var attivo = altro === bottone;
          altro.setAttribute('aria-pressed', String(attivo));
          altro.className = altro.className
            .replace(/border-elettrico-500 bg-elettrico-600 text-white[^"]*/, '')
            .replace(/border-\\[color:var\\(--bordo\\)\\] testo-tenue[^"]*/, '');
          altro.className = altro.className.trim() + (attivo
            ? ' border-elettrico-500 bg-elettrico-600 text-white'
            : ' border-[color:var(--bordo)] testo-tenue');
        });
        voci.forEach(function (voce) {
          var id = chiave === 'id' ? voce.id : (voce.textContent || '').trim();
          var categoria = mappa[id];
          var mostra = /^Tutt/.test(scelta) || categoria === scelta;
          voce.style.display = mostra ? '' : 'none';
        });
      });
    });
  }

  filtra('#servizi', dati.categorieServizi, 'id');
  filtra('#galleria', dati.categorieGalleria, 'testo');

  /* Domande frequenti */
  document.querySelectorAll('#faq button[aria-controls^="risposta-"]').forEach(function (bottone, indice) {
    var scheda = bottone.closest('li').firstElementChild;
    var risposta = document.createElement('div');
    risposta.id = 'risposta-' + indice;
    risposta.innerHTML =
      '<p class="px-6 pb-6 text-sm leading-relaxed testo-tenue">' +
      (dati.faq[indice] ? dati.faq[indice].risposta : '') +
      '</p>';
    risposta.style.display = bottone.getAttribute('aria-expanded') === 'true' ? '' : 'none';
    if (!document.getElementById(risposta.id)) scheda.appendChild(risposta);

    bottone.addEventListener('click', function () {
      var apri = bottone.getAttribute('aria-expanded') !== 'true';
      document.querySelectorAll('#faq button[aria-controls^="risposta-"]').forEach(function (altro, i) {
        altro.setAttribute('aria-expanded', 'false');
        var pannello = document.getElementById('risposta-' + i);
        if (pannello) pannello.style.display = 'none';
        var freccia = altro.querySelector('svg');
        if (freccia) freccia.style.transform = '';
      });
      if (apri) {
        bottone.setAttribute('aria-expanded', 'true');
        var pannello = document.getElementById('risposta-' + indice);
        if (pannello) pannello.style.display = '';
        var freccia = bottone.querySelector('svg');
        if (freccia) freccia.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* Ingrandimento della galleria */
  var lente = document.createElement('div');
  lente.style.cssText =
    'position:fixed;inset:0;z-index:95;display:none;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.85);backdrop-filter:blur(6px);padding:1rem';
  lente.innerHTML =
    '<figure style="max-width:46rem;border-radius:1.5rem;overflow:hidden;background:#04060d;border:1px solid rgba(255,255,255,.1)">' +
    '<img alt="" style="width:100%;display:block"><figcaption style="padding:1.25rem 1.5rem;color:#f2f5ff;font-weight:700"></figcaption></figure>';
  document.body.appendChild(lente);
  lente.addEventListener('click', function () { lente.style.display = 'none'; });

  document.querySelectorAll('#galleria li button').forEach(function (bottone) {
    bottone.addEventListener('click', function () {
      var immagine = bottone.querySelector('img');
      lente.querySelector('img').src = immagine.src;
      lente.querySelector('figcaption').textContent =
        (bottone.querySelector('span:last-child span:last-child') || {}).textContent || '';
      lente.style.display = 'flex';
    });
  });

  /* Collegamenti non disponibili nell'anteprima statica */
  var avviso = document.createElement('div');
  avviso.style.cssText =
    'position:fixed;left:50%;bottom:1.5rem;transform:translateX(-50%);z-index:120;display:none;' +
    'background:#1548f5;color:#fff;padding:.7rem 1.1rem;border-radius:999px;font-size:.85rem;' +
    'font-weight:600;box-shadow:0 12px 30px -12px rgba(21,72,245,.9)';
  document.body.appendChild(avviso);

  document.addEventListener('click', function (evento) {
    var collegamento = evento.target.closest('a');
    if (!collegamento) return;
    var href = collegamento.getAttribute('href') || '';
    if (href.indexOf('/') !== 0 || href.indexOf('/#') === 0) return;
    evento.preventDefault();
    avviso.textContent = 'Anteprima statica della home: la pagina ' + href + ' è nel progetto completo.';
    avviso.style.display = 'block';
    clearTimeout(avviso.timer);
    avviso.timer = setTimeout(function () { avviso.style.display = 'none'; }, 3200);
  });

  /* Ancore interne */
  document.querySelectorAll('a[href^="/#"]').forEach(function (collegamento) {
    collegamento.setAttribute('href', collegamento.getAttribute('href').slice(1));
  });
})();
`

const uscita = `<title>Io Riparo — Riparazione Smartphone, Computer e Assistenza Informatica</title>
<style>${css}</style>
${html}
<script>${script}</script>
`

await writeFile(USCITA, uscita)
console.log(`Anteprima scritta in ${USCITA} (${Math.round(uscita.length / 1024)} kB)`)
