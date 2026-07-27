import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { TEL, useChiamata } from '../componenti/Contatto'
import { Icona } from '../componenti/Icona'
import { useNotifica } from '../componenti/Notifiche'
import { Avviso, Bottone, Campo, Chip, Intestazione, LinkBottone, Sezione } from '../componenti/base'
import { AZIENDA, INDIRIZZO_COMPLETO, MAPPA, ORARI, WHATSAPP, apertoOra } from '../dati/azienda'
import { useRivela } from '../lib/hook'
import { briciole, useSeo } from '../lib/seo'
import { inviaModulo, propsEsca, sospetto } from '../lib/moduli'
import { cn, emailValida } from '../lib/utili'

const MOTIVI_CONTATTO = [
  'Riparazione dispositivo',
  'Recupero dati',
  'Videosorveglianza',
  'Rete Wi-Fi o cablaggio',
  'Assistenza aziendale',
  'Altro',
]

/** Mappa disegnata: nessuno script esterno, nessun cookie di terze parti. */
function Mappa() {
  return (
    <div className="map">
      <svg viewBox="0 0 800 500" role="img" aria-label={`Mappa della sede in ${INDIRIZZO_COMPLETO}`}>
        <rect width="800" height="500" fill="#0a1220" />
        <g stroke="#16243c" strokeWidth="1">
          <path d="M0 60h800M0 140h800M0 220h800M0 300h800M0 380h800M0 460h800" />
          <path d="M60 0v500M180 0v500M300 0v500M420 0v500M540 0v500M660 0v500M760 0v500" />
        </g>
        <g fill="#101c30">
          <rect x="70" y="70" width="100" height="60" rx="4" />
          <rect x="190" y="150" width="100" height="60" rx="4" />
          <rect x="430" y="70" width="100" height="60" rx="4" />
          <rect x="550" y="230" width="100" height="60" rx="4" />
          <rect x="190" y="310" width="100" height="60" rx="4" />
          <rect x="430" y="390" width="100" height="60" rx="4" />
          <rect x="670" y="70" width="80" height="60" rx="4" />
        </g>
        <path d="M0 230h800" stroke="#22334f" strokeWidth="16" />
        <path d="M0 230h800" stroke="#2b4064" strokeWidth="2" strokeDasharray="14 14" />
        <path d="M420 0v500" stroke="#22334f" strokeWidth="12" />
        <rect x="300" y="310" width="100" height="60" rx="6" fill="#2dd4a7" opacity=".45" />
        <text x="316" y="345" fill="#7fb2ff" fontSize="13" fontFamily="ui-monospace,monospace">
          PARCO
        </text>
        <text x="30" y="222" fill="#4a5f80" fontSize="13" fontFamily="ui-monospace,monospace">
          {AZIENDA.indirizzo.toUpperCase()}
        </text>
        <text x="432" y="470" fill="#4a5f80" fontSize="13" fontFamily="ui-monospace,monospace">
          CENTRO
        </text>
      </svg>
      <div className="map__pin">
        <span className="map__badge">
          {AZIENDA.nome} · {AZIENDA.indirizzo}
        </span>
        <span className="map__dot" />
      </div>
    </div>
  )
}

