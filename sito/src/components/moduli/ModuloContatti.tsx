'use client'

import { Send } from 'lucide-react'
import { Bottone } from '@/components/ui/Bottone'
import { Campo, Consenso, Esito, Trappola, useInvioModulo } from './campi'

export function ModuloContatti() {
  const { stato, invia, inCorso } = useInvioModulo('/api/contatti')

  return (
    <form onSubmit={invia} className="relative space-y-4" noValidate={false}>
      <Trappola />

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etichetta="Nome e cognome" nome="nome" obbligatorio>
          <input id="nome" name="nome" className="campo" required autoComplete="name" maxLength={80} />
        </Campo>
        <Campo etichetta="Email" nome="email" obbligatorio>
          <input id="email" name="email" type="email" className="campo" required autoComplete="email" />
        </Campo>
      </div>

      <Campo etichetta="Telefono" nome="telefono" suggerimento="Facoltativo: ti richiamiamo noi.">
        <input id="telefono" name="telefono" type="tel" className="campo" autoComplete="tel" />
      </Campo>

      <Campo etichetta="Messaggio" nome="messaggio" obbligatorio>
        <textarea
          id="messaggio"
          name="messaggio"
          rows={4}
          className="campo resize-y"
          required
          minLength={10}
          maxLength={2000}
          placeholder="Descrivi il dispositivo e il problema…"
        />
      </Campo>

      <Consenso />
      <Esito stato={stato} />

      <Bottone type="submit" disabled={inCorso} dimensione="lg" className="w-full">
        <Send className={`h-4 w-4 ${inCorso ? 'animate-pulse' : ''}`} aria-hidden="true" />
        {inCorso ? 'Invio in corso…' : 'Invia messaggio'}
      </Bottone>
    </form>
  )
}
