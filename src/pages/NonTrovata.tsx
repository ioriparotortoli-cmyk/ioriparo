import { LinkButton } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useIntestazione } from '@/components/layout/intestazione'

export function NonTrovata() {
  useIntestazione({ titolo: 'Pagina non trovata' })

  return (
    <Card className="mx-auto max-w-lg text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h2 className="mt-3 text-lg font-semibold text-ink">Pagina non trovata</h2>
      <p className="mt-2 text-sm text-ink-muted">
        L’indirizzo richiesto non esiste o è stato spostato.
      </p>
      <LinkButton to="/" variante="primario" className="mt-5">
        Torna alla dashboard
      </LinkButton>
    </Card>
  )
}
