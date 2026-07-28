import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  MessageCircle,
  Plus,
  Printer,
  ScanLine,
  Search,
  Upload,
  UserCheck,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Campo,
  Checkbox,
  GruppoSegmenti,
  Input,
  InputData,
  InputSuggerito,
  Radio,
  Select,
  SezioneForm,
  Textarea,
} from '@/components/ui/Form'
import { Modal } from '@/components/ui/Modal'
import { SignaturePad } from '@/components/ui/SignaturePad'
import { nuovoId, useGestionale } from '@/data/store'
import { formatEuro, oggiISO } from '@/lib/format'
import {
  MARCHE_PER_TIPO,
  modelliSuggeriti,
  ORDINE_STATI,
  STATI_RIPARAZIONE,
  TIPI_DISPOSITIVO,
} from '@/lib/stati'
import type {
  CondizioneEsterna,
  Cliente,
  Riparazione,
  RigaIntervento,
  StatoRiparazione,
  TipoDispositivo,
} from '@/types'

const MAX_DIFETTO = 500

export interface DatiForm {
  /** Cliente esistente selezionato; se assente ne viene creato uno nuovo */
  clienteId?: string
  nomeCliente: string
  telefono: string
  email: string
  indirizzo: string
  citta: string
  cap: string

  tipoDispositivo: TipoDispositivo
  marca: string
  modello: string
  colore: string
  capacita: string
  imei: string
  passwordBlocco: string

  difettoSegnalato: string
  condizioniEsterne?: CondizioneEsterna
  noteCondizioni: string

  accessori: Riparazione['accessori']
  foto: string[]
  firmaCliente?: string

  stato: StatoRiparazione
  dataAccettazione: string
  consegnaPrevista: string
  tecnico: string
  /** Voci del preventivo di massima concordato all'accettazione. */
  interventi: RigaIntervento[]
  acconto: string
  noteInterne: string
}

const CONDIZIONI: Array<{ valore: CondizioneEsterna; label: string; classeAttiva: string }> = [
  { valore: 'ottime', label: 'Ottime', classeAttiva: 'border-emerald-500 bg-emerald-500/15 text-emerald-300' },
  { valore: 'buone', label: 'Buone', classeAttiva: 'border-blue-500 bg-blue-500/15 text-blue-300' },
  { valore: 'sufficienti', label: 'Sufficienti', classeAttiva: 'border-amber-500 bg-amber-500/15 text-amber-300' },
  { valore: 'danneggiato', label: 'Danneggiato', classeAttiva: 'border-rose-500 bg-rose-500/15 text-rose-300' },
]

export function datiVuoti(): DatiForm {
  return {
    nomeCliente: '',
    telefono: '',
    email: '',
    indirizzo: '',
    citta: '',
    cap: '',
    tipoDispositivo: 'smartphone',
    marca: '',
    modello: '',
    colore: '',
    capacita: '',
    imei: '',
    passwordBlocco: '',
    difettoSegnalato: '',
    condizioniEsterne: undefined,
    noteCondizioni: '',
    accessori: { scatola: false, cover: false, caricabatterie: false, cavoUsb: false, altro: '', note: '' },
    foto: [],
    stato: 'in_attesa',
    dataAccettazione: oggiISO(),
    consegnaPrevista: '',
    tecnico: '',
    interventi: [],
    acconto: '',
    noteInterne: '',
  }
}

