import { useEffect, useRef, useState, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { Download, Printer, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CSS_STAMPA } from '@/lib/stampa/stiliStampa'

/** Vero quando l'app gira dentro un iframe, dove la stampa può essere vietata. */
function incorporata(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

/**
 * Rende il documento in un nodo scollegato e ne estrae l'HTML.
 * Si usa il renderer del client, già presente nel bundle, invece di
 * `react-dom/server` che peserebbe qualche centinaio di kilobyte in più.
 * Il commit di una radice concorrente è asincrono e può slittare di più tick
 * quando il thread è occupato: si attende finché il nodo non è popolato.
 */
async function markupDi(documento: ReactElement): Promise<string> {
  const contenitore = document.createElement('div')
  const radice = createRoot(contenitore)
  radice.render(documento)

  for (let tentativo = 0; tentativo < 60 && !contenitore.firstChild; tentativo++) {
    await new Promise((risolvi) => setTimeout(risolvi, 16))
  }

  const markup = contenitore.innerHTML
  radice.unmount()
  return markup
}

/** Racchiude il documento in una pagina HTML autonoma e stampabile. */
export async function paginaStampabile(
  titolo: string,
  documento: ReactElement,
): Promise<string> {
  const markup = await markupDi(documento)
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titolo}</title>
<style>${CSS_STAMPA}</style>
</head>
<body>
${markup}
<div class="doc-barra">
  <span>Usa il pulsante per stampare o salvare in PDF.</span>
  <button type="button" onclick="window.print()">Stampa</button>
</div>
</body>
</html>`
}

/**
 * Anteprima di stampa: il documento vive in un iframe isolato, così la stampa
 * riguarda solo il foglio e non l'interfaccia dell'applicazione.
 * Se il browser blocca la finestra di stampa (tipico nelle anteprime incorporate)
 * resta disponibile il download del documento come file HTML.
 */
export function AnteprimaStampa({
  aperta,
  titolo,
  nomeFile,
  documento,
  onChiudi,
}: {
  aperta: boolean
  titolo: string
  nomeFile: string
  documento: ReactElement | null
  onChiudi: () => void
}) {
  const quadroRef = useRef<HTMLIFrameElement>(null)
  const [bloccata, setBloccata] = useState(false)
  const [html, setHtml] = useState('')

  // La prop `documento` è un elemento nuovo a ogni render del chiamante:
  // si legge da un riferimento e si rigenera solo all'apertura dell'anteprima.
  const documentoRef = useRef(documento)
  documentoRef.current = documento

  useEffect(() => {
    if (!aperta || !documentoRef.current) {
      setHtml('')
      return
    }
    let valido = true
    void paginaStampabile(titolo, documentoRef.current).then((pagina) => {
      if (valido) setHtml(pagina)
    })
    return () => {
      valido = false
    }
  }, [aperta, titolo])

  useEffect(() => {
    if (!aperta) return
    setBloccata(false)
    const onTasto = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChiudi()
    }
    document.addEventListener('keydown', onTasto)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onTasto)
      document.body.style.overflow = ''
    }
  }, [aperta, onChiudi])

  if (!aperta || !documento || !html) return null

  function stampa() {
    const finestra = quadroRef.current?.contentWindow
    if (!finestra) {
      setBloccata(true)
      return
    }

    // Nei contesti incorporati il browser ignora `print()` senza sollevare
    // errori: si considera riuscita solo se scatta l'evento `beforeprint`.
    let avviata = false
    let fallita = false
    const segnalaAvvio = () => {
      avviata = true
    }
    finestra.addEventListener('beforeprint', segnalaAvvio)

    try {
      finestra.focus()
      finestra.print()
    } catch {
      fallita = true
    }

    window.setTimeout(() => {
      finestra.removeEventListener('beforeprint', segnalaAvvio)
      // Fuori da un iframe si dà per riuscita: non tutti i browser espongono
      // `beforeprint`, e un avviso a sproposito confonderebbe.
      setBloccata(fallita || (!avviata && incorporata()))
    }, 500)
  }

  function scarica() {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = nomeFile
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-ink">Anteprima di stampa</h2>
          <p className="truncate text-xs text-ink-faint">{titolo}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={scarica}>
            <Download size={15} />
            Scarica documento
          </Button>
          <Button variante="primario" onClick={stampa}>
            <Printer size={15} />
            Stampa
          </Button>
          <Button variante="fantasma" onClick={onChiudi} aria-label="Chiudi anteprima">
            <X size={18} />
          </Button>
        </div>
      </header>

      {bloccata && (
        <p className="shrink-0 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
          Il browser ha bloccato la finestra di stampa in questa anteprima incorporata. Scarica il
          documento con il pulsante qui sopra e stampalo dal file: il risultato è identico.
        </p>
      )}

      <div className="flex-1 overflow-auto bg-[#525659] p-3 sm:p-6">
        <iframe
          ref={quadroRef}
          title={`Anteprima di stampa — ${titolo}`}
          srcDoc={html}
          className="mx-auto block h-full min-h-[70vh] w-full max-w-[210mm] rounded-sm bg-white shadow-2xl"
        />
      </div>
    </div>
  )
}
