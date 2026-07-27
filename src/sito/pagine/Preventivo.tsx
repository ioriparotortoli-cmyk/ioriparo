import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNotifica } from '../componenti/Notifiche'
import { Avviso, Bottone, Campo, Intestazione, Sezione } from '../componenti/base'
import { CATEGORIE_PREVENTIVO, GUASTI_PREVENTIVO, SERVIZI } from '../dati/servizi'
import { useRivela } from '../lib/hook'
import { briciole, useSeo } from '../lib/seo'
import { cn, emailValida, euro, telefonoValido } from '../lib/utili'

type Urgenza = 'standard' | 'express' | 'programmato'

const TEMPI: Record<Urgenza, string> = {
  standard: '2–3 giorni',
  express: '24 ore (express)',
  programmato: 'su appuntamento',
}

/** Categoria suggerita quando si arriva da una scheda servizio. */
function categoriaDaServizio(id: string | null) {
  if (!id) return CATEGORIE_PREVENTIVO[0].id
  const servizio = SERVIZI.find((s) => s.id === id)
  if (!servizio) return CATEGORIE_PREVENTIVO[0].id
  if (servizio.famiglia === 'reti' || servizio.famiglia === 'aziende') return 'impianto'
  if (servizio.id.includes('tablet')) return 'tablet'
  if (servizio.id.includes('notebook')) return 'notebook'
  if (servizio.id.includes('computer')) return 'desktop'
  if (servizio.id.includes('recupero')) return 'dati'
  return 'smartphone'
}

