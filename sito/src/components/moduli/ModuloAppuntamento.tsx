'use client'

import { CalendarCheck } from 'lucide-react'
import { useState } from 'react'
import { Bottone } from '@/components/ui/Bottone'
import { servizi } from '@/lib/dati/servizi'
import { cn } from '@/lib/utils'
import { Campo, Consenso, Esito, Trappola, useInvioModulo } from './campi'

const orari = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
]

const modalita = [
  { valore: 'negozio', etichetta: 'In negozio', descrizione: 'Via Gianni Rodari 13, Tortolì' },
  { valore: 'domicilio', etichetta: 'A domicilio', descrizione: 'Tortolì e Ogliastra' },
  { valore: 'remoto', etichetta: 'Assistenza remota', descrizione: 'Collegamento sicuro' },
]

/** Data minima selezionabile: oggi. */
const oggi = () => new Date().toISOString().slice(0, 10)

export function ModuloAppuntamento() {
  const { stato, invia, inCorso } = useInvioModulo('/api/appuntamenti')
  const [scelta, impostaScelta] = useState('negozio')
  const [ora, impostaOra] = useState('')

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

      <Campo etichetta="Servizio" nome="servizio" obbligatorio>
        <select id="servizio" name="servizio" className="campo" required defaultValue="">
          <option value="" disabled>
            Scegli un servizio
          </option>
          {servizi.map((servizio) => (
            <option key={servizio.slug} value={servizio.titolo}>
              {servizio.titolo}
            </option>
          ))}
        </select>
      </Campo>

      <fieldset>
        <legend className="etichetta">Modalità</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {modalita.map((voce) => (
            <label
              key={voce.valore}
              className={cn(
                'cursor-pointer rounded-2xl border px-4 py-3.5 transition-all duration-200',
                scelta === voce.valore
                  ? 'border-elettrico-500 bg-elettrico-500/10'
                  : 'border-[color:var(--bordo)] hover:border-elettrico-500/40',
              )}
            >
              <input
                type="radio"
                name="modalita"
                value={voce.valore}
                checked={scelta === voce.valore}
                onChange={() => impostaScelta(voce.valore)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold">{voce.etichetta}</span>
              <span className="mt-0.5 block text-xs testo-tenue">{voce.descrizione}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Campo etichetta="Giorno" nome="data" obbligatorio>
        <input id="data" name="data" type="date" className="campo" required min={oggi()} />
      </Campo>

      <fieldset>
        <legend className="etichetta">
          Orario <span className="text-elettrico-400">*</span>
        </legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
          {orari.map((valore) => (
            <label
              key={valore}
              className={cn(
                'cursor-pointer rounded-xl border py-2.5 text-center text-sm font-semibold transition-all duration-200',
                ora === valore
                  ? 'border-elettrico-500 bg-elettrico-600 text-white'
                  : 'border-[color:var(--bordo)] testo-tenue hover:border-elettrico-500/40 hover:text-elettrico-400',
              )}
            >
              <input
                type="radio"
                name="ora"
                value={valore}
                required
                checked={ora === valore}
                onChange={() => impostaOra(valore)}
                className="sr-only"
              />
              {valore}
            </label>
          ))}
        </div>
      </fieldset>

      <Campo etichetta="Note" nome="note" suggerimento="Modello del dispositivo, difetto, indirizzo per il domicilio…">
        <textarea id="note" name="note" rows={3} className="campo resize-y" maxLength={1000} />
      </Campo>

      <Consenso />
      <Esito stato={stato} />

      <Bottone type="submit" disabled={inCorso} dimensione="lg" className="w-full">
        <CalendarCheck className={`h-4 w-4 ${inCorso ? 'animate-pulse' : ''}`} aria-hidden="true" />
        {inCorso ? 'Invio in corso…' : 'Prenota appuntamento'}
      </Bottone>
    </form>
  )
}
