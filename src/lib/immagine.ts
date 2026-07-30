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
 * Lato lungo del marchio salvato. Nell'intestazione dei documenti è largo
 * 38 mm: a 560 px si superano i 350 dpi, che in stampa non si distinguono
 * dall'originale.
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

  return tela.toDataURL('image/png')
}
