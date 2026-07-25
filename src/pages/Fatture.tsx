import { useMemo, useState } from 'react'
import { AlertTriangle, Ban, CheckCircle2, Download, Receipt, Search } from 'lucide-react'
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
import { imponibile, scorporoIva, totaleFattura } from '@/lib/calcoli'
import { formatData, formatEuro, oggiISO } from '@/lib/format'
import { STATI_FATTURA } from '@/lib/stati'
import type { Fattura, MetodoPagamento, StatoFattura } from '@/types'

const ORDINE: StatoFattura[] = ['emessa', 'pagata', 'scaduta', 'annullata']

const ICONE = {
  emessa: Receipt,
  pagata: CheckCircle2,
  scaduta: AlertTriangle,
  annullata: Ban,
} as const

const METODI: Array<{ valore: MetodoPagamento; label: string }> = [
  { valore: 'contanti', label: 'Contanti' },
  { valore: 'carta', label: 'Carta' },
  { valore: 'bonifico', label: 'Bonifico' },
  { valore: 'satispay', label: 'Satispay' },
  { valore: 'altro', label: 'Altro' },
]

export function Fatture() {
  useIntestazione({
    titolo: 'Fatture',
    sottotitolo: 'Documenti emessi e stato degli incassi',
  })

  const { db, aggiornaFattura } = useGestionale()

  const [ricerca, setRicerca] = useState('')
  const [stato, setStato] = useState<StatoFattura | 'tutti'>('tutti')
  const [mese, setMese] = useState('')
  const [dettaglio, setDettaglio] = useState<Fattura | null>(null)
  const [daStampare, setDaStampare] = useState<Fattura | null>(null)

  const conteggi = useMemo(() => {
    const mappa = Object.fromEntries(ORDINE.map((s) => [s, 0])) as Record<StatoFattura, number>
    for (const fattura of db.fatture) mappa[fattura.stato] += 1
    return mappa
  }, [db.fatture])

  const filtrate = useMemo(() => {
    const termine = ricerca.trim().toLowerCase()
    return db.fatture.filter((fattura) => {
      if (stato !== 'tutti' && fattura.stato !== stato) return false
      if (mese && !fattura.data.startsWith(mese)) return false
      if (!termine) return true
      const cliente = db.clienti.find((c) => c.id === fattura.clienteId)
      return [fattura.numero, cliente?.nome ?? '', ...fattura.righe.map((r) => r.descrizione)]
        .join(' ')
        .toLowerCase()
        .includes(termine)
    })
  }, [db.fatture, db.clienti, ricerca, stato, mese])

  const elenco = useElenco(filtrate, {
    perPaginaIniziale: 10,
    ordinamentoIniziale: { campo: 'data', direzione: 'desc' },
  })

  const daIncassare = filtrate
    .filter((f) => f.stato === 'emessa' || f.stato === 'scaduta')
    .reduce((somma, f) => somma + totaleFattura(f), 0)

  const incassato = filtrate
    .filter((f) => f.stato === 'pagata')
    .reduce((somma, f) => somma + totaleFattura(f), 0)

  function esporta() {
    esportaCsv(
      nomeFileConData('fatture', 'csv'),
      ['Numero', 'Cliente', 'Data', 'Scadenza', 'Stato', 'Metodo', 'Imponibile', 'IVA', 'Totale'],
      filtrate.map((f) => {
        const totale = totaleFattura(f)
        return [
          f.numero,
          db.clienti.find((c) => c.id === f.clienteId)?.nome,
          formatData(f.data),
          formatData(f.scadenza),
          STATI_FATTURA[f.stato].label,
          f.metodoPagamento,
          imponibile(totale, f.iva).toFixed(2),
          scorporoIva(totale, f.iva).toFixed(2),
          totale.toFixed(2),
        ]
      }),
    )
  }

  function segnaPagata(fattura: Fattura, metodo: MetodoPagamento) {
    aggiornaFattura(fattura.id, {
      stato: 'pagata',
      metodoPagamento: metodo,
      dataPagamento: oggiISO(),
    })
    setDettaglio({ ...fattura, stato: 'pagata', metodoPagamento: metodo, dataPagamento: oggiISO() })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-[10px] font-bold tracking-wider text-ink-faint uppercase">
            Documenti nel filtro
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">{filtrate.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] font-bold tracking-wider text-ink-faint uppercase">Incassato</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{formatEuro(incassato)}</p>
        </Card>
        <Card>
          <p className="text-[10px] font-bold tracking-wider text-ink-faint uppercase">
            Da incassare
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-400">{formatEuro(daIncassare)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <StatChip
          etichetta="Tutte"
          valore={db.fatture.length}
          icona={Receipt}
          colore="#2563eb"
          attivo={stato === 'tutti'}
          onClick={() => setStato('tutti')}
        />
        {ORDINE.map((valore) => (
          <StatChip
            key={valore}
            etichetta={STATI_FATTURA[valore].label}
            valore={conteggi[valore]}
            icona={ICONE[valore]}
            colore={STATI_FATTURA[valore].colore}
            attivo={stato === valore}
            onClick={() => setStato(valore)}
          />
        ))}
      </div>

      <Card padding={false}>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="relative sm:w-80">
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
              placeholder="Cerca per numero o cliente…"
              aria-label="Cerca fattura"
              className="pl-9"
            />
          </div>

          <Input
            type="month"
            value={mese}
            onChange={(e) => {
              setMese(e.target.value)
              elenco.azzeraPagina()
            }}
            aria-label="Filtra per mese"
            className="sm:w-48"
          />

          <Button onClick={esporta} className="sm:ml-auto">
            <Download size={15} />
            Esporta
          </Button>
        </div>

        {elenco.totale === 0 ? (
          <StatoVuoto titolo="Nessuna fattura trovata" />
        ) : (
          <>
            <Tabella>
              <TabellaHead>
                <Th>Numero</Th>
                <Th>Cliente</Th>
                <Th>Data</Th>
                <Th>Scadenza</Th>
                <Th>Stato</Th>
                <Th>Pagamento</Th>
                <Th allineamento="right">Totale</Th>
              </TabellaHead>
              <tbody>
                {elenco.visibili.map((fattura) => (
                  <Tr key={fattura.id} onClick={() => setDettaglio(fattura)}>
                    <Td className="font-medium whitespace-nowrap text-ink">{fattura.numero}</Td>
                    <Td className="text-[13px]">
                      {db.clienti.find((c) => c.id === fattura.clienteId)?.nome ?? '--'}
                    </Td>
                    <Td className="whitespace-nowrap">{formatData(fattura.data)}</Td>
                    <Td className="whitespace-nowrap">{formatData(fattura.scadenza)}</Td>
                    <Td>
                      <Badge className={STATI_FATTURA[fattura.stato].badge}>
                        {STATI_FATTURA[fattura.stato].label}
                      </Badge>
                    </Td>
                    <Td className="text-[13px] capitalize">{fattura.metodoPagamento ?? '--'}</Td>
                    <Td allineamento="right" className="font-semibold text-ink">
                      {formatEuro(totaleFattura(fattura))}
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
              etichettaElementi="fatture"
              onCambiaPagina={elenco.vaiAPagina}
              onCambiaPerPagina={elenco.cambiaPerPagina}
            />
          </>
        )}
      </Card>

      <Modal
        aperta={dettaglio !== null}
        titolo={dettaglio ? `Fattura ${dettaglio.numero}` : ''}
        sottotitolo={
          dettaglio ? db.clienti.find((c) => c.id === dettaglio.clienteId)?.nome : undefined
        }
        onChiudi={() => setDettaglio(null)}
        piede={
          dettaglio && (
            <>
              {dettaglio.stato !== 'pagata' && (
                <Select
                  defaultValue=""
                  onChange={(e) =>
                    e.target.value && segnaPagata(dettaglio, e.target.value as MetodoPagamento)
                  }
                  aria-label="Registra incasso"
                  className="mr-auto w-52"
                >
                  <option value="">Registra incasso…</option>
                  {METODI.map((metodo) => (
                    <option key={metodo.valore} value={metodo.valore}>
                      {metodo.label}
                    </option>
                  ))}
                </Select>
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
                <dt className="text-xs text-ink-faint">Data emissione</dt>
                <dd className="text-ink">{formatData(dettaglio.data)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Scadenza</dt>
                <dd className="text-ink">{formatData(dettaglio.scadenza)}</dd>
              </div>
              {dettaglio.dataPagamento && (
                <div>
                  <dt className="text-xs text-ink-faint">Incassata il</dt>
                  <dd className="text-emerald-400">{formatData(dettaglio.dataPagamento)}</dd>
                </div>
              )}
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
                <dd>{formatEuro(imponibile(totaleFattura(dettaglio), dettaglio.iva))}</dd>
              </div>
              <div className="flex justify-between text-ink-muted">
                <dt>IVA {dettaglio.iva}%</dt>
                <dd>{formatEuro(scorporoIva(totaleFattura(dettaglio), dettaglio.iva))}</dd>
              </div>
              <div className="flex justify-between text-base font-bold text-ink">
                <dt>Totale documento</dt>
                <dd>{formatEuro(totaleFattura(dettaglio))}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <AnteprimaStampa
        aperta={daStampare !== null}
        titolo={daStampare ? `Fattura ${daStampare.numero}` : ''}
        nomeFile={`fattura-${daStampare?.numero.replace(/[^\w-]/g, '') ?? ''}.html`}
        documento={
          daStampare && (
            <DocumentoCommerciale
              azienda={db.azienda}
              cliente={db.clienti.find((c) => c.id === daStampare.clienteId)}
              documento={daStampare}
              tipo="fattura"
              statoLabel={STATI_FATTURA[daStampare.stato].label}
            />
          )
        }
        onChiudi={() => setDaStampare(null)}
      />
    </div>
  )
}
