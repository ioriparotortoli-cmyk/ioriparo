import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Send,
  ThumbsDown,
  Search,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Form'
import { StatChip } from '@/components/ui/StatCard'
import { Modal } from '@/components/ui/Modal'
import {
  Paginazione,
  StatoVuoto,
  Tabella,
  TabellaHead,
  Td,
  Th,
  Tr,
} from '@/components/ui/Tabella'
import { AnteprimaStampa } from '@/components/stampa/AnteprimaStampa'
import { DocumentoCommerciale } from '@/components/stampa/DocumentoCommerciale'
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import { useElenco } from '@/lib/useElenco'
import { esportaCsv, nomeFileConData } from '@/lib/esporta'
import { imponibile, scorporoIva, totalePreventivo } from '@/lib/calcoli'
import { formatData, formatEuro } from '@/lib/format'
import { STATI_PREVENTIVO } from '@/lib/stati'
import type { Preventivo, StatoPreventivo } from '@/types'

const ORDINE: StatoPreventivo[] = ['bozza', 'inviato', 'accettato', 'rifiutato', 'scaduto']

const ICONE = {
  bozza: FileText,
  inviato: Send,
  accettato: CheckCircle2,
  rifiutato: ThumbsDown,
  scaduto: Clock,
} as const

export function Preventivi() {
  useIntestazione({
    titolo: 'Preventivi',
    sottotitolo: 'Proposte di intervento inviate ai clienti',
  })

  const { db, aggiornaPreventivo } = useGestionale()
  const navigate = useNavigate()

  const [ricerca, setRicerca] = useState('')
  const [stato, setStato] = useState<StatoPreventivo | 'tutti'>('tutti')
  const [dettaglio, setDettaglio] = useState<Preventivo | null>(null)
  const [daStampare, setDaStampare] = useState<Preventivo | null>(null)

  const conteggi = useMemo(() => {
    const mappa = Object.fromEntries(ORDINE.map((s) => [s, 0])) as Record<StatoPreventivo, number>
    for (const preventivo of db.preventivi) mappa[preventivo.stato] += 1
    return mappa
  }, [db.preventivi])

  const filtrati = useMemo(() => {
    const termine = ricerca.trim().toLowerCase()
    return db.preventivi.filter((preventivo) => {
      if (stato !== 'tutti' && preventivo.stato !== stato) return false
      if (!termine) return true
      const cliente = db.clienti.find((c) => c.id === preventivo.clienteId)
      return [preventivo.numero, cliente?.nome ?? '', ...preventivo.righe.map((r) => r.descrizione)]
        .join(' ')
        .toLowerCase()
        .includes(termine)
    })
  }, [db.preventivi, db.clienti, ricerca, stato])

  const elenco = useElenco(filtrati, {
    perPaginaIniziale: 10,
    ordinamentoIniziale: { campo: 'data', direzione: 'desc' },
  })

  const valoreInviati = db.preventivi
    .filter((p) => p.stato === 'inviato')
    .reduce((somma, p) => somma + totalePreventivo(p), 0)

  function esporta() {
    esportaCsv(
      nomeFileConData('preventivi', 'csv'),
      ['Numero', 'Cliente', 'Data', 'Valido fino', 'Stato', 'Totale'],
      filtrati.map((p) => [
        p.numero,
        db.clienti.find((c) => c.id === p.clienteId)?.nome,
        formatData(p.data),
        formatData(p.validoFino),
        STATI_PREVENTIVO[p.stato].label,
        totalePreventivo(p).toFixed(2),
      ]),
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-muted">
          Valore dei preventivi in attesa di risposta:{' '}
          <span className="font-semibold text-ink">{formatEuro(valoreInviati)}</span>
        </p>
        <Button onClick={esporta}>
          <Download size={15} />
          Esporta
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatChip
          etichetta="Tutti"
          valore={db.preventivi.length}
          icona={FileText}
          colore="#2563eb"
          attivo={stato === 'tutti'}
          onClick={() => setStato('tutti')}
        />
        {ORDINE.map((valore) => (
          <StatChip
            key={valore}
            etichetta={STATI_PREVENTIVO[valore].label}
            valore={conteggi[valore]}
            icona={ICONE[valore]}
            colore={STATI_PREVENTIVO[valore].colore}
            attivo={stato === valore}
            onClick={() => setStato(valore)}
          />
        ))}
      </div>

      <Card padding={false}>
        <div className="border-b border-line p-4">
          <div className="relative sm:w-96">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
            />
            <Input
              value={ricerca}
              onChange={(e) => {
                setRicerca(e.target.value)
                elenco.azzeraPagina()
              }}
              placeholder="Cerca per numero, cliente o descrizione…"
              aria-label="Cerca preventivo"
              className="pl-9"
            />
          </div>
        </div>

        {elenco.totale === 0 ? (
          <StatoVuoto titolo="Nessun preventivo trovato" />
        ) : (
          <>
            <Tabella>
              <TabellaHead>
                <Th>Numero</Th>
                <Th>Cliente</Th>
                <Th>Oggetto</Th>
                <Th>Data</Th>
                <Th>Valido fino</Th>
                <Th>Stato</Th>
                <Th allineamento="right">Totale</Th>
              </TabellaHead>
              <tbody>
                {elenco.visibili.map((preventivo) => (
                  <Tr key={preventivo.id} onClick={() => setDettaglio(preventivo)}>
                    <Td className="font-medium whitespace-nowrap text-ink">{preventivo.numero}</Td>
                    <Td className="text-[13px]">
                      {db.clienti.find((c) => c.id === preventivo.clienteId)?.nome ?? '--'}
                    </Td>
                    <Td className="max-w-[260px] truncate text-[13px]">
                      {preventivo.righe.map((r) => r.descrizione).join(', ')}
                    </Td>
                    <Td className="whitespace-nowrap">{formatData(preventivo.data)}</Td>
                    <Td className="whitespace-nowrap">{formatData(preventivo.validoFino)}</Td>
                    <Td>
                      <Badge className={STATI_PREVENTIVO[preventivo.stato].badge}>
                        {STATI_PREVENTIVO[preventivo.stato].label}
                      </Badge>
                    </Td>
                    <Td allineamento="right" className="font-semibold text-ink">
                      {formatEuro(totalePreventivo(preventivo))}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Tabella>

            <Paginazione
              pagina={elenco.pagina}
              pagine={elenco.pagine}
              totale={elenco.totale}
              primoElemento={elenco.primoElemento}
              ultimoElemento={elenco.ultimoElemento}
              perPagina={elenco.perPagina}
              etichettaElementi="preventivi"
              onCambiaPagina={elenco.vaiAPagina}
              onCambiaPerPagina={elenco.cambiaPerPagina}
            />
          </>
        )}
      </Card>

      <Modal
        aperta={dettaglio !== null}
        titolo={dettaglio ? `Preventivo ${dettaglio.numero}` : ''}
        sottotitolo={
          dettaglio
            ? db.clienti.find((c) => c.id === dettaglio.clienteId)?.nome
            : undefined
        }
        onChiudi={() => setDettaglio(null)}
        piede={
          dettaglio && (
            <>
              <Select
                value={dettaglio.stato}
                onChange={(e) => {
                  const nuovo = e.target.value as StatoPreventivo
                  aggiornaPreventivo(dettaglio.id, { stato: nuovo })
                  setDettaglio({ ...dettaglio, stato: nuovo })
                }}
                aria-label="Cambia stato preventivo"
                className="mr-auto w-44"
              >
                {ORDINE.map((valore) => (
                  <option key={valore} value={valore}>
                    {STATI_PREVENTIVO[valore].label}
                  </option>
                ))}
              </Select>
              {dettaglio.riparazioneId && (
                <Button onClick={() => navigate(`/gestionale/riparazioni/${dettaglio.riparazioneId}`)}>
                  Apri riparazione
                </Button>
              )}
              <Button variante="primario" onClick={() => setDaStampare(dettaglio)}>
                Stampa
              </Button>
            </>
          )
        }
      >
        {dettaglio && (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-ink-faint">Data</dt>
                <dd className="text-ink">{formatData(dettaglio.data)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Valido fino al</dt>
                <dd className="text-ink">{formatData(dettaglio.validoFino)}</dd>
              </div>
            </dl>

            <Tabella className="min-w-0">
              <TabellaHead>
                <Th>Descrizione</Th>
                <Th allineamento="center">Q.tà</Th>
                <Th allineamento="right">Prezzo</Th>
                <Th allineamento="right">Totale</Th>
              </TabellaHead>
              <tbody>
                {dettaglio.righe.map((riga) => (
                  <Tr key={riga.id}>
                    <Td className="text-[13px] text-ink">{riga.descrizione}</Td>
                    <Td allineamento="center">{riga.quantita}</Td>
                    <Td allineamento="right">{formatEuro(riga.prezzoUnitario)}</Td>
                    <Td allineamento="right" className="font-semibold text-ink">
                      {formatEuro(riga.quantita * riga.prezzoUnitario)}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Tabella>

            <dl className="space-y-1.5 border-t border-line pt-3 text-sm">
              <div className="flex justify-between text-ink-muted">
                <dt>Imponibile</dt>
                <dd>{formatEuro(imponibile(totalePreventivo(dettaglio), dettaglio.iva))}</dd>
              </div>
              <div className="flex justify-between text-ink-muted">
                <dt>IVA {dettaglio.iva}%</dt>
                <dd>{formatEuro(scorporoIva(totalePreventivo(dettaglio), dettaglio.iva))}</dd>
              </div>
              <div className="flex justify-between text-base font-bold text-ink">
                <dt>Totale</dt>
                <dd>{formatEuro(totalePreventivo(dettaglio))}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <AnteprimaStampa
        aperta={daStampare !== null}
        titolo={daStampare ? `Preventivo ${daStampare.numero}` : ''}
        nomeFile={`preventivo-${daStampare?.numero.replace(/[^\w-]/g, '') ?? ''}.html`}
        documento={
          daStampare && (
            <DocumentoCommerciale
              azienda={db.azienda}
              cliente={db.clienti.find((c) => c.id === daStampare.clienteId)}
              documento={daStampare}
              tipo="preventivo"
              statoLabel={STATI_PREVENTIVO[daStampare.stato].label}
            />
          )
        }
        onChiudi={() => setDaStampare(null)}
      />
    </div>
  )
}
