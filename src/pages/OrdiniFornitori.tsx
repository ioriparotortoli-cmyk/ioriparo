import { useMemo, useState } from 'react'
import { Ban, CheckCircle2, FileText, Search, Send, Truck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Form'
import { StatChip } from '@/components/ui/StatCard'
import { Modal } from '@/components/ui/Modal'
import { StatoVuoto, Tabella, TabellaHead, Td, Th, Tr } from '@/components/ui/Tabella'
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import { totaleRighe } from '@/lib/calcoli'
import { formatData, formatEuro } from '@/lib/format'
import { STATI_ORDINE } from '@/lib/stati'
import type { OrdineFornitore, StatoOrdine } from '@/types'

const ORDINE: StatoOrdine[] = ['bozza', 'inviato', 'in_transito', 'ricevuto', 'annullato']

const ICONE = {
  bozza: FileText,
  inviato: Send,
  in_transito: Truck,
  ricevuto: CheckCircle2,
  annullato: Ban,
} as const

export function OrdiniFornitori() {
  useIntestazione({
    titolo: 'Ordini Fornitori',
    sottotitolo: 'Approvvigionamento ricambi e accessori',
  })

  const { db, aggiornaOrdine, aggiornaArticolo } = useGestionale()
  const [ricerca, setRicerca] = useState('')
  const [stato, setStato] = useState<StatoOrdine | 'tutti'>('tutti')
  const [dettaglio, setDettaglio] = useState<OrdineFornitore | null>(null)

  const conteggi = useMemo(() => {
    const mappa = Object.fromEntries(ORDINE.map((s) => [s, 0])) as Record<StatoOrdine, number>
    for (const ordine of db.ordini) mappa[ordine.stato] += 1
    return mappa
  }, [db.ordini])

  const filtrati = useMemo(() => {
    const termine = ricerca.trim().toLowerCase()
    return db.ordini
      .filter((ordine) => {
        if (stato !== 'tutti' && ordine.stato !== stato) return false
        if (!termine) return true
        return [ordine.numero, ordine.fornitore, ...ordine.righe.map((r) => r.descrizione)]
          .join(' ')
          .toLowerCase()
          .includes(termine)
      })
      .sort((a, b) => b.data.localeCompare(a.data))
  }, [db.ordini, ricerca, stato])

  const inArrivo = db.ordini
    .filter((o) => o.stato === 'inviato' || o.stato === 'in_transito')
    .reduce((somma, o) => somma + totaleRighe(o.righe), 0)

  /**
   * Alla ricezione le quantità ordinate entrano in giacenza,
   * così il magazzino resta allineato senza doppi passaggi.
   */
  function registraRicezione(ordine: OrdineFornitore) {
    for (const riga of ordine.righe) {
      if (!riga.articoloId) continue
      const articolo = db.magazzino.find((a) => a.id === riga.articoloId)
      if (articolo) aggiornaArticolo(articolo.id, { quantita: articolo.quantita + riga.quantita })
    }
    aggiornaOrdine(ordine.id, { stato: 'ricevuto' })
    setDettaglio({ ...ordine, stato: 'ricevuto' })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatChip
          etichetta="Tutti gli ordini"
          valore={db.ordini.length}
          icona={Truck}
          colore="#2563eb"
          attivo={stato === 'tutti'}
          onClick={() => setStato('tutti')}
        />
        {ORDINE.map((valore) => (
          <StatChip
            key={valore}
            etichetta={STATI_ORDINE[valore].label}
            valore={conteggi[valore]}
            icona={ICONE[valore]}
            colore={STATI_ORDINE[valore].colore}
            attivo={stato === valore}
            onClick={() => setStato(valore)}
          />
        ))}
      </div>

      <Card>
        <p className="text-[10px] font-bold tracking-wider text-ink-faint uppercase">
          Merce in arrivo (ordini inviati o in transito)
        </p>
        <p className="mt-1 text-2xl font-bold text-ink">{formatEuro(inArrivo)}</p>
      </Card>

      <Card padding={false}>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="relative sm:w-96">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
            />
            <Input
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              placeholder="Cerca per numero, fornitore o articolo…"
              aria-label="Cerca ordine"
              className="pl-9"
            />
          </div>
        </div>

        {filtrati.length === 0 ? (
          <StatoVuoto titolo="Nessun ordine trovato" />
        ) : (
          <Tabella>
            <TabellaHead>
              <Th>Numero</Th>
              <Th>Fornitore</Th>
              <Th>Data</Th>
              <Th>Consegna prevista</Th>
              <Th allineamento="center">Righe</Th>
              <Th>Stato</Th>
              <Th allineamento="right">Totale</Th>
            </TabellaHead>
            <tbody>
              {filtrati.map((ordine) => (
                <Tr key={ordine.id} onClick={() => setDettaglio(ordine)}>
                  <Td className="font-medium whitespace-nowrap text-ink">{ordine.numero}</Td>
                  <Td className="text-[13px]">{ordine.fornitore}</Td>
                  <Td className="whitespace-nowrap">{formatData(ordine.data)}</Td>
                  <Td className="whitespace-nowrap">{formatData(ordine.consegnaPrevista)}</Td>
                  <Td allineamento="center">{ordine.righe.length}</Td>
                  <Td>
                    <Badge className={STATI_ORDINE[ordine.stato].badge}>
                      {STATI_ORDINE[ordine.stato].label}
                    </Badge>
                  </Td>
                  <Td allineamento="right" className="font-semibold text-ink">
                    {formatEuro(totaleRighe(ordine.righe))}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Tabella>
        )}
      </Card>

      <Modal
        aperta={dettaglio !== null}
        titolo={dettaglio ? `Ordine ${dettaglio.numero}` : ''}
        sottotitolo={dettaglio?.fornitore}
        onChiudi={() => setDettaglio(null)}
        piede={
          dettaglio && (
            <>
              <Select
                value={dettaglio.stato}
                onChange={(e) => {
                  const nuovo = e.target.value as StatoOrdine
                  if (nuovo === 'ricevuto' && dettaglio.stato !== 'ricevuto') {
                    registraRicezione(dettaglio)
                    return
                  }
                  aggiornaOrdine(dettaglio.id, { stato: nuovo })
                  setDettaglio({ ...dettaglio, stato: nuovo })
                }}
                aria-label="Cambia stato ordine"
                className="mr-auto w-44"
              >
                {ORDINE.map((valore) => (
                  <option key={valore} value={valore}>
                    {STATI_ORDINE[valore].label}
                  </option>
                ))}
              </Select>
              <Button onClick={() => setDettaglio(null)}>Chiudi</Button>
            </>
          )
        }
      >
        {dettaglio && (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-ink-faint">Data ordine</dt>
                <dd className="text-ink">{formatData(dettaglio.data)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Consegna prevista</dt>
                <dd className="text-ink">{formatData(dettaglio.consegnaPrevista)}</dd>
              </div>
            </dl>

            <Tabella className="min-w-0">
              <TabellaHead>
                <Th>Articolo</Th>
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

            <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-ink">
              <span>Totale ordine</span>
              <span>{formatEuro(totaleRighe(dettaglio.righe))}</span>
            </div>

            {dettaglio.stato !== 'ricevuto' && (
              <p className="rounded-lg border border-blue-500/25 bg-blue-500/8 p-3 text-xs text-ink-muted">
                Impostando l'ordine su «Ricevuto» le quantità vengono caricate automaticamente in
                magazzino.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
