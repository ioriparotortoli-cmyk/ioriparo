import { useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useNotifica } from '../componenti/Notifiche'
import { Avviso, Bottone, Campo, Intestazione, Sezione } from '../componenti/base'
import { ORARI } from '../dati/azienda'
import { SERVIZI_APPUNTAMENTO } from '../dati/servizi'
import { useRivela } from '../lib/hook'
import { briciole, useSeo } from '../lib/seo'
import { inviaModulo, propsEsca, sospetto } from '../lib/moduli'
import { cn, dataEstesa, telefonoValido } from '../lib/utili'

const FASCE = ['09:00', '09:45', '10:30', '11:15', '12:00', '16:00', '16:45', '17:30', '18:15', '19:00']

/** Prossimi giorni lavorativi disponibili (la domenica è chiusa). */
function giorniDisponibili(quanti = 12) {
  const elenco: Date[] = []
  for (let i = 1; elenco.length < quanti; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    if (ORARI.find((o) => o.indice === d.getDay())?.fasce.length) elenco.push(d)
  }
  return elenco
}

export function Prenota() {
  const rif = useRivela<HTMLDivElement>()
  const notifica = useNotifica()
  const giorni = useMemo(() => giorniDisponibili(), [])

  const [servizio, setServizio] = useState(SERVIZI_APPUNTAMENTO[0])
  const [giorno, setGiorno] = useState(0)
  const [fascia, setFascia] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [telefono, setTelefono] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [email, setEmail] = useState('')
  const [errori, setErrori] = useState<Record<string, string>>({})
  const [conferma, setConferma] = useState<string | null>(null)
  const [inCorso, setInCorso] = useState(false)
  const [esca, setEsca] = useState('')
  const apertoIl = useRef(Date.now())

  useSeo({
    titolo: 'Prenota un appuntamento | Io Riparo',
    descrizione:
      'Prenota diagnosi, ritiro del dispositivo o un sopralluogo per rete e videosorveglianza: scegli giorno e orario, senza attese al banco.',
    percorso: '/prenota',
    datiStrutturati: briciole([
      { nome: 'Home', percorso: '/' },
      { nome: 'Prenota', percorso: '/prenota' },
    ]),
  })

  const scelto = giorni[giorno]
  const sabato = scelto?.getDay() === 6
  const occupata = (i: number) => (sabato && i > 4) || (i + giorno) % 9 === 2

  const invia = async (e: FormEvent) => {
    e.preventDefault()
    const nuovi: Record<string, string> = {}
    if (!fascia) nuovi.fascia = 'Scegli un orario disponibile.'
    if (nome.trim().length < 2) nuovi.nome = 'Campo obbligatorio.'
    if (!telefonoValido(telefono)) nuovi.telefono = 'Inserisci un numero valido.'
    if (!privacy) nuovi.privacy = 'Devi accettare l’informativa privacy.'
    setErrori(nuovi)
    if (Object.keys(nuovi).length) return
    if (sospetto(esca, apertoIl.current)) return

    setInCorso(true)
    const esito = await inviaModulo('appuntamento', {
      email: email || 'non indicata',
      nome,
      campi: {
        Nome: nome,
        Telefono: telefono,
        'E-mail': email,
        Servizio: servizio,
        Giorno: dataEstesa(scelto),
        Orario: fascia ?? '',
      },
    })
    setInCorso(false)

    if (!esito.ok) {
      notifica('Invio non riuscito: chiamaci per fissare l’appuntamento.')
      return
    }

    setConferma(
      `Richiesta inviata per ${dataEstesa(scelto)} alle ${fascia}. Ti confermiamo l’appuntamento per telefono o e-mail entro poche ore.`,
    )
    notifica('Richiesta di appuntamento inviata.')
  }

  return (
    <div ref={rif}>
      <Sezione griglia>
        <div className="wrap" style={{ maxWidth: 900, padding: 0 }}>
          <Intestazione
            occhiello="Appuntamenti"
          principale
            titolo="Scegli quando passare."
            testo="Prenotando eviti l'attesa: il banco è già libero e il tecnico ti aspetta con la scheda pronta."
          />

          <div className="card reveal">
            <form onSubmit={invia} noValidate>
              <Avviso visibile={!!conferma}>{conferma}</Avviso>

              <div className="form-grid">
                <Campo etichetta="Servizio" id="b-servizio">
                  <select className="inp" id="b-servizio" value={servizio} onChange={(e) => setServizio(e.target.value)}>
                    {SERVIZI_APPUNTAMENTO.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Campo>
                <Campo etichetta="Giorno" id="b-giorno">
                  <select
                    className="inp"
                    id="b-giorno"
                    value={giorno}
                    onChange={(e) => {
                      setGiorno(Number(e.target.value))
                      setFascia(null)
                    }}
                  >
                    {giorni.map((d, i) => (
                      <option key={d.toISOString()} value={i}>
                        {dataEstesa(d)}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>

              <Campo etichetta="Orario disponibile" id="b-orari" errore={errori.fascia}>
                <div className="slots" id="b-orari">
                  {FASCE.map((f, i) => (
                    <button
                      key={f}
                      type="button"
                      disabled={occupata(i)}
                      className={cn(fascia === f && 'is-on')}
                      onClick={() => setFascia(f)}
                      aria-pressed={fascia === f}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </Campo>

              <div className="form-grid" style={{ marginTop: 6 }}>
                <Campo etichetta="Nome e cognome" id="b-nome" obbligatorio errore={errori.nome}>
                  <input className="inp" id="b-nome" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
                </Campo>
                <Campo etichetta="Telefono" id="b-tel" obbligatorio errore={errori.telefono}>
                  <input
                    className="inp"
                    id="b-tel"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    autoComplete="tel"
                  />
                </Campo>
                <Campo etichetta="E-mail" id="b-mail" intero aiuto="Facoltativa: la usiamo per il promemoria.">
                  <input
                    className="inp"
                    id="b-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </Campo>
              </div>

              <label className="check">
                <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
                <span>
                  Acconsento al trattamento dei dati secondo l’<Link className="link" to="/privacy">informativa privacy</Link>.{' '}
                  <span style={{ color: 'var(--alert)' }}>*</span>
                </span>
              </label>
              {errori.privacy && (
                <small className="field__err" style={{ display: 'block', marginTop: 6 }}>
                  {errori.privacy}
                </small>
              )}

              <input {...propsEsca} value={esca} onChange={(e) => setEsca(e.target.value)} />
              <Bottone type="submit" largo style={{ marginTop: 18 }} disabled={inCorso}>
                {inCorso ? 'Invio in corso…' : 'Richiedi appuntamento'}
              </Bottone>
            </form>
          </div>

          <p className="faint" style={{ fontSize: '.79rem', marginTop: 14 }}>
            Gli orari già occupati sono barrati. Per urgenze chiama direttamente: troviamo sempre uno spazio.
          </p>
        </div>
      </Sezione>
    </div>
  )
}
