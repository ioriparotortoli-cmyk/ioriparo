'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopiaUrl({ url }: { url: string }) {
  const [copiato, impostaCopiato] = useState(false)

  return (
    <button
      type="button"
      aria-label="Copia l’URL dell’immagine"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          impostaCopiato(true)
          setTimeout(() => impostaCopiato(false), 2000)
        } catch {
          window.prompt('Copia manualmente l’URL:', url)
        }
      }}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[color:var(--bordo)] testo-tenue transition-colors hover:border-elettrico-500/50 hover:text-elettrico-400"
    >
      {copiato ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}
