import { Fragment } from 'react'
import { citazioneDelGiorno } from '@/lib/citazioni'

/**
 * La frase del giorno sotto alla scheda pratica, nell'apertura della home.
 *
 * Le parole compaiono una alla volta invece che la riga intera. Ognuna occupa
 * il suo spazio fin da subito e cambia solo opacità: così mentre appare non si
 * allunga niente e la pagina non si muove sotto agli occhi di chi sta già
 * leggendo. Il testo completo resta nel documento, quindi un lettore di
 * schermo lo legge tutto insieme senza aspettare la comparsa.
 */
export function FraseDelGiorno() {
  const citazione = citazioneDelGiorno()
  const parole = citazione.testo.split(' ')

  return (
    <figure className="frase">
      <blockquote>
        {parole.map((parola, i) => (
          // Lo spazio sta fuori dallo `span`: dentro a un elemento
          // `inline-block` verrebbe scartato e le parole si attaccherebbero.
          <Fragment key={i}>
            <span className="frase__parola" style={{ animationDelay: `${i * 55}ms` }}>
              {parola}
            </span>{' '}
          </Fragment>
        ))}
      </blockquote>
      <figcaption
        className="frase__parola"
        style={{ animationDelay: `${parole.length * 55 + 150}ms` }}
      >
        Steve Jobs · {citazione.fonte}
      </figcaption>
    </figure>
  )
}
