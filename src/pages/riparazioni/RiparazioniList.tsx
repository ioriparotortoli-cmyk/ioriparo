import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowDownUp,
  Boxes,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Package,
  Pencil,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Wrench,
  XCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { BadgeStato } from '@/components/ui/Badge'
import { Button, IconButton, LinkButton } from '@/components/ui/Button'
import { Input, InputData, Select } from '@/components/ui/Form'
import { StatChip } from '@/components/ui/StatCard'
import { DeviceIcon } from '@/components/ui/DeviceIcon'
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
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import { contaPerStato } from '@/data/metriche'
import { useElenco } from '@/lib/useElenco'
import { esportaCsv, nomeFileConData } from '@/lib/esporta'
import { formatData } from '@/lib/format'
import { ORDINE_STATI, STATI_RIPARAZIONE, TIPI_DISPOSITIVO } from '@/lib/stati'
import type { Riparazione, StatoRiparazione, TipoDispositivo } from '@/types'

const ICONE_STATO = {
  in_attesa: Clock,
  preventivo_inviato: FileText,
  in_lavorazione: Wrench,
  pronto_per_ritiro: CheckCircle2,
  consegnato: Package,
  non_riparabile: XCircle,
} as const

export function RiparazioniList() {
  useIntestazione({
    titolo: 'Dispositivi / Riparazioni',
    sottotitolo: 'Gestisci tutti i dispositivi e lo stato delle riparazioni',
  })

  const { db, eliminaRiparazione } = useGestionale()
  const navigate = useNavigate()
  const [parametri, setParametri] = useSearchParams()

  const statoAttivo = (parametri.get('stato') ?? 'tutti') as StatoRiparazione | 'tutti'
  const [ricerca, setRicerca] = useState('')
  const [tipo, setTipo] = useState<TipoDispositivo | 'tutti'>('tutti')
  const [dataDa, setDataDa] = useState('')
  const [dataA, setDataA] = useState('')
  const [filtriAvanzati, setFiltriAvanzati] = useState(false)
  const [tecnico, setTecnico] = useState('tutti')
  const [daEliminare, setDaEliminare] = useState<Riparazione | null>(null)

  const conteggi = useMemo(() => contaPerStato(db), [db])

  const tecnici = useMemo(
    () => [...new Set(db.riparazioni.map((r) => r.tecnico).filter(Boolean))] as string[],
    [db.riparazioni],
  )

  const filtrate = useMemo(() => {
    const termine = ricerca.trim().toLowerCase()

    return db.riparazioni.filter((riparazione) => {
      if (statoAttivo !== 'tutti' && riparazione.stato !== statoAttivo) return false
      if (tipo !== 'tutti' && riparazione.tipoDispositivo !== tipo) return false
      if (tecnico !== 'tutti' && riparazione.tecnico !== tecnico) return false
      if (dataDa && riparazione.dataAccettazione < dataDa) return false
      if (dataA && riparazione.dataAccettazione > dataA) return false

      if (termine) {
        const cliente = db.clienti.find((c) => c.id === riparazione.clienteId)
        const testo = [
          riparazione.codice,
          riparazione.marca,
          riparazione.modello,
          riparazione.imei ?? '',
          riparazione.difettoSegnalato,
          cliente?.nome ?? '',
          cliente?.telefono ?? '',
        ]
          .join(' ')
          .toLowerCase()
        if (!testo.includes(termine)) return false
      }

      return true
    })
  }, [db.riparazioni, db.clienti, statoAttivo, tipo, tecnico, dataDa, dataA, ricerca])

  const elenco = useElenco(filtrate, {
    perPaginaIniziale: 10,
    ordinamentoIniziale: { campo: 'dataAccettazione', direzione: 'desc' },
  })

  function cambiaStato(stato: StatoRiparazione | 'tutti') {
    const nuovi = new URLSearchParams(parametri)
    if (stato === 'tutti') nuovi.delete('stato')
    else nuovi.set('stato', stato)
    setParametri(nuovi, { replace: true })
    elenco.azzeraPagina()
  }

  function esporta() {
    esportaCsv(
      nomeFileConData('riparazioni', 'csv'),
      [
        'ID',
        'Dispositivo',
        'Tipo',
        'IMEI / Seriale',
        'Cliente',
        'Telefono',
        'Difetto segnalato',
        'Stato',
        'Data accettazione',
        'Consegna prevista',
        'Tecnico',
      ],
      filtrate.map((r) => {
        const cliente = db.clienti.find((c) => c.id === r.clienteId)
        return [
          r.codice,
          `${r.marca} ${r.modello}`,
          TIPI_DISPOSITIVO[r.tipoDispositivo],
          r.imei,
          cliente?.nome,
          cliente?.telefono,
          r.difettoSegnalato,
          STATI_RIPARAZIONE[r.stato].label,
          formatData(r.dataAccettazione),
          formatData(r.consegnaPrevista),
          r.tecnico,
        ]
      }),
    )
  }

  const filtriAttivi =
    ricerca || tipo !== 'tutti' || dataDa || dataA || tecnico !== 'tutti' || statoAttivo !== 'tutti'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button onClick={esporta} dimensione="md">
          <Download size={15} />
          Esporta
        </Button>
        <LinkButton to="/riparazioni/nuova" variante="primario">
          <Plus size={16} />
          Nuova riparazione
        </LinkButton>
      </div>

      {/* Riepilogo per stato, cliccabile come filtro */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
        <StatChip
          etichetta="Tutti"
          valore={db.riparazioni.length}
          unita="dispositivi"
          icona={Boxes}
          colore="#2563eb"
          attivo={statoAttivo === 'tutti'}
          onClick={() => cambiaStato('tutti')}
        />
        {ORDINE_STATI.map((stato) => (
          <StatChip
            key={stato}
            etichetta={STATI_RIPARAZIONE[stato].label}
            valore={conteggi[stato]}
            unita="dispositivi"
            icona={ICONE_STATO[stato]}
            colore={STATI_RIPARAZIONE[stato].colore}
            attivo={statoAttivo === stato}
            onClick={() => cambiaStato(stato)}
          />
        ))}
      </div>

      <Card padding={false}>
        {/* Barra filtri */}
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-72">
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
              placeholder="Cerca…"
              aria-label="Cerca riparazione"
              className="pl-9"
            />
          </div>

          <Select
            value={statoAttivo}
            onChange={(e) => cambiaStato(e.target.value as StatoRiparazione | 'tutti')}
            aria-label="Filtra per stato"
            className="lg:w-48"
          >
            <option value="tutti">Tutti gli stati</option>
            {ORDINE_STATI.map((stato) => (
              <option key={stato} value={stato}>
                {STATI_RIPARAZIONE[stato].label}
              </option>
            ))}
          </Select>

          <Select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value as TipoDispositivo | 'tutti')
              elenco.azzeraPagina()
            }}
            aria-label="Filtra per tipo di dispositivo"
            className="lg:w-44"
          >
            <option value="tutti">Tutti i tipi</option>
            {Object.entries(TIPI_DISPOSITIVO).map(([valore, label]) => (
              <option key={valore} value={valore}>
                {label}
              </option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <InputData
              value={dataDa}
              onChange={(e) => {
                setDataDa(e.target.value)
                elenco.azzeraPagina()
              }}
              placeholder="Data da"
              aria-label="Data accettazione da"
              className="lg:w-40"
            />
            <span className="text-ink-faint">→</span>
            <InputData
              value={dataA}
              onChange={(e) => {
                setDataA(e.target.value)
                elenco.azzeraPagina()
              }}
              placeholder="Data a"
              aria-label="Data accettazione a"
              className="lg:w-40"
            />
          </div>

          <Button
            onClick={() => setFiltriAvanzati((aperto) => !aperto)}
            className="lg:ml-auto"
            variante={filtriAvanzati ? 'primario' : 'secondario'}
          >
            <SlidersHorizontal size={15} />
            Filtri
          </Button>
        </div>

        {filtriAvanzati && (
          <div className="flex flex-wrap items-end gap-3 border-b border-line bg-surface-2/40 p-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-ink-muted">Tecnico</span>
              <Select
                value={tecnico}
                onChange={(e) => {
                  setTecnico(e.target.value)
                  elenco.azzeraPagina()
                }}
                className="w-48"
              >
                <option value="tutti">Tutti i tecnici</option>
                {tecnici.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </Select>
            </label>

            {filtriAttivi && (
              <Button
                variante="fantasma"
                onClick={() => {
                  setRicerca('')
                  setTipo('tutti')
                  setDataDa('')
                  setDataA('')
                  setTecnico('tutti')
                  cambiaStato('tutti')
                }}
              >
                Azzera filtri
              </Button>
            )}
          </div>
        )}

        {elenco.totale === 0 ? (
          <StatoVuoto
            titolo="Nessun dispositivo trovato"
            descrizione="Modifica i filtri di ricerca oppure registra una nuova accettazione."
            azione={
              <LinkButton to="/riparazioni/nuova" variante="primario" dimensione="sm">
                <Plus size={14} />
                Nuova riparazione
              </LinkButton>
            }
          />
        ) : (
          <>
            <Tabella className="min-w-[1000px]">
              <TabellaHead>
                <Th>ID</Th>
                <Th>Dispositivo</Th>
                <Th>
                  <button
                    type="button"
                    onClick={() => elenco.ordinaPer('clienteId')}
                    className="inline-flex items-center gap-1 uppercase hover:text-ink-muted"
                  >
                    Cliente
                    <ArrowDownUp size={11} />
                  </button>
                </Th>
                <Th>Difetto segnalato</Th>
                <Th>
                  <button
                    type="button"
                    onClick={() => elenco.ordinaPer('stato')}
                    className="inline-flex items-center gap-1 uppercase hover:text-ink-muted"
                  >
                    Stato
                    <ArrowDownUp size={11} />
                  </button>
                </Th>
                <Th>
                  <button
                    type="button"
                    onClick={() => elenco.ordinaPer('dataAccettazione')}
                    className="inline-flex items-center gap-1 uppercase hover:text-ink-muted"
                  >
                    Accettazione
                    <ArrowDownUp size={11} />
                  </button>
                </Th>
                <Th>Consegna</Th>
                <Th allineamento="right">Azioni</Th>
              </TabellaHead>

              <tbody>
                {elenco.visibili.map((riparazione) => {
                  const cliente = db.clienti.find((c) => c.id === riparazione.clienteId)
                  return (
                    <Tr
                      key={riparazione.id}
                      onClick={() => navigate(`/riparazioni/${riparazione.id}`)}
                    >
                      <Td className="font-medium text-ink-muted whitespace-nowrap">
                        {riparazione.codice}
                      </Td>

                      <Td>
                        <span className="flex items-center gap-3">
                          <DeviceIcon tipo={riparazione.tipoDispositivo} />
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-semibold text-ink">
                              {riparazione.modello}
                            </span>
                            <span className="block truncate text-[11px] text-ink-faint">
                              {[riparazione.capacita, riparazione.colore]
                                .filter(Boolean)
                                .join(' - ')}
                            </span>
                            {riparazione.imei && (
                              <span className="block truncate text-[11px] text-ink-faint">
                                {riparazione.imei.length > 14 ? 'IMEI' : 'Seriale'}:{' '}
                                {riparazione.imei}
                              </span>
                            )}
                          </span>
                        </span>
                      </Td>

                      <Td>
                        <span className="block text-[13px] font-medium text-ink">
                          {cliente?.nome ?? '—'}
                        </span>
                        {cliente?.telefono && (
                          <span className="mt-0.5 flex items-center gap-1 text-[11px] whitespace-nowrap text-ink-faint">
                            <Phone size={11} />
                            {cliente.telefono}
                          </span>
                        )}
                      </Td>

                      <Td className="max-w-[200px] truncate text-[13px]">
                        {riparazione.difettoSegnalato}
                      </Td>

                      <Td>
                        <BadgeStato stato={riparazione.stato} />
                      </Td>

                      <Td className="text-[13px] whitespace-nowrap">
                        {formatData(riparazione.dataAccettazione)}
                      </Td>

                      <Td className="text-[13px] whitespace-nowrap">
                        {formatData(riparazione.consegnaPrevista)}
                      </Td>

                      <Td allineamento="right">
                        <span
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            to={`/riparazioni/${riparazione.id}`}
                            title="Apri scheda"
                            aria-label="Apri scheda"
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-line-soft bg-surface-3 text-ink-muted transition-colors hover:text-ink"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            to={`/riparazioni/${riparazione.id}/modifica`}
                            title="Modifica"
                            aria-label="Modifica"
                            className="inline-flex size-8 items-center justify-center rounded-lg bg-brand text-white transition-colors hover:bg-brand-hover"
                          >
                            <Pencil size={15} />
                          </Link>
                          <IconButton
                            etichetta="Elimina"
                            tono="rosso"
                            onClick={() => setDaEliminare(riparazione)}
                          >
                            <Trash2 size={15} />
                          </IconButton>
                        </span>
                      </Td>
                    </Tr>
                  )
                })}
              </tbody>
            </Tabella>

            <Paginazione
              pagina={elenco.pagina}
              pagine={elenco.pagine}
              totale={elenco.totale}
              primoElemento={elenco.primoElemento}
              ultimoElemento={elenco.ultimoElemento}
              perPagina={elenco.perPagina}
              etichettaElementi="dispositivi"
              onCambiaPagina={elenco.vaiAPagina}
              onCambiaPerPagina={elenco.cambiaPerPagina}
            />
          </>
        )}
      </Card>

      <Modal
        aperta={daEliminare !== null}
        titolo="Eliminare la riparazione?"
        sottotitolo={
          daEliminare
            ? `${daEliminare.codice} · ${daEliminare.marca} ${daEliminare.modello}`
            : undefined
        }
        onChiudi={() => setDaEliminare(null)}
        larghezza="sm"
        piede={
          <>
            <Button onClick={() => setDaEliminare(null)}>Annulla</Button>
            <Button
              variante="pericolo"
              onClick={() => {
                if (daEliminare) eliminaRiparazione(daEliminare.id)
                setDaEliminare(null)
              }}
            >
              <Trash2 size={15} />
              Elimina definitivamente
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          L'operazione rimuove la scheda dall'archivio e non può essere annullata. Eventuali
          preventivi e fatture collegati restano invariati.
        </p>
      </Modal>
    </div>
  )
}
