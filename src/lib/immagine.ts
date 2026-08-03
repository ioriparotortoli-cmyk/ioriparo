/**
 * Preparazione del marchio caricato dall'utente.
 *
 * L'immagine finisce nell'archivio, dentro alle impostazioni dell'attività, e
 * da lì nei documenti stampati. Va quindi ridotta prima di salvarla: un logo
 * appena esportato può pesare qualche megabyte, che moltiplicato per ogni
 * documento generato diventa un peso inutile — e per la stampa non serve.
 */

/** Oltre questa misura un file non è un logo: è una fotografia. */
const PESO_MASSIMO = 12 * 1024 * 1024

/**
 * Lato lungo del marchio salvato. Nell'intestazione dei documenti arriva al
 * massimo a 62 mm: a 560 px restano oltre 220 dpi, che in stampa non si
 * distinguono dall'originale.
 */
const LATO = 560

export class ImmagineNonValida extends Error {}

function caricaImmagine(sorgente: string): Promise<HTMLImageElement> {
  return new Promise((risolvi, rifiuta) => {
    const img = new Image()
    img.onload = () => risolvi(img)
    img.onerror = () => rifiuta(new ImmagineNonValida('Non riesco ad aprire questa immagine.'))
    img.src = sorgente
  })
}

function leggi(file: File): Promise<string> {
  return new Promise((risolvi, rifiuta) => {
    const lettore = new FileReader()
    lettore.onload = () => risolvi(String(lettore.result))
    lettore.onerror = () => rifiuta(new ImmagineNonValida('Non riesco a leggere il file.'))
    lettore.readAsDataURL(file)
  })
}

/**
 * Riduce il marchio e lo restituisce come dati incorporabili.
 * Sempre PNG: il logo ha quasi sempre lo sfondo trasparente, e il JPEG lo
 * riempirebbe di nero.
 */
/** Due colori si equivalgono se non si distinguono a occhio. */
const SIMILE = 12
const uguali = (a: number[], b: number[]) =>
  Math.abs(a[0] - b[0]) < SIMILE && Math.abs(a[1] - b[1]) < SIMILE && Math.abs(a[2] - b[2]) < SIMILE

/**
 * Il rettangolo che contiene davvero il marchio, senza la cornice vuota
 * intorno.
 *
 * Serve perché i loghi esportati arrivano quasi sempre dentro a una tela più
 * grande: sul foglio e nel menu il marchio veniva rimpicciolito per far stare
 * anche il vuoto, e si vedeva un francobollo in mezzo al bianco. Si guarda che
 * cosa c'è nei quattro angoli: se sono tutti uguali fra loro, quello è lo
 * sfondo e si taglia via. Se sono diversi il marchio arriva ai bordi e non si
 * tocca niente.
 */
function contenuto(dati: ImageData): { x: number; y: number; w: number; h: number } | null {
  const { width: L, height: A, data: p } = dati
  const pixel = (x: number, y: number) => {
    const i = (y * L + x) * 4
    return [p[i], p[i + 1], p[i + 2], p[i + 3]]
  }

  const angoli = [pixel(0, 0), pixel(L - 1, 0), pixel(0, A - 1), pixel(L - 1, A - 1)]
  const trasparenti = angoli.every((c) => c[3] < 8)
  const tinta = angoli[0]
  if (!trasparenti && !angoli.every((c) => c[3] > 247 && uguali(c, tinta))) return null

  const sfondo = (x: number, y: number) => {
    const c = pixel(x, y)
    return trasparenti ? c[3] < 8 : c[3] < 8 || uguali(c, tinta)
  }

  let x1 = L
  let y1 = A
  let x2 = -1
  let y2 = -1
  for (let y = 0; y < A; y++) {
    for (let x = 0; x < L; x++) {
      if (sfondo(x, y)) continue
      if (x < x1) x1 = x
      if (x > x2) x2 = x
      if (y < y1) y1 = y
      if (y > y2) y2 = y
    }
  }

  if (x2 < x1 || y2 < y1) return null
  return { x: x1, y: y1, w: x2 - x1 + 1, h: y2 - y1 + 1 }
}

export async function marchioRidotto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new ImmagineNonValida('Serve un file immagine: PNG, JPG o SVG.')
  }
  if (file.size > PESO_MASSIMO) {
    throw new ImmagineNonValida('Immagine troppo grande: tieniti sotto i 12 MB.')
  }

  const img = await caricaImmagine(await leggi(file))

  // Un SVG senza misure dichiarate arriva con dimensioni nulle: in quel caso
  // si disegna dentro un quadrato, che è meglio di una divisione per zero.
  const largo = img.naturalWidth || LATO
  const alto = img.naturalHeight || LATO
  const scala = Math.min(1, LATO / Math.max(largo, alto))

  const tela = document.createElement('canvas')
  tela.width = Math.max(1, Math.round(largo * scala))
  tela.height = Math.max(1, Math.round(alto * scala))

  const contesto = tela.getContext('2d')
  if (!contesto) throw new ImmagineNonValida('Il browser non riesce a elaborare l’immagine.')
  contesto.drawImage(img, 0, 0, tela.width, tela.height)

  // Il ritaglio si calcola sulla copia rimpicciolita — meno pixel da leggere —
  // e poi si riporta sull'originale, così il taglio non costa qualità.
  const bordi = contenuto(contesto.getImageData(0, 0, tela.width, tela.height))
  if (!bordi || (bordi.w >= tela.width - 1 && bordi.h >= tela.height - 1)) {
    return tela.toDataURL('image/png')
  }

  const sx = bordi.x / scala
  const sy = bordi.y / scala
  const sw = bordi.w / scala
  const sh = bordi.h / scala
  const ritaglio = Math.min(1, LATO / Math.max(sw, sh))

  const finale = document.createElement('canvas')
  finale.width = Math.max(1, Math.round(sw * ritaglio))
  finale.height = Math.max(1, Math.round(sh * ritaglio))
  const pennello = finale.getContext('2d')
  if (!pennello) return tela.toDataURL('image/png')
  pennello.drawImage(img, sx, sy, sw, sh, 0, 0, finale.width, finale.height)

  return finale.toDataURL('image/png')
}
