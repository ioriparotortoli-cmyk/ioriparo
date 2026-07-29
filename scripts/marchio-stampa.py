"""
Incorpora il marchio nei documenti stampabili.

Il documento stampato non e' una pagina del sito: si puo' scaricare come file
HTML e stamparlo da li' — e' anzi la strada che resta quando il browser blocca
la finestra di stampa. Un `<img src="/marchio/logo.png">` in quel file cerca
l'immagine sul disco e non la trova, e il cliente si porta a casa un foglio
senza intestazione. Incorporato nel documento, il marchio c'e' sempre.

Si parte dal logo con lettering scuro: i documenti si stampano su carta bianca.

    pip install Pillow && python3 scripts/marchio-stampa.py
"""

import base64
import io

from PIL import Image

SORGENTE = 'public/marchio/logo.png'
DESTINAZIONE = 'src/lib/stampa/marchio.ts'

# Nell'intestazione il marchio e' largo circa 38 mm. A 560 px si superano i
# 350 dpi, che in stampa non si distinguono dall'originale; piu' grande si
# gonfierebbe solo il documento.
LARGHEZZA = 560

im = Image.open(SORGENTE).convert('RGBA')
im.thumbnail((LARGHEZZA, LARGHEZZA * 2), Image.LANCZOS)

buffer = io.BytesIO()
im.save(buffer, 'PNG', optimize=True)
dati = base64.b64encode(buffer.getvalue()).decode()

with open(DESTINAZIONE, 'w') as f:
    f.write(f'''/**
 * Marchio Io Riparo per i documenti stampabili, incorporato come dati.
 *
 * NON scrivere questo file a mano: lo genera `scripts/marchio-stampa.py` a
 * partire da `public/marchio/logo.png`, che e' il marchio originale.
 *
 * Sta qui dentro invece che come collegamento a un file perche' il documento
 * si puo' scaricare e stampare da disco — la via che resta quando il browser
 * blocca la finestra di stampa — e li' un percorso al sito non risolve.
 */
export const LARGHEZZA_MARCHIO = {im.size[0]}
export const ALTEZZA_MARCHIO = {im.size[1]}

export const MARCHIO_STAMPA =
  'data:image/png;base64,{dati}'
''')

print(f'{DESTINAZIONE}: {im.size[0]}x{im.size[1]}, {len(dati) // 1024} kB in base64')
