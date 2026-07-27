import { Link } from 'react-router-dom'
import { useGestionale } from '@/data/store'
import { AnteprimaArticolo } from '../componenti/AnteprimaArticolo'
import { CampoSegnale } from '../componenti/CampoSegnale'
import { Faq, schemaFaq } from '../componenti/Faq'
import { Galleria } from '../componenti/Galleria'
import { Icona } from '../componenti/Icona'
import { Illustrazione } from '../componenti/Illustrazione'
import { Recensioni } from '../componenti/Recensioni'
import { SchedaPratica } from '../componenti/SchedaPratica'
import { GrigliaServizi } from '../componenti/Servizi'
import { Chip, Ico, Intestazione, LinkBottone, LinkTesto, Sezione } from '../componenti/base'
import { AZIENDA, apertoOra, chiusuraOdierna } from '../dati/azienda'
import { ARTICOLI } from '../dati/blog'
import { MOTIVI, NUMERI, PROCESSO, SETTORI } from '../dati/contenuti'
import { useContatore, useRivela } from '../lib/hook'
import { useSeo } from '../lib/seo'
import { numero } from '../lib/utili'


const GARANZIE = [
  'Ricambi originali e compatibili AAA',
  'Riparazioni in giornata',
  'Garanzia 12 mesi sull’intervento',
  'Recupero dati eseguito internamente',
  'Preventivo gratuito e senza impegno',
  'Assistenza aziende con SLA dedicato',
  'Videosorveglianza a norma GDPR',
  'Certificazione degli impianti',
]

function Numero({ valore, suffisso, etichetta }: { valore: number; suffisso: string; etichetta: string }) {
  const [corrente, rif] = useContatore(valore)
  return (
    <div className="stat reveal">
      <b ref={rif}>
        {numero(corrente)}
        {suffisso}
      </b>
      <span>{etichetta}</span>
    </div>
  )
}

