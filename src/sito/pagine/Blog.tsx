import { Link, Navigate, useParams } from 'react-router-dom'
import { AnteprimaArticolo } from '../componenti/AnteprimaArticolo'
import { Illustrazione } from '../componenti/Illustrazione'
import { Icona } from '../componenti/Icona'
import { Intestazione, LinkBottone, Sezione } from '../componenti/base'
import { ARTICOLI, trovaArticolo } from '../dati/blog'
import { useRivela } from '../lib/hook'
import { SITO_URL, briciole, useSeo } from '../lib/seo'
import { AZIENDA } from '../dati/azienda'

export function Blog() {
  const rif = useRivela<HTMLDivElement>()
  useSeo({
    titolo: 'Blog — guide e consigli dei tecnici | Io Riparo',
    descrizione:
      'Guide pratiche su riparazione smartphone e computer, reti Wi-Fi per hotel e B&B, videosorveglianza a norma e recupero dati. Scritte dai tecnici di Io Riparo.',
    percorso: '/blog',
    datiStrutturati: briciole([
      { nome: 'Home', percorso: '/' },
      { nome: 'Blog', percorso: '/blog' },
    ]),
  })

  return (
    <div ref={rif}>
      <Sezione griglia>
        <Intestazione
          occhiello="Blog"
          principale
          titolo={
            <>
              Guide, confronti
              <br />e consigli dal banco di lavoro.
            </>
          }
          testo="Articoli scritti dai tecnici che eseguono gli interventi, aggiornati quando cambiano i modelli e le procedure."
        />
        <div className="posts">
          {ARTICOLI.map((a) => (
            <AnteprimaArticolo key={a.slug} articolo={a} />
          ))}
        </div>
      </Sezione>
    </div>
  )
}

export function PaginaArticolo() {
  const { slug } = useParams()
  const articolo = trovaArticolo(slug)
  const rif = useRivela<HTMLDivElement>()

  useSeo({
    titolo: articolo ? `${articolo.titolo} | Io Riparo` : 'Articolo non trovato | Io Riparo',
    descrizione: articolo?.sommario ?? 'Articolo non disponibile.',
    percorso: `/blog/${slug ?? ''}`,
    tipo: 'article',
    datiStrutturati: articolo
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: articolo.titolo,
            description: articolo.sommario,
            datePublished: articolo.dataIso,
            dateModified: articolo.dataIso,
            author: { '@type': 'Organization', name: AZIENDA.nome },
            publisher: {
              '@type': 'Organization',
              name: AZIENDA.nome,
              logo: { '@type': 'ImageObject', url: `${SITO_URL}/marchio/logo.png` },
            },
            mainEntityOfPage: `${SITO_URL}/blog/${articolo.slug}`,
          },
          briciole([
            { nome: 'Home', percorso: '/' },
            { nome: 'Blog', percorso: '/blog' },
            { nome: articolo.titolo, percorso: `/blog/${articolo.slug}` },
          ]),
        ]
      : undefined,
  })

  if (!articolo) return <Navigate to="/blog" replace />

  const altri = ARTICOLI.filter((a) => a.slug !== articolo.slug)

  return (
    <div ref={rif}>
      <Sezione>
        <article className="article">
          <Link className="link" to="/blog" style={{ fontSize: '.85rem' }}>
            <Icona nome="left" dimensione={15} /> Tutti gli articoli
          </Link>

          <div className="post__meta" style={{ margin: '18px 0 12px' }}>
            <span style={{ color: 'var(--blue-glow)' }}>{articolo.categoria}</span>
            <span>·</span>
            <span>{articolo.data}</span>
            <span>·</span>
            <span>{articolo.lettura} di lettura</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.7rem)', lineHeight: 1.08, marginBottom: 18 }}>{articolo.titolo}</h1>
          <p className="lede" style={{ marginBottom: 28 }}>
            {articolo.sommario}
          </p>

          <div className="article__hero">
            <Illustrazione scena={articolo.scena} ritaglia style={{ width: '100%', height: '100%' }} />
          </div>

          {articolo.corpo.map((b, i) =>
            b.tipo === 'h' ? (
              <h2 key={i}>{b.testo}</h2>
            ) : b.tipo === 'elenco' ? (
              <ul key={i}>
                {b.voci.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            ) : (
              <p key={i}>{b.testo}</p>
            ),
          )}

          <div className="card card--glass" style={{ marginTop: 36, textAlign: 'center' }}>
            <h3>Hai un problema simile?</h3>
            <p className="muted" style={{ margin: '10px 0 18px', fontSize: '.94rem' }}>
              Diagnosi gratuita in sede o da remoto, preventivo scritto prima di ogni intervento.
            </p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <LinkBottone a="/preventivo">Richiedi preventivo</LinkBottone>
              <LinkBottone a="/contatti" variante="ghost">
                Contattaci
              </LinkBottone>
            </div>
          </div>

          <h2 style={{ marginTop: 46 }}>Continua a leggere</h2>
          <div className="posts" style={{ gridTemplateColumns: '1fr' }}>
            {altri.map((a) => (
              <AnteprimaArticolo key={a.slug} articolo={a} />
            ))}
          </div>
        </article>
      </Sezione>
    </div>
  )
}