export function Preventivo() {
  const rif = useRivela<HTMLDivElement>()
  const notifica = useNotifica()
  const [parametri] = useSearchParams()

  const [passo, setPasso] = useState(1)
  const [categoria, setCategoria] = useState(() => categoriaDaServizio(parametri.get('servizio')))
  const [guasto, setGuasto] = useState(GUASTI_PREVENTIVO[0].id)
  const [modello, setModello] = useState('')
  const [urgenza, setUrgenza] = useState<Urgenza>('standard')
  const [note, setNote] = useState('')
  const [nome, setNome] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [errori, setErrori] = useState<Record<string, string>>({})
  const [inviato, setInviato] = useState<string | null>(null)

  useSeo({
    titolo: 'Preventivo online — stima in un minuto | Io Riparo',
    descrizione:
      'Calcola online una stima per la riparazione di smartphone, tablet, computer o per un impianto di rete e videosorveglianza. Gratuito e senza impegno.',
    percorso: '/preventivo',
    datiStrutturati: briciole([
      { nome: 'Home', percorso: '/' },
      { nome: 'Preventivo', percorso: '/preventivo' },
    ]),
  })

  const stima = useMemo(() => {
    const c = CATEGORIE_PREVENTIVO.find((x) => x.id === categoria)!
    const g = GUASTI_PREVENTIVO.find((x) => x.id === guasto)!
    const moltiplicatore = urgenza === 'express' ? 1.25 : 1
    return {
      categoria: c.titolo,
      guasto: g.titolo,
      minimo: Math.round(c.base[0] * g.k * moltiplicatore),
      massimo: Math.round(c.base[1] * g.k * moltiplicatore * 0.72),
    }
  }, [categoria, guasto, urgenza])

  const Riepilogo = () => (
    <div className="summary">
      <div className="summary__r">
        <span>Categoria</span>
        <b>{stima.categoria}</b>
      </div>
      <div className="summary__r">
        <span>Problema</span>
        <b>{stima.guasto}</b>
      </div>
      <div className="summary__r">
        <span>Modello</span>
        <b>{modello || 'da comunicare'}</b>
      </div>
      <div className="summary__r">
        <span>Tempi stimati</span>
        <b>{TEMPI[urgenza]}</b>
      </div>
      <div className="summary__r summary__tot">
        <span>Stima indicativa</span>
        <b>
          {euro(stima.minimo)} – {euro(stima.massimo)}
        </b>
      </div>
    </div>
  )

  const invia = (e: FormEvent) => {
    e.preventDefault()
    const nuovi: Record<string, string> = {}
    if (nome.trim().length < 2) nuovi.nome = 'Inserisci il tuo nome.'
    if (!telefonoValido(telefono)) nuovi.telefono = 'Inserisci un numero di telefono valido.'
    if (!emailValida(email)) nuovi.email = 'Inserisci un indirizzo e-mail valido.'
    if (!privacy) nuovi.privacy = 'Devi accettare l’informativa privacy.'
    setErrori(nuovi)
    if (Object.keys(nuovi).length) return

    const pratica = `RIC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
    setInviato(
      `Richiesta registrata con il numero ${pratica}. Ti ricontattiamo ${
        new Date().getHours() < 17 ? 'entro oggi' : 'domani mattina'
      } con il preventivo definitivo (stima ${euro(stima.minimo)}–${euro(stima.massimo)}).`,
    )
    notifica('Richiesta di preventivo inviata.')
  }

  return (
    <div ref={rif}>
      <Sezione griglia>
        <div className="wrap" style={{ maxWidth: 860, padding: 0 }}>
          <Intestazione
            occhiello="Preventivo online · 3 passaggi"
            titolo="Una stima in meno di un minuto."
            testo="Rispondi a tre domande: ti mostriamo subito una fascia di prezzo indicativa e ti ricontattiamo con il preventivo definitivo."
          />

          <div className="card reveal">
            <div className="wiz__bar" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div key={n} className={cn(passo >= n && 'is-done')} />
              ))}
            </div>

            <form onSubmit={invia} noValidate>
              {/* Passo 1 */}
              <div className={cn('wiz__step', passo === 1 && 'is-on')}>
                <h3 style={{ marginBottom: 14 }}>Di cosa hai bisogno?</h3>
                <div className="pick">
                  {CATEGORIE_PREVENTIVO.map((c) => (
                    <label key={c.id}>
                      <input
                        type="radio"
                        name="categoria"
                        value={c.id}
                        checked={categoria === c.id}
                        onChange={() => setCategoria(c.id)}
                      />
                      <b>{c.titolo}</b>
                      <small>{c.nota}</small>
                    </label>
                  ))}
                </div>

                <h3 style={{ margin: '26px 0 14px' }}>Qual è il problema?</h3>
                <div className="pick">
                  {GUASTI_PREVENTIVO.map((g) => (
                    <label key={g.id}>
                      <input type="radio" name="guasto" value={g.id} checked={guasto === g.id} onChange={() => setGuasto(g.id)} />
                      <b>{g.titolo}</b>
                      <small>{g.nota}</small>
                    </label>
                  ))}
                </div>

                <div className="row" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
                  <Bottone type="button" onClick={() => setPasso(2)}>
                    Continua
                  </Bottone>
                </div>
              </div>

              {/* Passo 2 */}
              <div className={cn('wiz__step', passo === 2 && 'is-on')}>
                <h3 style={{ marginBottom: 14 }}>Dispositivo e urgenza</h3>
                <div className="form-grid">
                  <Campo etichetta="Marca e modello" id="q-modello">
                    <input
                      className="inp"
                      id="q-modello"
                      value={modello}
                      onChange={(e) => setModello(e.target.value)}
                      placeholder="Es. iPhone 13, Lenovo ThinkPad T14"
                    />
                  </Campo>
                  <Campo etichetta="Urgenza" id="q-urgenza">
                    <select
                      className="inp"
                      id="q-urgenza"
                      value={urgenza}
                      onChange={(e) => setUrgenza(e.target.value as Urgenza)}
                    >
                      <option value="standard">Standard (2–3 giorni)</option>
                      <option value="express">Express 24 ore (+25%)</option>
                      <option value="programmato">Su appuntamento programmato</option>
                    </select>
                  </Campo>
                  <Campo etichetta="Descrivi il guasto" id="q-note" intero>
                    <textarea
                      className="inp"
                      id="q-note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Es. è caduto, il display è nero ma vibra ancora quando ricevo chiamate."
                    />
                  </Campo>
                </div>

                <Riepilogo />

                <div className="row" style={{ justifyContent: 'space-between', marginTop: 24 }}>
                  <Bottone type="button" variante="ghost" onClick={() => setPasso(1)}>
                    Indietro
                  </Bottone>
                  <Bottone type="button" onClick={() => setPasso(3)}>
                    Continua
                  </Bottone>
                </div>
              </div>

              {/* Passo 3 */}
              <div className={cn('wiz__step', passo === 3 && 'is-on')}>
                <h3 style={{ marginBottom: 14 }}>Come ti ricontattiamo?</h3>
                <Avviso visibile={!!inviato}>{inviato}</Avviso>

                <div className="form-grid">
                  <Campo etichetta="Nome e cognome" id="q-nome" obbligatorio errore={errori.nome}>
                    <input className="inp" id="q-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
                  </Campo>
                  <Campo etichetta="Telefono" id="q-tel" obbligatorio errore={errori.telefono}>
                    <input
                      className="inp"
                      id="q-tel"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      autoComplete="tel"
                    />
                  </Campo>
                  <Campo etichetta="E-mail" id="q-mail" obbligatorio errore={errori.email} intero>
                    <input
                      className="inp"
                      id="q-mail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </Campo>
                </div>

                <label className={cn('check', errori.privacy && 'is-err')}>
                  <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
                  <span>
                    Ho letto l’<Link className="link" to="/privacy">informativa privacy</Link> e acconsento al
                    trattamento dei dati per essere ricontattato. <span style={{ color: 'var(--alert)' }}>*</span>
                  </span>
                </label>
                {errori.privacy && (
                  <small className="field__err" style={{ display: 'block', marginTop: 6 }}>
                    {errori.privacy}
                  </small>
                )}

                <div style={{ marginTop: 18 }}>
                  <Riepilogo />
                </div>

                <div className="row" style={{ justifyContent: 'space-between', marginTop: 24 }}>
                  <Bottone type="button" variante="ghost" onClick={() => setPasso(2)}>
                    Indietro
                  </Bottone>
                  <Bottone type="submit">{inviato ? 'Richiesta inviata ✓' : 'Invia richiesta'}</Bottone>
                </div>
              </div>
            </form>
          </div>

          <p className="faint" style={{ fontSize: '.79rem', marginTop: 14 }}>
            La stima è indicativa e non vincolante. Il preventivo definitivo viene emesso dopo la diagnosi in
            laboratorio ed è sempre gratuito.
          </p>
        </div>
      </Sezione>
    </div>
  )
}
