import { Galleria } from '../componenti/Galleria'
import { Intestazione, Sezione } from '../componenti/base'
import { useRivela } from '../lib/hook'
import { briciole, useSeo } from '../lib/seo'

export function GalleriaPagina() {
  const rif = useRivela<HTMLDivElement>()

  useSeo({
    titolo: 'Galleria lavori — laboratorio e impianti | Io Riparo',
    descrizione:
      'Riparazioni eseguite in laboratorio, impianti di videosorveglianza e reti installate presso aziende e attività commerciali di Tortolì e dell’Ogliastra.',
    percorso: '/galleria',
    datiStrutturati: briciole([
      { nome: 'Home', percorso: '/' },
      { nome: 'Galleria', percorso: '/galleria' },
    ]),
  })

  return (
    <div ref={rif}>
      <Sezione griglia>
        <Intestazione
          occhiello="Galleria"
          titolo={
            <>
              Lavori eseguiti,
              <br />
              raccontati dove nascono.
            </>
          }
          testo="Banco di riparazione, impianti installati e dettagli degli interventi. Apri un'immagine e scorri con le frecce della tastiera."
        />
        <Galleria filtrabile />
      </Sezione>
    </div>
  )
}
