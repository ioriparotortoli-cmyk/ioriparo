import type { ReactNode } from 'react'
import { AZIENDA, TELEFONO_E164, messaggioWhatsapp } from '../dati/azienda'
import { cn } from '../lib/utili'
import { Icona } from './Icona'
import { useNotifica } from './Notifiche'

/** Sui dispositivi senza telefono integrato il `tel:` spesso non apre nulla. */
const puoChiamare = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(hover: none) and (pointer: coarse)').matches || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))

/**
 * Comportamento comune a ogni collegamento telefonico del sito.
 *
 * Su smartphone e tablet il collegamento `tel:` apre direttamente il tastierino
 * con il numero già composto. Su computer, dove il protocollo spesso non è
 * associato ad alcun programma e il clic sembrerebbe non fare nulla, il numero
 * viene copiato negli appunti e mostrato a schermo: l'azione ha comunque un
 * effetto visibile e utile.
 */
export function useChiamata() {
  const notifica = useNotifica()

  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (puoChiamare()) return // il sistema apre il tastierino: nulla da fare

    e.preventDefault()
    navigator.clipboard
      ?.writeText(AZIENDA.telefono)
      .then(() => notifica(`Numero copiato: ${AZIENDA.telefono}`))
      .catch(() => notifica(`Chiamaci allo ${AZIENDA.telefono}`))
  }
}

/** Indirizzo `tel:` del laboratorio, con il numero in formato internazionale. */
export const TEL = `tel:${TELEFONO_E164}`

/** Pulsante "Chiama ora". */
export function BottoneChiama({
  variante = 'ghost',
  piccolo,
  largo,
  children,
  className,
}: {
  variante?: 'pieno' | 'ghost' | 'soft'
  piccolo?: boolean
  largo?: boolean
  children?: ReactNode
  className?: string
}) {
  const gestisci = useChiamata()

  return (
    <a
      href={TEL}
      onClick={gestisci}
      className={cn('btn', variante !== 'pieno' && `btn--${variante}`, piccolo && 'btn--sm', largo && 'btn--wide', className)}
      aria-label={`Chiama Io Riparo al numero ${AZIENDA.telefono}`}
      title={AZIENDA.telefono}
    >
      <Icona nome="call" dimensione={piccolo ? 15 : 17} />
      {children ?? 'Chiama ora'}
    </a>
  )
}

/** Pulsante WhatsApp con messaggio già impostato. */
export function BottoneWhatsapp({
  testo,
  variante = 'ghost',
  piccolo,
  largo,
  children,
}: {
  /** Prima riga del messaggio che il cliente si ritrova già scritta */
  testo?: string
  variante?: 'pieno' | 'ghost' | 'soft'
  piccolo?: boolean
  largo?: boolean
  children?: ReactNode
}) {
  return (
    <a
      href={testo ? messaggioWhatsapp(testo) : messaggioWhatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('btn', variante !== 'pieno' && `btn--${variante}`, piccolo && 'btn--sm', largo && 'btn--wide')}
      aria-label={`Scrivi su WhatsApp al numero ${AZIENDA.cellulare}`}
      title={AZIENDA.cellulare}
    >
      <Icona nome="wa" dimensione={piccolo ? 15 : 17} pieno />
      {children ?? 'WhatsApp'}
    </a>
  )
}