export function datiDaRiparazione(riparazione: Riparazione, cliente?: Cliente): DatiForm {
  return {
    clienteId: riparazione.clienteId,
    nomeCliente: cliente?.nome ?? '',
    telefono: cliente?.telefono ?? '',
    email: cliente?.email ?? '',
    indirizzo: cliente?.indirizzo ?? '',
    citta: cliente?.citta ?? '',
    cap: cliente?.cap ?? '',
    tipoDispositivo: riparazione.tipoDispositivo,
    marca: riparazione.marca,
    modello: riparazione.modello,
    colore: riparazione.colore ?? '',
    capacita: riparazione.capacita ?? '',
    imei: riparazione.imei ?? '',
    passwordBlocco: riparazione.passwordBlocco ?? '',
    difettoSegnalato: riparazione.difettoSegnalato,
    condizioniEsterne: riparazione.condizioniEsterne,
    noteCondizioni: riparazione.noteCondizioni ?? '',
    accessori: { altro: '', note: '', ...riparazione.accessori },
    foto: riparazione.foto ?? [],
    firmaCliente: riparazione.firmaCliente,
    stato: riparazione.stato,
    dataAccettazione: riparazione.dataAccettazione,
    consegnaPrevista: riparazione.consegnaPrevista ?? '',
    tecnico: riparazione.tecnico ?? '',
    interventi: riparazione.interventi,
    acconto: riparazione.acconto ? String(riparazione.acconto) : '',
    noteInterne: riparazione.noteInterne ?? '',
  }
}

/**
 * Modulo di accettazione, condiviso da «Nuova accettazione» e «Modifica».
 * Il salvataggio è delegato alla pagina che lo ospita.
 */
