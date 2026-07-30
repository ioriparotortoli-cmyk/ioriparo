import { cn } from '@/lib/cn'
import { useGestionale } from '@/data/store'

/**
 * Marchio dell'attività nella barra laterale.
 *
 * Arriva dall'archivio, non da un file dentro al programma: ogni installazione
 * ha il suo, caricato dalle impostazioni. Un file fisso avrebbe mostrato il
 * marchio di Io Riparo a chiunque altro usasse il gestionale.
 *
 * Finché non ne è stato caricato uno si ripiega sul nome dell'attività scritto
 * a parole — mai su un marchio di riserva, che sarebbe quello sbagliato.
 */
export function Logo({
  compatto,
  senzaTesto,
  className,
}: {
  compatto?: boolean
  /** Nel piede della barra il nome è già scritto sotto: qui si ripeterebbe. */
  senzaTesto?: boolean
  className?: string
}) {
  const { db } = useGestionale()
  const altezza = compatto ? 30 : 42

  if (db.azienda.logo) {
    return (
      <span className={cn('flex items-center', className)}>
        <img
          src={db.azienda.logo}
          alt={db.azienda.nome || 'Marchio dell’attività'}
          style={{ height: altezza, width: 'auto', maxWidth: 190, objectFit: 'contain' }}
        />
      </span>
    )
  }

  if (senzaTesto) return null

  return (
    <span
      className={cn('truncate font-bold tracking-tight text-ink', className)}
      style={{ fontSize: compatto ? 14 : 17 }}
    >
      {db.azienda.nome || 'Gestionale'}
    </span>
  )
}