export function Home() {
  const rif = useRivela<HTMLDivElement>()
  const { db } = useGestionale()

  useSeo({
    titolo: 'Io Riparo — Riparazioni Smartphone, Computer e Soluzioni Tecnologiche',
    descrizione:
      'Riparazione smartphone, tablet, computer e notebook, recupero dati, videosorveglianza, reti aziendali e impianti Wi-Fi a Tortolì e in tutta l’Ogliastra. Preventivo gratuito, garanzia 12 mesi.',
    percorso: '/',
    datiStrutturati: schemaFaq(),
  })

  const aperto = apertoOra()
  const chiusura = chiusuraOdierna()

  /** In vetrina la pratica aperta più recente: è la stessa del gestionale. */
  const inLavorazione =
    db.riparazioni.find((r) => r.stato === 'in_lavorazione') ??
    db.riparazioni.find((r) => r.stato === 'pronto_per_ritiro') ??
    db.riparazioni[0]

  return (
    <div ref={rif}>
      {/* ── Apertura ── */}
      <div className="hero">
        <CampoSegnale />
        <div className="hero__glow" aria-hidden="true" />
        <div className="wrap">
          <div className="hero__grid">
            <div>
              <div className="hero__badges">
                <Chip variante={aperto ? 'blue' : 'alert'} punto>
                  {aperto && chiusura ? `Aperti oggi fino alle ${chiusura}` : 'Scrivici: rispondiamo domani mattina'}
                </Chip>
                <Chip>
                  <Icona nome="star" dimensione={13} pieno /> 4,9/5 su 214 recensioni
                </Chip>
                <Chip>Garanzia 12 mesi</Chip>
              </div>

              <h1>
                Riparazioni Smartphone, Computer e <span className="grad">Soluzioni Tecnologiche</span>
              </h1>
              <p className="lede">
                Esperienza, qualità e rapidità al servizio dei tuoi dispositivi. Laboratorio interno, ricambi
                certificati e assistenza dedicata ad aziende, hotel e attività commerciali.
              </p>

              <div className="hero__cta">
                <LinkBottone a="/preventivo">
                  Richiedi preventivo <Icona nome="arrow" dimensione={17} />
                </LinkBottone>
                <LinkBottone a="/contatti" variante="ghost">
                  Contattaci
                </LinkBottone>
              </div>

              <div className="hero__meta">
                <div>
                  <b>{new Date().getFullYear() - AZIENDA.fondata}+</b>
                  <span>Anni di attività</span>
                </div>
                <div>
                  <b>24h</b>
                  <span>Riparazioni express</span>
                </div>
                <div>
                  <b>18.400</b>
                  <span>Dispositivi riparati</span>
                </div>
              </div>
            </div>

            <div>
              {inLavorazione && (
                <SchedaPratica
                  riparazione={inLavorazione}
                  vetro
                  azioni={
                    <LinkBottone a="/stato-riparazione" variante="soft" piccolo>
                      Traccia la tua
                    </LinkBottone>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Garanzie ── */}
      <div className="trust">
        <div className="marquee">
          {[0, 1].map((copia) => (
            <div className="marquee__track" key={copia} aria-hidden={copia === 1}>
              {GARANZIE.map((g) => (
                <span key={g}>
                  <Icona nome="check" dimensione={16} /> {g}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Servizi ── */}
      <Sezione id="servizi" griglia>
        <Intestazione
          occhiello="Servizi · 12 specializzazioni"
          titolo={
            <>
              Un unico laboratorio
              <br />
              per dispositivi, reti e sicurezza.
            </>
          }
          testo="Dalla sostituzione di un display alla progettazione della rete di un hotel: stesso team, stessi standard, un solo referente tecnico."
        />
        <GrigliaServizi />
      </Sezione>

      {/* ── Perché sceglierci ── */}
      <Sezione tinta>
        <Intestazione
          occhiello="Perché Io Riparo"
          titolo={
            <>
              Motivi concreti,
              <br />
              zero promesse generiche.
            </>
          }
        />
        <div className="why-grid">
          {MOTIVI.map((m) => (
            <article className="why reveal" key={m.titolo}>
              <Ico nome={m.icona} />
              <div>
                <h3>{m.titolo}</h3>
                <p>{m.testo}</p>
              </div>
            </article>
          ))}
        </div>
      </Sezione>

      {/* ── Processo ── */}
      <Sezione>
        <Intestazione
          occhiello="Come lavoriamo · 4 passaggi"
          titolo={
            <>
              Dal primo contatto al ritiro,
              <br />
              sempre sotto controllo.
            </>
          }
        />
        <div className="flow">
          {PROCESSO.map((p, i) => (
            <article className="flow__item reveal" key={p.titolo}>
              <span className="flow__n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{p.titolo}</h3>
                <p>{p.testo}</p>
              </div>
            </article>
          ))}
        </div>
      </Sezione>

      {/* ── Numeri ── */}
      <Sezione tinta>
        <Intestazione
          occhiello="I numeri"
          titolo={
            <>
              Risultati misurati,
              <br />
              non slogan.
            </>
          }
        />
        <div className="stats">
          {NUMERI.map((n) => (
            <Numero key={n.etichetta} valore={n.valore} suffisso={n.suffisso} etichetta={n.etichetta.toUpperCase()} />
          ))}
        </div>
      </Sezione>

      {/* ── Aziende ── */}
      <Sezione>
        <div className="split">
          <div className="reveal">
            <span className="eyebrow">Aziende e attività</span>
            <h2 style={{ marginBlock: '14px 16px' }}>
              Tecnologia che non
              <br />
              può permettersi fermi.
            </h2>
            <p className="lede">
              Progettiamo, installiamo e manuteniamo l’infrastruttura tecnologica di hotel, B&amp;B, ristoranti, negozi
              e uffici: Wi-Fi che copre davvero ogni camera, videosorveglianza a norma e un numero solo da chiamare
              quando qualcosa si ferma.
            </p>
            <div className="row" style={{ marginTop: 24 }}>
              {SETTORI.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
            <div className="row" style={{ marginTop: 26 }}>
              <LinkBottone a="/servizi">Soluzioni per aziende</LinkBottone>
              <LinkTesto a="/contatti">Parla con un tecnico</LinkTesto>
            </div>
          </div>

          <div className="reveal">
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <Illustrazione scena="shop" style={{ width: '100%' }} />
              <div style={{ padding: 20, display: 'grid', gap: 14 }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <Chip variante="ok" punto>
                    Contratto attivo
                  </Chip>
                  <span className="mono faint" style={{ fontSize: '.76rem' }}>
                    SLA 4 ORE
                  </span>
                </div>
                <div className="hours">
                  <div>
                    <b>Hotel Federico II · 48 camere</b>
                    <span>Wi-Fi + TVCC</span>
                  </div>
                  <div>
                    <b>Uptime rete 12 mesi</b>
                    <span style={{ color: 'var(--ok)' }}>99,94%</span>
                  </div>
                  <div>
                    <b>Interventi nell’ultimo anno</b>
                    <span>17 · nessun disservizio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sezione>

      {/* ── Tracking ── */}
      <Sezione tinta>
        <div className="split">
          <div className="reveal">
            <span className="eyebrow">Stato riparazione</span>
            <h2 style={{ marginBlock: '14px 16px' }}>
              Il tuo dispositivo,
              <br />
              in tempo reale.
            </h2>
            <p className="lede">
              Ogni riparazione ha un codice pratica. Inseriscilo per sapere a che punto siamo, quanto costa e quando
              puoi passare a ritirare — senza telefonare.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', display: 'grid', gap: 11 }}>
              {[
                'Aggiornamento automatico a ogni cambio di stato',
                'Preventivo approvabile online in un clic',
                'Notifica e-mail e, a breve, anche su WhatsApp',
              ].map((v) => (
                <li className="row" style={{ gap: 10 }} key={v}>
                  <span className="ico" style={{ width: 30, height: 30, borderRadius: 9 }}>
                    <Icona nome="check" dimensione={15} />
                  </span>
                  <span className="muted" style={{ fontSize: '.92rem' }}>
                    {v}
                  </span>
                </li>
              ))}
            </ul>
            <div className="row" style={{ marginTop: 26 }}>
              <LinkBottone a="/stato-riparazione" variante="ghost">
                Verifica una pratica
              </LinkBottone>
            </div>
          </div>
          <div className="reveal">
            {db.riparazioni.find((r) => r.stato === 'pronto_per_ritiro') && (
              <SchedaPratica riparazione={db.riparazioni.find((r) => r.stato === 'pronto_per_ritiro')!} />
            )}
          </div>
        </div>
      </Sezione>

      {/* ── Galleria ── */}
      <Sezione>
        <Intestazione
          occhiello="Galleria"
          titolo={
            <>
              Il laboratorio,
              <br />
              gli impianti, il lavoro finito.
            </>
          }
          testo="Interventi reali eseguiti dal nostro team. Clicca su un'immagine per aprirla."
        />
        <Galleria limite={6} />
        <div className="row" style={{ marginTop: 26 }}>
          <LinkBottone a="/galleria" variante="ghost">
            Vedi tutta la galleria
          </LinkBottone>
        </div>
      </Sezione>

      {/* ── Recensioni ── */}
      <Sezione tinta>
        <Intestazione
          occhiello="Recensioni · Google"
          titolo="4,9 su 5 da 214 clienti."
          testo="Le opinioni pubblicate sul nostro profilo Google Business, senza filtri."
        />
        <Recensioni />
      </Sezione>

      {/* ── Domande frequenti ── */}
      <Sezione id="domande">
        <div className="split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <span className="eyebrow">Domande frequenti</span>
            <h2 style={{ marginBlock: '14px 16px' }}>
              Le risposte che
              <br />
              ci chiedono più spesso.
            </h2>
            <p className="lede">
              Non trovi quello che cerchi? Scrivici su WhatsApp: rispondiamo entro pochi minuti negli orari di apertura.
            </p>
            <div style={{ marginTop: 22 }}>
              <LinkBottone a="/contatti" variante="ghost">
                Fai una domanda
              </LinkBottone>
            </div>
          </div>
          <Faq />
        </div>
      </Sezione>

      {/* ── Blog ── */}
      <Sezione tinta>
        <Intestazione
          occhiello="Dal blog"
          titolo={
            <>
              Guide pratiche
              <br />
              scritte dai nostri tecnici.
            </>
          }
        />
        <div className="posts">
          {ARTICOLI.map((a) => (
            <AnteprimaArticolo key={a.slug} articolo={a} />
          ))}
        </div>
        <div className="row" style={{ marginTop: 28 }}>
          <LinkBottone a="/blog" variante="ghost">
            Tutti gli articoli
          </LinkBottone>
        </div>
      </Sezione>

      {/* ── Invito finale ── */}
      <Sezione>
        <div
          className="card card--glass reveal"
          style={{ padding: 'clamp(28px,5vw,58px)', textAlign: 'center', display: 'grid', gap: 18, placeItems: 'center' }}
        >
          <div className="blueprint" aria-hidden="true" style={{ opacity: 0.8 }} />
          <span className="eyebrow" style={{ position: 'relative' }}>
            Iniziamo
          </span>
          <h2 style={{ position: 'relative' }}>
            Dicci cosa non funziona.
            <br />
            Al resto pensiamo noi.
          </h2>
          <p className="lede" style={{ position: 'relative', textAlign: 'center' }}>
            Preventivo gratuito in giornata, ritiro e consegna disponibili in zona per aziende e attività commerciali.
          </p>
          <div className="row" style={{ position: 'relative', justifyContent: 'center', marginTop: 6 }}>
            <LinkBottone a="/preventivo">Richiedi preventivo</LinkBottone>
            <LinkBottone a="/prenota" variante="ghost">
              Prenota un appuntamento
            </LinkBottone>
            <Link className="btn btn--ghost" to="/contatti">
              Contattaci
            </Link>
          </div>
        </div>
      </Sezione>
    </div>
  )
}