export function FormRiparazione({
  iniziali,
  etichettaSalva = 'Salva e Stampa',
  onSalva,
}: {
  iniziali: DatiForm
  etichettaSalva?: string
  onSalva: (dati: DatiForm, stampa: boolean) => void
}) {
  const { db } = useGestionale()
  const navigate = useNavigate()

  const [dati, setDati] = useState<DatiForm>(iniziali)
  const [errori, setErrori] = useState<Record<string, string>>({})
  const [sceltaCliente, setSceltaCliente] = useState(false)
  const [ricercaCliente, setRicercaCliente] = useState('')
  const [modoFirma, setModoFirma] = useState<'schermo' | 'carica'>('schermo')
  const inputFoto = useRef<HTMLInputElement>(null)
  const inputFirma = useRef<HTMLInputElement>(null)

  /** Somma delle voci concordate, mostrata mentre si compila. */
  const totalePreventivo = dati.interventi.reduce(
    (somma, riga) => somma + riga.quantita * riga.prezzoUnitario,
    0,
  )

  function aggiungiRiga() {
    setDati((p) => ({
      ...p,
      interventi: [
        ...p.interventi,
        { id: nuovoId('int'), descrizione: '', quantita: 1, prezzoUnitario: 0 },
      ],
    }))
  }

  function cambiaRiga(id: string, modifiche: Partial<RigaIntervento>) {
    setDati((p) => ({
      ...p,
      interventi: p.interventi.map((r) => (r.id === id ? { ...r, ...modifiche } : r)),
    }))
  }

  function rimuoviRiga(id: string) {
    setDati((p) => ({ ...p, interventi: p.interventi.filter((r) => r.id !== id) }))
  }

  function aggiorna<K extends keyof DatiForm>(campo: K, valore: DatiForm[K]) {
    setDati((precedenti) => ({ ...precedenti, [campo]: valore }))
    if (errori[campo as string]) {
      setErrori(({ [campo as string]: _rimosso, ...resto }) => resto)
    }
  }

  const clientiFiltrati = useMemo(() => {
    const termine = ricercaCliente.trim().toLowerCase()
    const elenco = termine
      ? db.clienti.filter((c) =>
          [c.nome, c.telefono, c.email ?? ''].join(' ').toLowerCase().includes(termine),
        )
      : db.clienti
    return elenco.slice(0, 40)
  }, [db.clienti, ricercaCliente])

  function selezionaCliente(cliente: Cliente) {
    setDati((precedenti) => ({
      ...precedenti,
      clienteId: cliente.id,
      nomeCliente: cliente.nome,
      telefono: cliente.telefono,
      email: cliente.email ?? '',
      indirizzo: cliente.indirizzo ?? '',
      citta: cliente.citta ?? '',
      cap: cliente.cap ?? '',
    }))
    setSceltaCliente(false)
    setRicercaCliente('')
  }

  function leggiFile(file: File): Promise<string> {
    return new Promise((risolvi) => {
      const lettore = new FileReader()
      lettore.onload = () => risolvi(String(lettore.result))
      lettore.readAsDataURL(file)
    })
  }

  async function aggiungiFoto(files: FileList | null) {
    if (!files?.length) return
    const nuove = await Promise.all([...files].slice(0, 6).map(leggiFile))
    setDati((precedenti) => ({ ...precedenti, foto: [...precedenti.foto, ...nuove].slice(0, 8) }))
  }

  async function caricaFirma(files: FileList | null) {
    if (!files?.length) return
    aggiorna('firmaCliente', await leggiFile(files[0]))
  }

  function valida(): boolean {
    const nuoviErrori: Record<string, string> = {}
    if (!dati.nomeCliente.trim()) nuoviErrori.nomeCliente = 'Indica il nome del cliente'
    if (!dati.telefono.trim()) nuoviErrori.telefono = 'Indica un recapito telefonico'
    if (!dati.marca.trim()) nuoviErrori.marca = 'Seleziona la marca'
    if (!dati.modello.trim()) nuoviErrori.modello = 'Indica il modello'
    if (!dati.difettoSegnalato.trim()) nuoviErrori.difettoSegnalato = 'Descrivi il difetto segnalato'
    if (dati.consegnaPrevista && dati.consegnaPrevista < dati.dataAccettazione) {
      nuoviErrori.consegnaPrevista = 'La consegna non può precedere l’accettazione'
    }
    setErrori(nuoviErrori)

    if (Object.keys(nuoviErrori).length > 0) {
      // Il primo campo mancante va portato a schermo: il modulo e' lungo tre
      // colonne e sul telefono si sviluppa in verticale, quindi il messaggio
      // rosso puo' trovarsi molto lontano dal pulsante appena premuto.
      requestAnimationFrame(() => {
        document
          .querySelector('[data-errore="true"]')
          ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      })
      return false
    }
    return true
  }

  function salva(stampa: boolean) {
    if (!valida()) return
    onSalva(dati, stampa)
  }

  const marche = MARCHE_PER_TIPO[dati.tipoDispositivo]
  // Suggerimenti per la coppia tipo + marca: il campo resta comunque libero.
  const modelli = modelliSuggeriti(dati.tipoDispositivo, dati.marca)

  const mancanti = Object.values(errori)

  return (
    <div className="space-y-4">
      {/* Riepilogo accanto al pulsante: dice subito perche' non ha salvato. */}
      {mancanti.length > 0 && (
        <div
          role="alert"
          className="rounded-card border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          <strong className="font-semibold">Non ho salvato: mancano alcuni dati.</strong>
          <ul className="mt-1 list-disc pl-5">
            {mancanti.map((messaggio) => (
              <li key={messaggio}>{messaggio}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button onClick={() => navigate(-1)}>
          <X size={15} />
          Annulla
        </Button>
        <Button variante="primario" onClick={() => salva(true)}>
          <Printer size={15} />
          {etichettaSalva}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {/* Colonna 1 — cliente, condizioni, lavorazione */}
        <div className="space-y-4">
          <SezioneForm titolo="Dati cliente">
            <div className="space-y-3">
              <div data-errore={Boolean(errori.nomeCliente)}>
                <Campo etichetta="Nome e Cognome" obbligatorio errore={errori.nomeCliente}>
                  <Input
                    value={dati.nomeCliente}
                    onChange={(e) => {
                      aggiorna('nomeCliente', e.target.value)
                      // Modificando il nome si scollega il cliente selezionato.
                      if (dati.clienteId) aggiorna('clienteId', undefined)
                    }}
                    placeholder="Mario Rossi"
                  />
                </Campo>
              </div>

              <Campo etichetta="Telefono" obbligatorio errore={errori.telefono}>
                <Input
                  value={dati.telefono}
                  onChange={(e) => aggiorna('telefono', e.target.value)}
                  placeholder="333 1234567"
                  inputMode="tel"
                  iconaDestra={
                    dati.telefono ? (
                      <a
                        href={`https://wa.me/39${dati.telefono.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Scrivi su WhatsApp"
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <MessageCircle size={16} />
                      </a>
                    ) : undefined
                  }
                />
              </Campo>

              <Campo etichetta="Email">
                <Input
                  type="email"
                  value={dati.email}
                  onChange={(e) => aggiorna('email', e.target.value)}
                  placeholder="mario.rossi@email.com"
                />
              </Campo>

              <Campo etichetta="Indirizzo">
                <Input
                  value={dati.indirizzo}
                  onChange={(e) => aggiorna('indirizzo', e.target.value)}
                  placeholder="Via Roma 45"
                />
              </Campo>

              <div className="grid grid-cols-2 gap-3">
                <Campo etichetta="Città">
                  <Input
                    value={dati.citta}
                    onChange={(e) => aggiorna('citta', e.target.value)}
                    placeholder="Tortolì"
                  />
                </Campo>
                <Campo etichetta="CAP">
                  <Input
                    value={dati.cap}
                    onChange={(e) => aggiorna('cap', e.target.value)}
                    placeholder="70022"
                    inputMode="numeric"
                  />
                </Campo>
              </div>

              <Button className="w-full" onClick={() => setSceltaCliente(true)}>
                <UserCheck size={15} />
                Seleziona cliente esistente
              </Button>

              {dati.clienteId && (
                <p className="text-[11px] text-emerald-400">
                  Collegato a un cliente esistente in anagrafica.
                </p>
              )}
            </div>
          </SezioneForm>

          <SezioneForm titolo="Condizioni esterne">
            <GruppoSegmenti
              valore={dati.condizioniEsterne}
              opzioni={CONDIZIONI}
              onChange={(valore) => aggiorna('condizioniEsterne', valore)}
            />
            <Textarea
              value={dati.noteCondizioni}
              onChange={(e) => aggiorna('noteCondizioni', e.target.value)}
              placeholder="Note condizioni esterne…"
              className="mt-3 min-h-20"
            />
          </SezioneForm>

          <SezioneForm titolo="Lavorazione">
            <div className="grid grid-cols-2 gap-3">
              <Campo etichetta="Stato">
                <Select
                  value={dati.stato}
                  onChange={(e) => aggiorna('stato', e.target.value as StatoRiparazione)}
                >
                  {ORDINE_STATI.map((stato) => (
                    <option key={stato} value={stato}>
                      {STATI_RIPARAZIONE[stato].label}
                    </option>
                  ))}
                </Select>
              </Campo>

              <Campo etichetta="Tecnico assegnato">
                <Input
                  value={dati.tecnico}
                  onChange={(e) => aggiorna('tecnico', e.target.value)}
                  placeholder="Antonio"
                  list="elenco-tecnici"
                />
              </Campo>

              <Campo etichetta="Data accettazione">
                <Input
                  type="date"
                  value={dati.dataAccettazione}
                  onChange={(e) => aggiorna('dataAccettazione', e.target.value)}
                />
              </Campo>

              <Campo etichetta="Consegna prevista" errore={errori.consegnaPrevista}>
                <InputData
                  value={dati.consegnaPrevista}
                  min={dati.dataAccettazione}
                  onChange={(e) => aggiorna('consegnaPrevista', e.target.value)}
                  placeholder="Da definire"
                />
              </Campo>

              {/*
                Preventivo concordato al banco. Senza queste voci la scheda
                stampata mostrava al cliente il solo acconto, senza il prezzo
                dell'intervento: la cifra che gli interessa di piu'.
              */}
              <div className="col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-ink-muted">
                  Preventivo di massima
                </span>
                <div className="space-y-2">
                  {dati.interventi.map((riga) => (
                    <div className="flex items-center gap-2" key={riga.id}>
                      <Input
                        className="flex-1"
                        value={riga.descrizione}
                        onChange={(e) => cambiaRiga(riga.id, { descrizione: e.target.value })}
                        placeholder="Sostituzione display"
                      />
                      <Input
                        className="w-28 shrink-0"
                        type="number"
                        min={0}
                        step="0.01"
                        value={riga.prezzoUnitario ? String(riga.prezzoUnitario) : ''}
                        onChange={(e) =>
                          cambiaRiga(riga.id, {
                            prezzoUnitario: Number.parseFloat(e.target.value.replace(',', '.')) || 0,
                          })
                        }
                        placeholder="€ 0,00"
                      />
                      <Button
                        dimensione="sm"
                        variante="fantasma"
                        onClick={() => rimuoviRiga(riga.id)}
                        aria-label={`Rimuovi ${riga.descrizione || 'voce'}`}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <Button dimensione="sm" onClick={aggiungiRiga}>
                    <Plus className="size-4" />
                    Aggiungi voce
                  </Button>
                  {dati.interventi.length > 0 && (
                    <span className="text-sm text-ink-muted">
                      Totale <strong className="text-ink">{formatEuro(totalePreventivo)}</strong>
                    </span>
                  )}
                </div>
                {dati.interventi.length === 0 && (
                  <p className="mt-2 text-xs text-ink-faint">
                    Senza voci la scheda stampata non riporta alcun prezzo.
                  </p>
                )}
              </div>

              <Campo etichetta="Acconto (€)" className="col-span-2">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={dati.acconto}
                  onChange={(e) => aggiorna('acconto', e.target.value)}
                  placeholder="0,00"
                />
              </Campo>
            </div>
          </SezioneForm>
        </div>

        {/* Colonna 2 — dispositivo e foto */}
        <div className="space-y-4">
          <SezioneForm titolo="Dati dispositivo">
            <div className="space-y-3">
              <Campo etichetta="Tipo dispositivo" obbligatorio>
                <Select
                  value={dati.tipoDispositivo}
                  onChange={(e) => {
                    const tipo = e.target.value as TipoDispositivo
                    aggiorna('tipoDispositivo', tipo)
                    // La marca resta solo se prevista per il nuovo tipo.
                    if (!MARCHE_PER_TIPO[tipo].includes(dati.marca)) aggiorna('marca', '')
                  }}
                >
                  {Object.entries(TIPI_DISPOSITIVO).map(([valore, label]) => (
                    <option key={valore} value={valore}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Campo>

              <Campo etichetta="Marca" obbligatorio errore={errori.marca}>
                <Select value={dati.marca} onChange={(e) => aggiorna('marca', e.target.value)}>
                  <option value="">Seleziona…</option>
                  {marche.map((marca) => (
                    <option key={marca} value={marca}>
                      {marca}
                    </option>
                  ))}
                </Select>
              </Campo>

              <Campo
                etichetta="Modello"
                obbligatorio
                errore={errori.modello}
                aiuto={
                  modelli.length
                    ? 'Scegli dall’elenco o scrivi il modello se non c’è'
                    : dati.marca
                      ? undefined
                      : 'Scegli prima la marca per avere i modelli suggeriti'
                }
              >
                <InputSuggerito
                  value={dati.modello}
                  onChange={(valore) => aggiorna('modello', valore)}
                  suggerimenti={modelli}
                  placeholder={modelli[0] ?? 'iPhone 13'}
                />
              </Campo>

              <div className="grid grid-cols-2 gap-3">
                <Campo etichetta="Colore">
                  <Input
                    value={dati.colore}
                    onChange={(e) => aggiorna('colore', e.target.value)}
                    placeholder="Nero"
                  />
                </Campo>
                <Campo etichetta="Capacità">
                  <Input
                    value={dati.capacita}
                    onChange={(e) => aggiorna('capacita', e.target.value)}
                    placeholder="128 GB"
                  />
                </Campo>
              </div>

              <Campo etichetta="IMEI / Serial Number">
                <Input
                  value={dati.imei}
                  onChange={(e) => aggiorna('imei', e.target.value)}
                  placeholder="352099114587632"
                  iconaDestra={<ScanLine size={16} />}
                />
              </Campo>

              <Campo
                etichetta="Password / Blocco"
                aiuto="Utile per collaudare il dispositivo dopo l'intervento."
              >
                <Input
                  value={dati.passwordBlocco}
                  onChange={(e) => aggiorna('passwordBlocco', e.target.value)}
                  placeholder="Inserisci se conosciuta"
                />
              </Campo>
            </div>
          </SezioneForm>

          <SezioneForm titolo="Foto dispositivo">
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => inputFoto.current?.click()}
                className="flex aspect-3/4 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-soft bg-surface-2 text-ink-faint transition-colors hover:border-brand hover:text-ink"
              >
                <Plus size={18} />
                <span className="text-[10px] leading-tight">Aggiungi foto</span>
              </button>

              {dati.foto.map((foto, indice) => (
                <div key={indice} className="group relative aspect-3/4">
                  <img
                    src={foto}
                    alt={`Foto dispositivo ${indice + 1}`}
                    className="size-full rounded-lg border border-line-soft object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      aggiorna(
                        'foto',
                        dati.foto.filter((_, i) => i !== indice),
                      )
                    }
                    aria-label={`Rimuovi foto ${indice + 1}`}
                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-rose-600 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              onChange={(e) => {
                void aggiungiFoto(e.target.files)
                e.target.value = ''
              }}
            />

            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-faint">
              <Camera size={12} />
              Documenta graffi e ammaccature prima dell'intervento.
            </p>
          </SezioneForm>
        </div>

        {/* Colonna 3 — difetto, accessori, firma */}
        <div className="space-y-4 lg:col-span-2 xl:col-span-1">
          <SezioneForm titolo="Difetto segnalato">
            <div data-errore={Boolean(errori.difettoSegnalato)}>
              <Campo obbligatorio errore={errori.difettoSegnalato}>
                <Textarea
                  value={dati.difettoSegnalato}
                  maxLength={MAX_DIFETTO}
                  onChange={(e) => aggiorna('difettoSegnalato', e.target.value)}
                  placeholder="Il display si è rotto dopo una caduta e non risponde più al tocco nella parte superiore."
                  className="min-h-28"
                />
              </Campo>
            </div>
            <p className="mt-1 text-right text-[11px] text-ink-faint">
              {dati.difettoSegnalato.length} / {MAX_DIFETTO}
            </p>
          </SezioneForm>

          <SezioneForm titolo="Accessori consegnati">
            <div className="grid grid-cols-2 gap-2.5">
              <Checkbox
                etichetta="Scatola"
                checked={dati.accessori.scatola}
                onChange={(e) =>
                  aggiorna('accessori', { ...dati.accessori, scatola: e.target.checked })
                }
              />
              <Checkbox
                etichetta="Caricabatterie"
                checked={dati.accessori.caricabatterie}
                onChange={(e) =>
                  aggiorna('accessori', { ...dati.accessori, caricabatterie: e.target.checked })
                }
              />
              <Checkbox
                etichetta="Cover"
                checked={dati.accessori.cover}
                onChange={(e) =>
                  aggiorna('accessori', { ...dati.accessori, cover: e.target.checked })
                }
              />
              <Checkbox
                etichetta="Cavo USB"
                checked={dati.accessori.cavoUsb}
                onChange={(e) =>
                  aggiorna('accessori', { ...dati.accessori, cavoUsb: e.target.checked })
                }
              />
            </div>

            <Input
              value={dati.accessori.altro ?? ''}
              onChange={(e) => aggiorna('accessori', { ...dati.accessori, altro: e.target.value })}
              placeholder="Altro (es. SIM, microSD…)"
              className="mt-3"
            />

            <Textarea
              value={dati.accessori.note ?? ''}
              onChange={(e) => aggiorna('accessori', { ...dati.accessori, note: e.target.value })}
              placeholder="Note accessori…"
              className="mt-2 min-h-16"
            />
          </SezioneForm>

          <SezioneForm titolo="Firma cliente">
            <div className="mb-3 flex flex-wrap gap-4">
              <Radio
                name="modo-firma"
                etichetta="Firma su schermo"
                checked={modoFirma === 'schermo'}
                onChange={() => setModoFirma('schermo')}
              />
              <Radio
                name="modo-firma"
                etichetta="Carica firma"
                checked={modoFirma === 'carica'}
                onChange={() => setModoFirma('carica')}
              />
            </div>

            {modoFirma === 'schermo' ? (
              <SignaturePad
                valore={dati.firmaCliente}
                onChange={(firma) => aggiorna('firmaCliente', firma)}
              />
            ) : (
              <div className="space-y-3">
                <Button className="w-full" onClick={() => inputFirma.current?.click()}>
                  <Upload size={15} />
                  Carica immagine della firma
                </Button>
                <input
                  ref={inputFirma}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    void caricaFirma(e.target.files)
                    e.target.value = ''
                  }}
                />
                {dati.firmaCliente && (
                  <img
                    src={dati.firmaCliente}
                    alt="Firma del cliente"
                    className="w-full rounded-lg border border-line-soft bg-surface-2 p-2"
                  />
                )}
              </div>
            )}

            <p className="mt-2 text-[11px] text-ink-faint">
              Con la firma il cliente accetta le condizioni di servizio e il preventivo di massima.
            </p>
          </SezioneForm>

          <SezioneForm titolo="Note interne">
            <Textarea
              value={dati.noteInterne}
              onChange={(e) => aggiorna('noteInterne', e.target.value)}
              placeholder="Visibili solo al personale del laboratorio…"
              className="min-h-20"
            />
          </SezioneForm>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => navigate(-1)}>Annulla</Button>
        <Button variante="secondario" onClick={() => salva(false)}>
          Salva
        </Button>
        <Button variante="primario" onClick={() => salva(true)}>
          <Printer size={15} />
          {etichettaSalva}
        </Button>
      </div>

      <datalist id="elenco-tecnici">
        {[...new Set(db.riparazioni.map((r) => r.tecnico).filter(Boolean))].map((nome) => (
          <option key={nome} value={nome} />
        ))}
      </datalist>

      <Modal
        aperta={sceltaCliente}
        titolo="Seleziona cliente esistente"
        sottotitolo="Cerca per nome, telefono o email"
        onChiudi={() => setSceltaCliente(false)}
      >
        <div className="relative mb-3">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-faint"
          />
          <Input
            value={ricercaCliente}
            onChange={(e) => setRicercaCliente(e.target.value)}
            placeholder="Cerca cliente…"
            className="pl-9"
            autoFocus
          />
        </div>

        <ul className="divide-y divide-line">
          {clientiFiltrati.map((cliente) => (
            <li key={cliente.id}>
              <button
                type="button"
                onClick={() => selezionaCliente(cliente)}
                className="flex w-full items-center justify-between gap-3 px-2 py-3 text-left transition-colors hover:bg-surface-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">
                    {cliente.nome}
                  </span>
                  <span className="block truncate text-xs text-ink-faint">
                    {cliente.telefono}
                    {cliente.citta ? ` · ${cliente.citta}` : ''}
                  </span>
                </span>
                <span className="shrink-0 text-[10px] font-bold tracking-wide text-ink-faint uppercase">
                  {cliente.tipo}
                </span>
              </button>
            </li>
          ))}
          {clientiFiltrati.length === 0 && (
            <li className="py-8 text-center text-xs text-ink-faint">Nessun cliente trovato</li>
          )}
        </ul>
      </Modal>
    </div>
  )
}
