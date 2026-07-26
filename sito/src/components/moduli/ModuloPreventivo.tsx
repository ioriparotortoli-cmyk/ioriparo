'use client'

import { ImagePlus, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Bottone } from '@/components/ui/Bottone'
import { servizi } from '@/lib/dati/servizi'
import { MAX_BYTE_FOTO, MAX_FOTO, TIPI_FOTO } from '@/lib/validazione'
import { Campo, Consenso, Esito, Trappola, useInvioModulo } from './campi'

type Anteprima = { file: File; url: string }

export function ModuloPreventivo() {
  const { stato, invia, inCorso } = useInvioModulo('/api/preventivi')
  const [foto, impostaFoto] = useState<Anteprima[]>([])
  const [avviso, impostaAvviso] = useState<string | null>(null)
  const campoFile = useRef<HTMLInputElement>(null)
  const campoServizio = useRef<HTMLSelectElement>(null)

  // Il servizio arriva dal link "Chiedi un preventivo" delle card. Si legge
  // dopo il montaggio: così il modulo resta renderizzato dal server.
  useEffect(() => {
    const scelto = new URLSearchParams(window.location.search).get('servizio')
    if (scelto && campoServizio.current) campoServizio.current.value = scelto
  }, [])

  // Le anteprime usano URL oggetto: vanno revocate per non trattenere memoria.
  useEffect(() => () => foto.forEach((elemento) => URL.revokeObjectURL(elemento.url)), [foto])

  useEffect(() => {
    if (stato.tipo === 'ok') {
      impostaFoto([])
      if (campoFile.current) campoFile.current.value = ''
    }
  }, [stato.tipo])

  const aggiungiFoto = (elenco: FileList | null) => {
    if (!elenco) return
    const errori: string[] = []
    const accettate: Anteprima[] = []

    Array.from(elenco).forEach((file) => {
      if (!TIPI_FOTO.includes(file.type)) {
        errori.push(`${file.name}: formato non supportato`)
        return
      }
      if (file.size > MAX_BYTE_FOTO) {
        errori.push(`${file.name}: supera 5 MB`)
        return
      }
      accettate.push({ file, url: URL.createObjectURL(file) })
    })

    const totale = [...foto, ...accettate].slice(0, MAX_FOTO)
    if (foto.length + accettate.length > MAX_FOTO) {
      errori.push(`Puoi allegare al massimo ${MAX_FOTO} foto`)
    }

    impostaAvviso(errori.length > 0 ? errori.join(' · ') : null)
    impostaFoto(totale)
    sincronizza(totale)
  }

  /** Riallinea l'input file alle sole foto accettate. */
  const sincronizza = (elenco: Anteprima[]) => {
    if (!campoFile.current) return
    const trasferimento = new DataTransfer()
    elenco.forEach((elemento) => trasferimento.items.add(elemento.file))
    campoFile.current.files = trasferimento.files
  }

  const rimuovi = (indice: number) => {
    const rimaste = foto.filter((_, posizione) => posizione !== indice)
    URL.revokeObjectURL(foto[indice].url)
    impostaFoto(rimaste)
    sincronizza(rimaste)
  }

  return (
    <form onSubmit={invia} className="relative space-y-5">
      <Trappola />

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Nome e cognome" nome="nome" obbligatorio>
          <input id="nome" name="nome" className="campo" required autoComplete="name" maxLength={80} />
        </Campo>
        <Campo etichetta="Telefono" nome="telefono" obbligatorio>
          <input id="telefono" name="telefono" type="tel" className="campo" required autoComplete="tel" />
        </Campo>
      </div>

      <Campo etichetta="Email" nome="email" obbligatorio>
        <input id="email" name="email" type="email" className="campo" required autoComplete="email" />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Dispositivo" nome="dispositivo" obbligatorio suggerimento="Marca e modello, es. iPhone 13 Pro">
          <input id="dispositivo" name="dispositivo" className="campo" required maxLength={80} />
        </Campo>
        <Campo etichetta="Servizio richiesto" nome="servizio">
          <select ref={campoServizio} id="servizio" name="servizio" className="campo" defaultValue="">
            <option value="">Non lo so / da valutare</option>
            {servizi.map((servizio) => (
              <option key={servizio.slug} value={servizio.titolo}>
                {servizio.titolo}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo etichetta="Descrivi il problema" nome="problema" obbligatorio>
        <textarea
          id="problema"
          name="problema"
          rows={5}
          className="campo resize-y"
          required
          minLength={10}
          maxLength={1500}
          placeholder="Cosa è successo, da quando, cosa hai già provato…"
        />
      </Campo>

      <div>
        <span className="etichetta">Foto del dispositivo (facoltative, max {MAX_FOTO})</span>
        <label
          htmlFor="foto"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:var(--bordo)] px-6 py-8 text-center transition-colors hover:border-elettrico-500/60 hover:bg-elettrico-500/5"
        >
          <ImagePlus className="h-7 w-7 text-elettrico-400" aria-hidden="true" />
          <span className="text-sm font-semibold">Trascina o seleziona le foto</span>
          <span className="text-xs testo-tenue">JPG, PNG, WEBP o HEIC · fino a 5 MB ciascuna</span>
        </label>
        <input
          ref={campoFile}
          id="foto"
          name="foto"
          type="file"
          multiple
          accept={TIPI_FOTO.join(',')}
          className="sr-only"
          onChange={(evento) => aggiungiFoto(evento.target.files)}
        />

        {avviso && <p className="mt-2 text-xs text-amber-400">{avviso}</p>}

        {foto.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {foto.map((elemento, indice) => (
              <li key={elemento.url} className="relative overflow-hidden rounded-2xl border border-[color:var(--bordo)]">
                {/* Anteprima locale: non passa dall'ottimizzatore immagini. */}
                <img src={elemento.url} alt="" className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => rimuovi(indice)}
                  aria-label={`Rimuovi ${elemento.file.name}`}
                  className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white transition-colors hover:bg-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Consenso />
      <Esito stato={stato} />

      <Bottone type="submit" disabled={inCorso} dimensione="lg" className="w-full">
        <Send className={`h-4 w-4 ${inCorso ? 'animate-pulse' : ''}`} aria-hidden="true" />
        {inCorso ? 'Invio in corso…' : 'Richiedi preventivo gratuito'}
      </Bottone>
    </form>
  )
}