export function Contatti() {
  const rif = useRivela<HTMLDivElement>()
  const notifica = useNotifica()
  const chiama = useChiamata()

  const [nome, setNome] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [motivo, setMotivo] = useState(MOTIVI_CONTATTO[0])
  const [messaggio, setMessaggio] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [errori, setErrori] = useState<Record<string, string>>({})
  const [inviato, setInviato] = useState<'servizio' | 'posta' | null>(null)
  const [guasto, setGuasto] = useState<string | null>(null)
  const [inCorso, setInCorso] = useState(false)
  const [esca, setEsca] = useState('')
  const apertoIl = useRef(Date.now())

  useSeo({
    titolo: `Contatti — ${AZIENDA.citta} | Io Riparo`,
    descrizione: `Vieni in laboratorio in ${INDIRIZZO_COMPLETO}, chiamaci allo ${AZIENDA.telefono} o scrivici su WhatsApp al ${AZIENDA.cellulare}. Preventivi gratuiti per privati e aziende.`,
    percorso: '/contatti',
    datiStrutturati: briciole([
      { nome: 'Home', percorso: '/' },
      { nome: 'Contatti', percorso: '/contatti' },
    ]),
  })

  const oggi = new Date().getDay()
  const aperto = apertoOra()

  const invia = async (e: FormEvent) => {
    e.preventDefault()
    const nuovi: Record<string, string> = {}
    if (nome.trim().length < 2) nuovi.nome = 'Inserisci il tuo nome.'
    if (!emailValida(email)) nuovi.email = 'Inserisci un indirizzo e-mail valido.'
    if (messaggio.trim().length < 10) nuovi.messaggio = 'Scrivi qualche parola in più sul problema.'
    if (!privacy) nuovi.privacy = 'Devi accettare l’informativa privacy.'
    setErrori(nuovi)
    if (Object.keys(nuovi).length) return
    if (sospetto(esca, apertoIl.current)) return

    setInCorso(true)
    const esito = await inviaModulo('contatti', {
      email,
      nome,
      campi: {
        Nome: nome,
        Telefono: telefono,
        'E-mail': email,
        Motivo: motivo,
        Messaggio: messaggio,
      },
    })
    setInCorso(false)

    if (!esito.ok) {
      setGuasto(esito.errore)
      notifica(esito.errore)
      return
    }
    setGuasto(null)

    setInviato(esito.via)
    setNome('')
    setTelefono('')
    setEmail('')
    setMessaggio('')
    setPrivacy(false)
    notifica(esito.via === 'posta' ? 'Apriamo il tuo programma di posta.' : 'Messaggio inviato correttamente.')
  }

  return (
    <div ref={rif}>
      <Sezione griglia>
        <Intestazione
          occhiello="Contatti"
          principale
          titolo={
            <>
              Parliamone.
              <br />
              Rispondiamo davvero.
            </>
          }
          testo="Telefono, WhatsApp o modulo: scegli il canale che preferisci. In orario di apertura rispondiamo entro pochi minuti."
        />

        <div className="contact-grid">
          <div className="reveal" style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
            <a className="cinfo" href={TEL} onClick={chiama}>
              <span className="ico">
                <Icona nome="call" dimensione={22} />
              </span>
              <span>
                <b>{AZIENDA.telefono}</b>
                <span>Lun–Sab · negli orari di apertura</span>
              </span>
            </a>
            <a className="cinfo" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <span className="ico">
                <Icona nome="wa" dimensione={22} pieno />
              </span>
              <span>
                <b>{AZIENDA.cellulare}</b>
                <span>WhatsApp · manda la foto del guasto e ti diciamo cosa serve</span>
              </span>
            </a>
            <a className="cinfo" href={`mailto:${AZIENDA.email}`}>
              <span className="ico">
                <Icona nome="mail" dimensione={22} />
              </span>
              <span>
                <b>{AZIENDA.email}</b>
                <span>Preventivi, fatturazione e aziende</span>
              </span>
            </a>
            <a className="cinfo" href={MAPPA} target="_blank" rel="noopener noreferrer">
              <span className="ico">
                <Icona nome="pin" dimensione={22} />
              </span>
              <span>
                <b>{AZIENDA.indirizzo}</b>
                <span>
                  {AZIENDA.cap} {AZIENDA.citta} ({AZIENDA.provincia})
                </span>
              </span>
            </a>

            <div className="card" style={{ marginTop: 6 }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                <h3>Orari di apertura</h3>
                <Chip variante={aperto ? 'ok' : 'alert'} punto>
                  {aperto ? 'Aperto ora' : 'Chiuso ora'}
                </Chip>
              </div>
              <div className="hours">
                {ORARI.map((o) => (
                  <div key={o.giorno} className={cn(o.indice === oggi && 'is-today')}>
                    <b>{o.giorno}</b>
                    <span>{o.orario}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal" style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Scrivici</h3>
              <form onSubmit={invia} noValidate>
                <Avviso variante="err" visibile={!!guasto}>
                  {guasto}
                </Avviso>
                <Avviso visibile={!!inviato}>
                  {inviato === 'posta'
                    ? 'Abbiamo aperto il tuo programma di posta con il messaggio già compilato: premi invia e ti rispondiamo entro poche ore lavorative.'
                    : 'Messaggio inviato. Ti rispondiamo entro poche ore lavorative, di solito molto prima.'}
                </Avviso>

                <div className="form-grid">
                  <Campo etichetta="Nome e cognome" id="c-nome" obbligatorio errore={errori.nome}>
                    <input className="inp" id="c-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
                  </Campo>
                  <Campo etichetta="Telefono" id="c-tel">
                    <input
                      className="inp"
                      id="c-tel"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      autoComplete="tel"
                    />
                  </Campo>
                  <Campo etichetta="E-mail" id="c-mail" obbligatorio errore={errori.email} intero>
                    <input
                      className="inp"
                      id="c-mail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </Campo>
                  <Campo etichetta="Motivo del contatto" id="c-motivo" intero>
                    <select className="inp" id="c-motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                      {MOTIVI_CONTATTO.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo etichetta="Messaggio" id="c-msg" obbligatorio errore={errori.messaggio} intero>
                    <textarea
                      className="inp"
                      id="c-msg"
                      value={messaggio}
                      onChange={(e) => setMessaggio(e.target.value)}
                      placeholder="Raccontaci il problema: modello del dispositivo, cosa è successo e da quando."
                    />
                  </Campo>
                </div>

                <label className="check">
                  <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
                  <span>
                    Ho letto l’<Link className="link" to="/privacy">informativa privacy</Link> e acconsento al
                    trattamento dei dati. <span style={{ color: 'var(--alert)' }}>*</span>
                  </span>
                </label>
                {errori.privacy && (
                  <small className="field__err" style={{ display: 'block', marginTop: 6 }}>
                    {errori.privacy}
                  </small>
                )}

                <input {...propsEsca} value={esca} onChange={(e) => setEsca(e.target.value)} />
                <Bottone type="submit" largo style={{ marginTop: 18 }} disabled={inCorso}>
                  {inCorso ? 'Invio in corso…' : 'Invia messaggio'}
                </Bottone>
                <p className="faint" style={{ fontSize: '.76rem', marginTop: 12, textAlign: 'center' }}>
                  Non usiamo i tuoi dati per finalità commerciali senza consenso.
                </p>
              </form>
            </div>

            <Mappa />
            <LinkBottone a={MAPPA} variante="ghost" largo>
              Apri in Google Maps <Icona nome="arrow" dimensione={16} />
            </LinkBottone>
          </div>
        </div>
      </Sezione>
    </div>
  )
}
