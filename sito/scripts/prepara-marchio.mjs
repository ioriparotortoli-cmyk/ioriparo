/**
 * Prepara gli asset del marchio partendo dai file originali in `marchio/`.
 *
 *   node scripts/prepara-marchio.mjs
 *
 * Produce:
 *   public/marchio/lockup-chiaro.png   logo completo con testo bianco (fondo scuro)
 *   public/marchio/lockup-scuro.png    logo completo con testo nero (fondo chiaro)
 *   public/marchio/simbolo.png         solo il simbolo, per icone e contesti compatti
 *   public/favicon.png, apple-icon.png, icona-192.png, icona-512.png
 *   public/og.png                      anteprima per social e motori di ricerca
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RADICE = path.resolve(import.meta.dirname, '..')
const ORIGINALI = path.join(RADICE, 'marchio')
const USCITA = path.join(RADICE, 'public')
const MARCHIO = path.join(USCITA, 'marchio')

await mkdir(MARCHIO, { recursive: true })

const bianco = path.join(ORIGINALI, 'logo-testo-bianco.png')
const nero = path.join(ORIGINALI, 'logo-testo-nero.png')

/** Ritaglia i margini trasparenti e ridimensiona alla larghezza indicata. */
const lockup = async (sorgente, destinazione, larghezza = 900) =>
  sharp(sorgente)
    .trim({ threshold: 1 })
    .resize({ width: larghezza, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(destinazione)

const chiaro = await lockup(bianco, path.join(MARCHIO, 'lockup-chiaro.png'))
const scuro = await lockup(nero, path.join(MARCHIO, 'lockup-scuro.png'))

/**
 * Simbolo: nel logo il testo bianco si sovrappone alla parte bassa dello
 * smartphone, quindi non basta ritagliare. Si tengono i soli pixel azzurri
 * dell'icona e si rende trasparente tutto il resto, ottenendo il simbolo
 * completo (smartphone + portatile + attrezzi).
 */
const { data: pixel, info } = await sharp(bianco)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const bordi = { x0: info.width, y0: info.height, x1: 0, y1: 0 }

for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const i = (y * info.width + x) * info.channels
    const [r, , b, a] = [pixel[i], pixel[i + 1], pixel[i + 2], pixel[i + 3]]
    const azzurro = a > 40 && b > 90 && b - r > 20

    if (!azzurro) {
      pixel[i + 3] = 0
      continue
    }

    if (x < bordi.x0) bordi.x0 = x
    if (y < bordi.y0) bordi.y0 = y
    if (x > bordi.x1) bordi.x1 = x
    if (y > bordi.y1) bordi.y1 = y
  }
}

const simbolo = await sharp(pixel, {
  raw: { width: info.width, height: info.height, channels: info.channels },
})
  .extract({
    left: bordi.x0,
    top: bordi.y0,
    width: bordi.x1 - bordi.x0 + 1,
    height: bordi.y1 - bordi.y0 + 1,
  })
  .png()
  .toBuffer()

await sharp(simbolo)
  .resize({ width: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(MARCHIO, 'simbolo.png'))

/** Icona quadrata su fondo scuro, con margine di rispetto. */
const icona = async (dimensione, destinazione, sfondo = '#04070f') => {
  const interno = Math.round(dimensione * 0.7)
  const contenuto = await sharp(simbolo)
    .resize({ width: interno, height: interno, fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  return sharp({
    create: {
      width: dimensione,
      height: dimensione,
      channels: 4,
      background: sfondo,
    },
  })
    .composite([{ input: contenuto, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(destinazione)
}

await icona(32, path.join(USCITA, 'favicon.png'))
await icona(180, path.join(USCITA, 'apple-icon.png'))
await icona(192, path.join(USCITA, 'icona-192.png'))
await icona(512, path.join(USCITA, 'icona-512.png'))

/* ------------------------------------------------------------ Open Graph -- */

const sfondoOg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a1526"/><stop offset="55%" stop-color="#050b16"/><stop offset="100%" stop-color="#03070f"/>
    </linearGradient>
    <radialGradient id="alone" cx="0.78" cy="0.18" r="0.55">
      <stop offset="0%" stop-color="#1792d1" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#1792d1" stop-opacity="0"/>
    </radialGradient>
    <pattern id="griglia" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#29a8e0" stroke-opacity="0.09"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#fondo)"/>
  <rect width="1200" height="630" fill="url(#griglia)"/>
  <rect width="1200" height="630" fill="url(#alone)"/>
  <rect y="626" width="1200" height="4" fill="#1792d1"/>
</svg>`

const testoOg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <text x="80" y="400" font-family="Helvetica,Arial,sans-serif" font-size="52" font-weight="700" fill="#ffffff">Riparazione Smartphone, Computer</text>
  <text x="80" y="466" font-family="Helvetica,Arial,sans-serif" font-size="52" font-weight="700" fill="#29a8e0">e Assistenza Informatica</text>
  <text x="80" y="546" font-family="Helvetica,Arial,sans-serif" font-size="25" fill="#93a4bd">Via Gianni Rodari 13 · 08048 Tortolì (NU) · Preventivi gratuiti</text>
</svg>`

const lockupOg = await sharp(bianco).trim({ threshold: 1 }).resize({ width: 460 }).toBuffer()

await sharp(Buffer.from(sfondoOg))
  .composite([
    { input: lockupOg, left: 80, top: 70 },
    { input: Buffer.from(testoOg), left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(USCITA, 'og.png'))

console.log('Marchio pronto:')
console.log(`  lockup chiaro  ${chiaro.width}x${chiaro.height}`)
console.log(`  lockup scuro   ${scuro.width}x${scuro.height}`)
console.log('  simbolo, favicon, icone PWA e og.png rigenerati')
