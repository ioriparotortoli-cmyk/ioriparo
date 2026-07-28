import { useEffect, useRef, useState } from 'react'
import { AZIENDA, GARANZIA, INDIRIZZO_COMPLETO } from '../dati/azienda'
import { cn } from '../lib/utili'
import { Icona } from './Icona'

interface Messaggio {
  id: number
  testo: string
  mio?: boolean
}

/** Risposte automatiche: coprono le domande più frequenti in negozio. */
const RISPOSTE: [RegExp, string][] = [
  [
    /display|schermo|vetro|rott/i,
    'La sostituzione del display parte da 69 € per gli smartphone di fascia media e da 129 € per i top di gamma con OLED. Dimmi marca e modello e ti do la cifra esatta: se il ricambio è a magazzino lo montiamo in un’ora.',
  ],
  [
    /batteri/i,
    'Sostituzione batteria da 39 €, in circa 45 minuti. Prima misuriamo capacità residua e cicli: se la batteria è ancora sana te lo diciamo e non spendi nulla.',
  ],
  [
    /tempi|quanto tempo|quando/i,
    'Display e batterie in giornata, spesso in un’ora. Guasti su scheda madre o danni da liquidi 24–72 ore. Recupero dati 2–5 giorni. Per gli impianti fissiamo un sopralluogo entro 48 ore.',
  ],
  [
    /wifi|wi-fi|rete|access point|internet/i,
    'Per reti e Wi-Fi facciamo sempre un sopralluogo gratuito con misurazione della copertura. Un access point professionale installato e configurato parte da 240 €. Mi dici quanti metri quadri e quanti piani?',
  ],
  [
    /telecamer|videosorvegli|sicurezza/i,
    'Un impianto da 4 telecamere IP con registratore e installazione parte da 690 €, con garanzia di legge sugli apparati — 24 mesi con scontrino, 12 con fattura — e configurazione a norma Garante Privacy inclusa. Vuoi fissare un sopralluogo gratuito?',
  ],
  [
    /dati|recupero|hard disk|ssd/i,
    'Recuperiamo dati da hard disk, SSD, schede di memoria e RAID. La prima analisi è gratuita: ti diciamo cosa è recuperabile prima di iniziare. Interventi da 99 €.',
  ],
  [/dove|indirizzo|sede|orari|aperto/i, `Siamo in ${INDIRIZZO_COMPLETO}. Aperti lun–ven 9:00–13:00 e 16:00–19:30, sabato 9:00–13:00.`],
  [
    /prezz|cost|quanto/i,
    'Dipende dal modello, ma la diagnosi è sempre gratuita e il preventivo è scritto prima di toccare qualsiasi cosa. Se mi dici dispositivo e guasto ti do subito una fascia di prezzo.',
  ],
  [
    /garanzia/i,
    `${GARANZIA.riparazioni} ${GARANZIA.vendita} La durata del tuo intervento è scritta sulla ricevuta.`,
  ],
  [
    /preventiv/i,
    'Puoi compilare il preventivo online in tre passaggi: ti mostra subito una fascia di prezzo e ci arriva la richiesta. Ti richiamiamo in giornata.',
  ],
  [
    /stato|pratica|tracking|riparazione mia/i,
    'Dalla pagina “Stato riparazione” puoi inserire il codice pratica che trovi sulla ricevuta e vedere a che punto siamo, in tempo reale.',
  ],
]

const SUGGERIMENTI = ['Quanto costa un display?', 'Tempi di riparazione', 'Preventivo per rete Wi-Fi', 'Dove siete?']

const RISPOSTA_PREDEFINITA = `Grazie! Per questa richiesta ti passo un tecnico: chiamaci allo ${AZIENDA.telefono} oppure scrivici su WhatsApp al ${AZIENDA.cellulare} e ti rispondiamo entro pochi minuti.`

export function Chat({ aperta, onChiudi }: { aperta: boolean; onChiudi: () => void }) {
  const [messaggi, setMessaggi] = useState<Messaggio[]>([
    { id: 0, testo: 'Ciao! Sono l’assistenza Io Riparo. Come possiamo aiutarti?' },
  ])
  const [scrive, setScrive] = useState(false)
  const [testo, setTesto] = useState('')
  const corpo = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    corpo.current?.scrollTo({ top: corpo.current.scrollHeight })
  }, [messaggi, scrive])

  useEffect(() => {
    if (aperta) campo.current?.focus()
  }, [aperta])

  const invia = (domanda: string) => {
    const pulita = domanda.trim()
    if (!pulita) return
    setMessaggi((p) => [...p, { id: Date.now(), testo: pulita, mio: true }])
    setTesto('')
    setScrive(true)
    const risposta = RISPOSTE.find(([re]) => re.test(pulita))?.[1] ?? RISPOSTA_PREDEFINITA
    setTimeout(() => {
      setScrive(false)
      setMessaggi((p) => [...p, { id: Date.now() + 1, testo: risposta }])
    }, 850)
  }

  return (
    <div className={cn('chat', aperta && 'is-on')} role="dialog" aria-label="Chat con l'assistenza">
      <div className="chat__hd">
        <span
          className="avatar"
          style={{ background: 'linear-gradient(140deg,#29abe2,#0071bc)', width: 36, height: 36 }}
          aria-hidden="true"
        >
          IR
        </span>
        <div style={{ flex: 1 }}>
          <b>Assistenza Io Riparo</b>
          <span>
            <span
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)', display: 'inline-block' }}
            />
            Online · risposta in pochi minuti
          </span>
        </div>
        <button className="iconbtn" onClick={onChiudi} aria-label="Chiudi la chat">
          <Icona nome="x" />
        </button>
      </div>

      <div className="chat__body" ref={corpo}>
        {messaggi.map((m) => (
          <div key={m.id} className={cn('bubble', m.mio ? 'bubble--out' : 'bubble--in')}>
            {m.testo}
          </div>
        ))}
        {scrive && (
          <div className="bubble bubble--in faint" aria-live="polite">
            sta scrivendo…
          </div>
        )}
      </div>

      <div className="chat__quick">
        {SUGGERIMENTI.map((s) => (
          <button key={s} onClick={() => invia(s)}>
            {s}
          </button>
        ))}
      </div>

      <form
        className="chat__in"
        onSubmit={(e) => {
          e.preventDefault()
          invia(testo)
        }}
      >
        <input
          ref={campo}
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Scrivi un messaggio…"
          aria-label="Messaggio"
        />
        <button
          className="iconbtn"
          type="submit"
          aria-label="Invia"
          style={{ background: 'var(--blue)', color: '#fff', borderColor: 'transparent' }}
        >
          <Icona nome="arrow" />
        </button>
      </form>
    </div>
  )
}
