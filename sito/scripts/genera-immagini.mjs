/**
 * Genera le immagini raster del sito (Open Graph e icona Apple) partendo da
 * SVG scritti a mano, così restano nitide e leggerissime.
 *
 *   node scripts/genera-immagini.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const cartella = path.resolve(import.meta.dirname, '..', 'public')

const marchio = (dimensione) => `
  <g transform="translate(${dimensione.x} ${dimensione.y}) scale(${dimensione.scala})">
    <rect width="120" height="120" rx="30" fill="url(#blu)"/>
    <g transform="translate(24 24) scale(3)" fill="none" stroke="#fff" stroke-width="2.2"
       stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.2 5.6a5.6 5.6 0 0 0-7.3 6.7L5.8 19.4a2.4 2.4 0 0 0 3.4 3.4l7.1-7.1a5.6 5.6 0 0 0 6.7-7.3l-3 3-3.1-.8-.8-3.1 3-3Z"/>
    </g>
  </g>`

const definizioni = `
  <defs>
    <linearGradient id="sfondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1224"/><stop offset="100%" stop-color="#04060d"/>
    </linearGradient>
    <linearGradient id="blu" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2f6bff"/><stop offset="100%" stop-color="#1036e1"/>
    </linearGradient>
    <pattern id="griglia" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="#2f6bff" stroke-opacity="0.14"/>
    </pattern>
  </defs>`

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${definizioni}
  <rect width="1200" height="630" fill="url(#sfondo)"/>
  <rect width="1200" height="630" fill="url(#griglia)"/>
  <circle cx="1010" cy="120" r="240" fill="#2f6bff" fill-opacity="0.18"/>
  <circle cx="120" cy="560" r="200" fill="#2f6bff" fill-opacity="0.12"/>
  ${marchio({ x: 90, y: 92, scala: 1 })}
  <text x="230" y="152" font-family="Helvetica,Arial,sans-serif" font-size="46" font-weight="700" fill="#ffffff">Io Riparo</text>
  <text x="230" y="192" font-family="Helvetica,Arial,sans-serif" font-size="21" letter-spacing="5" fill="#8eb5ff">ASSISTENZA INFORMATICA</text>
  <text x="90" y="330" font-family="Helvetica,Arial,sans-serif" font-size="60" font-weight="700" fill="#ffffff">Riparazione Smartphone,</text>
  <text x="90" y="404" font-family="Helvetica,Arial,sans-serif" font-size="60" font-weight="700" fill="#ffffff">Computer e Assistenza</text>
  <text x="90" y="478" font-family="Helvetica,Arial,sans-serif" font-size="60" font-weight="700" fill="#598eff">Informatica</text>
  <rect x="90" y="524" width="640" height="2" fill="#2f6bff" fill-opacity="0.5"/>
  <text x="90" y="574" font-family="Helvetica,Arial,sans-serif" font-size="26" fill="#9aa6c4">Via Gianni Rodari 13 · 08048 Tortolì (NU) · Preventivi gratuiti</text>
</svg>`

const icona = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  ${definizioni}
  <rect width="180" height="180" rx="40" fill="url(#sfondo)"/>
  ${marchio({ x: 30, y: 30, scala: 1 })}
</svg>`

await mkdir(cartella, { recursive: true })

await writeFile(
  path.join(cartella, 'og.png'),
  await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toBuffer(),
)

await writeFile(
  path.join(cartella, 'apple-icon.png'),
  await sharp(Buffer.from(icona)).png({ compressionLevel: 9 }).toBuffer(),
)

await writeFile(
  path.join(cartella, 'icona-192.png'),
  await sharp(Buffer.from(icona)).resize(192, 192).png({ compressionLevel: 9 }).toBuffer(),
)

await writeFile(
  path.join(cartella, 'icona-512.png'),
  await sharp(Buffer.from(icona)).resize(512, 512).png({ compressionLevel: 9 }).toBuffer(),
)

console.log('Immagini generate in public/: og.png, apple-icon.png, icona-192.png, icona-512.png')
