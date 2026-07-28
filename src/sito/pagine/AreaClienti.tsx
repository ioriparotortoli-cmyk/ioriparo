import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useGestionale } from '@/data/store'
import { archivioOnline } from '@/lib/supabase'
import { GARANZIA } from '../dati/azienda'
import { totaleFattura, totaleRiparazione } from '@/lib/calcoli'
import { formatData } from '@/lib/format'
import type { Cliente } from '@/types'
import { Icona } from '../componenti/Icona'
import { useNotifica } from '../componenti/Notifiche'
import { SchedaPratica } from '../componenti/SchedaPratica'
import { Avviso, Bottone, Campo, Chip, Ico, Intestazione, LinkBottone, Sezione, Tabella } from '../componenti/base'
import { useRivela } from '../lib/hook'
import { briciole, useSeo } from '../lib/seo'
import { emailValida, euro } from '../lib/utili'

const VANTAGGI = [
  { icona: 'doc' as const, titolo: 'Documenti sempre disponibili', testo: 'Fatture, ricevute e certificati di garanzia archiviati e scaricabili quando vuoi.' },
  { icona: 'check' as const, titolo: 'Preventivi approvabili online', testo: 'Un clic per autorizzare l’intervento: il laboratorio parte subito.' },
  { icona: 'shield' as const, titolo: 'Accesso protetto', testo: 'Connessione cifrata, sessione a scadenza e verifica in due passaggi opzionale.' },
]

/** Come funziona davvero il servizio quando l'archivio del laboratorio è collegato. */
const VANTAGGI_CODICE = [
  { icona: 'check' as const, titolo: 'Nessuna registrazione', testo: 'Niente account da creare né password da ricordare: basta il codice sulla ricevuta.' },
  { icona: 'doc' as const, titolo: 'Aggiornato dal laboratorio', testo: 'Lo stato che leggi è quello che il tecnico scrive sulla pratica, non una copia.' },
  { icona: 'shield' as const, titolo: 'I tuoi dati restano qui', testo: 'La pagina mostra solo dispositivo, stato e date: nome e recapiti non escono dal negozio.' },
]

