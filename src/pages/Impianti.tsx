import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, MapPin, Search, Wrench } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Form'
import { StatoVuoto } from '@/components/ui/Tabella'
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import { formatData, scadenzaRelativa } from '@/lib/format'
import { STATI_IMPIANTO } from '@/lib/stati'
import type { StatoImpianto } from '@/types'

export function Impianti() {
  useIntestazione({
    titolo: 'Impianti & Installazioni',
    sottotitolo: 'Reti, server e postazioni in manutenzione presso i clienti',
  })

  const { db, aggiornaImpianto } = useGestionale()
  const [ricerca, setRicerca] = useState('')
  const [stato, setStato] = useState<StatoImpianto | 'tutti'>('tutti')

  const filtrati = useMemo(() => {
    const termine = ricerca.trim().toLowerCase()
    return db.impianti.filter((impianto) => {
      if (stato !== 'tutti' && impianto.stato !== stato) return false
      if (!termine) return true
      const cliente = db.clienti.find((c) => c.id === impianto.clienteId)
      return [impianto.nome, impianto.tipologia, impianto.indirizzo ?? '', cliente?.nome ?? '']
        .join(' ')
        .toLowerCase()
        .includes(termine)
    })
  }, [db.impianti, db.clienti, ricerca, stato])

  return (
    <div className="space-y-4">
      <Card padding={false}>
        <div className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative sm:w-96">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
            />
            <Input
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              placeholder="Cerca impianto, cliente o indirizzo…"
              aria-label="Cerca impianto"
              className="pl-9"
            />
          </div>

          <Select
            value={stato}
            onChange={(e) => setStato(e.target.value as StatoImpianto | 'tutti')}
            aria-label="Filtra per stato"
            className="sm:w-52"
          >
            <option value="tutti">Tutti gli stati</option>
            {Object.entries(STATI_IMPIANTO).map(([valore, config]) => (
              <option key={valore} value={valore}>
                {config.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {filtrati.length === 0 ? (
        <Card>
          <StatoVuoto titolo="Nessun impianto trovato" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filtrati.map((impianto) => {
            const cliente = db.clienti.find((c) => c.id === impianto.clienteId)
            return (
              <Card key={impianto.id}>
                <CardHeader
                  titolo={impianto.nome}
                  sottotitolo={impianto.tipologia}
                  azione={
                    <Badge className={STATI_IMPIANTO[impianto.stato].badge}>
                      {STATI_IMPIANTO[impianto.stato].label}
                    </Badge>
                  }
                />

                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-start gap-2">
                    <dt className="sr-only">Cliente</dt>
                    <dd className="flex items-center gap-2 text-ink">
                      <Wrench size={14} className="text-ink-faint" />
                      {cliente ? (
                        <Link
                          to={`/clienti/${cliente.id}`}
                          className="transition-colors hover:text-blue-400"
                        >
                          {cliente.nome}
                        </Link>
                      ) : (
                        '--'
                      )}
                    </dd>
                  </div>

                  {impianto.indirizzo && (
                    <div className="flex items-start gap-2">
                      <dt className="sr-only">Indirizzo</dt>
                      <dd className="flex items-start gap-2 text-ink-muted">
                        <MapPin size={14} className="mt-0.5 shrink-0 text-ink-faint" />
                        {impianto.indirizzo}
                      </dd>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <dt className="sr-only">Manutenzione</dt>
                    <dd className="flex items-start gap-2 text-ink-muted">
                      <CalendarClock size={14} className="mt-0.5 shrink-0 text-ink-faint" />
                      {impianto.prossimaManutenzione ? (
                        <span>
                          Prossima manutenzione il {formatData(impianto.prossimaManutenzione)}
                          <span className="block text-[11px] text-ink-faint">
                            {scadenzaRelativa(impianto.prossimaManutenzione)}
                          </span>
                        </span>
                      ) : (
                        'Nessuna manutenzione programmata'
                      )}
                    </dd>
                  </div>
                </dl>

                {impianto.note && (
                  <p className="mt-3 rounded-lg border border-line bg-surface-2 p-2.5 text-xs text-ink-muted">
                    {impianto.note}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                  <span className="text-[11px] text-ink-faint">
                    Installato il {formatData(impianto.dataInstallazione)}
                  </span>
                  <Select
                    value={impianto.stato}
                    onChange={(e) =>
                      aggiornaImpianto(impianto.id, { stato: e.target.value as StatoImpianto })
                    }
                    aria-label={`Stato di ${impianto.nome}`}
                    className="h-8 w-40 text-xs"
                  >
                    {Object.entries(STATI_IMPIANTO).map(([valore, config]) => (
                      <option key={valore} value={valore}>
                        {config.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