export function AreaClienti() {
  const rif = useRivela<HTMLDivElement>()
  const { db, aggiornaRiparazione } = useGestionale()
  const notifica = useNotifica()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState<string | null>(null)
  const [accesso, setAccesso] = useState<Cliente | null>(null)

  useSeo({
    titolo: 'Area clienti — pratiche e documenti | Io Riparo',
    descrizione:
      'Accedi all’area clienti Io Riparo per seguire le riparazioni, approvare i preventivi e scaricare fatture e certificati di garanzia.',
    percorso: '/area-clienti',
    datiStrutturati: briciole([
      { nome: 'Home', percorso: '/' },
      { nome: 'Area clienti', percorso: '/area-clienti' },
    ]),
  })

  const dati = useMemo(() => {
    if (!accesso) return null
    const riparazioni = db.riparazioni.filter((r) => r.clienteId === accesso.id)
    const fatture = db.fatture.filter((f) => f.clienteId === accesso.id)
    const preventivi = db.preventivi.filter((p) => p.clienteId === accesso.id)
    return {
      riparazioni,
      fatture,
      preventivi,
      aperte: riparazioni.filter((r) => !['consegnato', 'non_riparabile'].includes(r.stato)),
      daApprovare: riparazioni.filter((r) => r.stato === 'preventivo_inviato'),
      concluse: riparazioni.filter((r) => r.stato === 'consegnato'),
    }
  }, [accesso, db])

  const entra = (e: FormEvent) => {
    e.preventDefault()
    if (!emailValida(email) || password.length < 6) {
      setErrore('Inserisci l’indirizzo e-mail comunicato in negozio e la tua password.')
      return
    }
    const cliente = db.clienti.find((c) => c.email?.toLowerCase() === email.trim().toLowerCase())
    if (!cliente) {
      setErrore('Nessun account collegato a questo indirizzo. Chiedi l’attivazione in negozio.')
      return
    }
    setErrore(null)
    setAccesso(cliente)
    notifica(`Accesso effettuato: ${cliente.nome}.`)
  }

  /* ── Accesso ── */
  if (!accesso || !dati) {
    return (
      <div ref={rif}>
        <Sezione griglia>
          <div className="wrap" style={{ maxWidth: 1000, padding: 0 }}>
            <Intestazione
              occhiello="Area clienti"
          principale
              titolo={
                <>
                  Le tue pratiche,
                  <br />i tuoi documenti.
                </>
              }
              testo={
                archivioOnline
                  ? 'Con il codice pratica della ricevuta segui la riparazione passo per passo, senza registrarti.'
                  : 'Accedi per seguire le riparazioni, approvare i preventivi e scaricare fatture e certificati di garanzia.'
              }
            />

            <div className="split" style={{ alignItems: 'start' }}>
              <div className="card reveal">
                {/*
                  Gli account cliente non esistono: le riparazioni si seguono con
                  il codice pratica della ricevuta. Con l'archivio online
                  collegato — cioè quando i dati sono veri — al posto del modulo
                  di accesso si mostra la strada che funziona davvero, invece di
                  una porta che non apre nulla.
                */}
                {archivioOnline ? (
                  <div>
                    <h3>Segui la tua riparazione</h3>
                    <p className="muted" style={{ fontSize: '.9rem', marginTop: 10 }}>
                      Non serve registrarsi. Sulla ricevuta di accettazione trovi il codice
                      pratica: bastano quello e pochi secondi per sapere a che punto siamo.
                    </p>
                    <div style={{ marginTop: 18 }}>
                      <LinkBottone a="/stato-riparazione" largo>
                        Verifica lo stato con il codice
                      </LinkBottone>
                    </div>
                    <p className="faint" style={{ fontSize: '.78rem', marginTop: 14, textAlign: 'center' }}>
                      Preventivi, fatture e certificati di garanzia te li consegniamo in negozio o
                      via e-mail. Per una copia,{' '}
                      <Link className="link" to="/contatti">
                        scrivici
                      </Link>
                      .
                    </p>
                  </div>
                ) : (
                <form onSubmit={entra} noValidate>
                  <Avviso variante="err" visibile={!!errore}>
                    {errore}
                  </Avviso>
                  <Campo etichetta="E-mail" id="l-mail">
                    <input
                      className="inp"
                      id="l-mail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                    />
                  </Campo>
                  <Campo etichetta="Password" id="l-pwd">
                    <input
                      className="inp"
                      id="l-pwd"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </Campo>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
                    <label className="check">
                      <input type="checkbox" defaultChecked />
                      <span>Resta collegato</span>
                    </label>
                    <Link className="link" to="/contatti" style={{ fontSize: '.82rem' }}>
                      Password dimenticata?
                    </Link>
                  </div>
                  <Bottone type="submit" largo>
                    Accedi
                  </Bottone>
                  <p className="faint" style={{ fontSize: '.78rem', marginTop: 14, textAlign: 'center' }}>
                    L’accesso viene attivato in negozio al momento dell’accettazione.
                  </p>
                </form>
                )}
              </div>

              <div className="reveal" style={{ display: 'grid', gap: 14 }}>
                {(archivioOnline ? VANTAGGI_CODICE : VANTAGGI).map((v) => (
                  <div className="card" key={v.titolo}>
                    <div className="row" style={{ gap: 12, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                      <Ico nome={v.icona} />
                      <div>
                        <h3>{v.titolo}</h3>
                        <p className="muted" style={{ fontSize: '.9rem', marginTop: 6 }}>
                          {v.testo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Sezione>
      </div>
    )
  }

  /* ── Area riservata ── */
  const inCorso = dati.aperte[0]

  return (
    <div ref={rif}>
      <Sezione griglia>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 26 }}>
          <div>
            <span className="eyebrow">Area clienti</span>
            <h2 style={{ marginTop: 12 }}>Ciao {accesso.nome.split(' ')[0]}.</h2>
            <p className="muted" style={{ marginTop: 8 }}>
              {dati.aperte.length
                ? `Hai ${dati.aperte.length} pratica${dati.aperte.length > 1 ? 'che' : ''} in corso`
                : 'Non hai riparazioni in corso'}
              {dati.daApprovare.length ? ` e ${dati.daApprovare.length} preventivo da approvare.` : '.'}
            </p>
          </div>
          <Bottone
            variante="ghost"
            piccolo
            onClick={() => {
              setAccesso(null)
              notifica('Sessione chiusa.')
            }}
          >
            Esci
          </Bottone>
        </div>

        <div className="kpis" style={{ marginBottom: 20 }}>
          <div className="kpi">
            <span>In corso</span>
            <b>{dati.aperte.length}</b>
            <i className="up">aggiornate oggi</i>
          </div>
          <div className="kpi">
            <span>Da approvare</span>
            <b>{dati.daApprovare.length}</b>
            <i>{dati.daApprovare.length ? euro(totaleRiparazione(dati.daApprovare[0])) : 'nessuno'}</i>
          </div>
          <div className="kpi">
            <span>Completate</span>
            <b>{dati.concluse.length}</b>
            <i>storico completo</i>
          </div>
          <div className="kpi">
            <span>Documenti</span>
            <b>{dati.fatture.length}</b>
            <i>fatture disponibili</i>
          </div>
        </div>

        <div className="griglia" style={{ gap: 18 }}>
          <div className="card" style={{ padding: 0 }}>
            <div className="row" style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
              <h3 style={{ marginRight: 'auto' }}>Le tue riparazioni</h3>
              <Chip variante="blue">Aggiornato ora</Chip>
            </div>
            <Tabella
              colonne={[
                { testo: 'Pratica' },
                { testo: 'Dispositivo' },
                { testo: 'Intervento' },
                { testo: 'Stato' },
                { testo: 'Totale', num: true },
                { testo: '' },
              ]}
            >
              {dati.riparazioni.map((r) => (
                <tr key={r.id}>
                  <td>
                    <b className="mono">{r.codice}</b>
                  </td>
                  <td>
                    {r.marca} {r.modello}
                  </td>
                  <td>{r.difettoSegnalato}</td>
                  <td>
                    <Chip
                      variante={
                        r.stato === 'consegnato' || r.stato === 'pronto_per_ritiro'
                          ? 'ok'
                          : r.stato === 'non_riparabile'
                            ? 'alert'
                            : r.stato === 'preventivo_inviato'
                              ? 'warn'
                              : 'blue'
                      }
                      punto
                    >
                      {r.stato.replace(/_/g, ' ')}
                    </Chip>
                  </td>
                  <td className="num">
                    <b>{euro(totaleRiparazione(r))}</b>
                  </td>
                  <td>
                    {r.stato === 'preventivo_inviato' ? (
                      <button
                        className="link"
                        style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: '.82rem' }}
                        onClick={() => {
                          aggiornaRiparazione(r.id, { stato: 'in_lavorazione' })
                          notifica('Preventivo approvato: il laboratorio è stato avvisato.')
                        }}
                      >
                        Approva
                      </button>
                    ) : (
                      <Link className="link" to="/stato-riparazione" style={{ fontSize: '.82rem' }}>
                        Dettaglio
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </Tabella>
          </div>

          <div className="split" style={{ gap: 18 }}>
            <div className="card">
              <h3>Documenti</h3>
              <div className="hours" style={{ marginTop: 12 }}>
                {dati.fatture.length ? (
                  dati.fatture.map((f) => (
                    <div key={f.id}>
                      <b>Fattura {f.numero}</b>
                      <span>
                        {formatData(f.data)} · {euro(totaleFattura(f))}
                      </span>
                    </div>
                  ))
                ) : (
                  <div>
                    <b>Nessun documento</b>
                    <span>Compariranno qui dopo il primo intervento</span>
                  </div>
                )}
                {dati.concluse.slice(0, 2).map((r) => (
                  <div key={`gar-${r.id}`}>
                    <b>Certificato di garanzia {r.codice}</b>
                    <span>{GARANZIA.breve}, dalla consegna</span>
                  </div>
                ))}
              </div>
              <div className="row" style={{ marginTop: 16 }}>
                <Bottone variante="ghost" piccolo onClick={() => notifica('Documento scaricato (dimostrazione).')}>
                  <Icona nome="doc" dimensione={15} /> Scarica tutto
                </Bottone>
              </div>
            </div>

            <div>
              {inCorso ? (
                <SchedaPratica riparazione={inCorso} />
              ) : (
                <div className="card">
                  <h3>Nessuna riparazione in corso</h3>
                  <p className="muted" style={{ fontSize: '.92rem', marginTop: 8 }}>
                    Quando porti un dispositivo in laboratorio la pratica compare qui, con lo stato aggiornato in tempo
                    reale.
                  </p>
                  <div className="row" style={{ marginTop: 16 }}>
                    <LinkBottone a="/preventivo" piccolo>
                      Richiedi un preventivo
                    </LinkBottone>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Sezione>
    </div>
  )
}
