import { useMemo, useState } from 'react'
import { Check, LogOut, Save, ShieldCheck } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Campo, Checkbox, Input, Select } from '@/components/ui/Form'
import { Badge } from '@/components/ui/Badge'
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import type { PreferenzeUtente, Utente } from '@/types'

/** Pagine su cui si può aprire il gestionale all'accesso. */
const PAGINE_INIZIALI = [
  { valore: '/gestionale', etichetta: 'Dashboard' },
  { valore: '/gestionale/riparazioni', etichetta: 'Riparazioni' },
  { valore: '/gestionale/clienti', etichetta: 'Clienti' },
  { valore: '/gestionale/scadenze', etichetta: 'Scadenze e promemoria' },
  { valore: '/gestionale/magazzino', etichetta: 'Magazzino' },
]

const iniziali = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')

/**
 * Profilo personale: **solo** i dati di chi usa il gestionale e le preferenze
 * del suo account. I dati dell'attività (denominazione, partita IVA, IVA
 * predefinita) stanno nelle Impostazioni, che riguardano l'azienda e non la
 * persona.
 */
export function Profilo() {
  useIntestazione({ titolo: 'Profilo personale', sottotitolo: 'I tuoi dati e le preferenze dell’account' })

  const { db, aggiornaUtente, aggiornaPreferenze } = useGestionale()
  const [form, setForm] = useState<Utente>(db.utente)
  const [salvato, setSalvato] = useState(false)

  const modificato = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(db.utente),
    [form, db.utente],
  )

  function salva() {
    const { preferenze, ...anagrafica } = form
    aggiornaUtente({ ...anagrafica, iniziali: anagrafica.iniziali?.trim() || iniziali(anagrafica.nome) })
    aggiornaPreferenze(preferenze)
    setSalvato(true)
    window.setTimeout(() => setSalvato(false), 2500)
  }

  const preferenza = (modifiche: Partial<PreferenzeUtente>) =>
    setForm({ ...form, preferenze: { ...form.preferenze, ...modifiche } })

  return (
    <div className="space-y-4">
      {/* ── Intestazione del profilo ── */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <span
            className="grid size-16 shrink-0 place-items-center rounded-full bg-brand/15 text-xl font-semibold text-brand"
            aria-hidden="true"
          >
            {form.iniziali?.trim() || iniziali(form.nome) || '—'}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-ink">{form.nome || 'Senza nome'}</h2>
            <p className="truncate text-sm text-ink-muted">{form.email}</p>
          </div>
          <Badge>{form.ruolo || 'Ruolo non indicato'}</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* ── Dati personali ── */}
        <Card>
          <CardHeader
            titolo="I tuoi dati"
            sottotitolo="Compaiono nell’intestazione e sulle pratiche che apri tu"
          />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Campo etichetta="Nome e cognome" className="sm:col-span-2">
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} autoComplete="name" />
            </Campo>
            <Campo etichetta="Ruolo">
              <Input
                value={form.ruolo}
                onChange={(e) => setForm({ ...form, ruolo: e.target.value })}
                placeholder="Titolare, Tecnico…"
              />
            </Campo>
            <Campo etichetta="Iniziali" aiuto="Lasciale vuote per ricavarle dal nome">
              <Input
                value={form.iniziali ?? ''}
                onChange={(e) => setForm({ ...form, iniziali: e.target.value.slice(0, 3) })}
                maxLength={3}
              />
            </Campo>
            <Campo etichetta="E-mail">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </Campo>
            <Campo etichetta="Telefono">
              <Input
                type="tel"
                value={form.telefono ?? ''}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                autoComplete="tel"
              />
            </Campo>
          </div>
        </Card>

        {/* ── Preferenze dell'account ── */}
        <Card>
          <CardHeader titolo="Preferenze" sottotitolo="Valgono solo per il tuo accesso" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Campo etichetta="Tema">
              <Select
                value={form.preferenze.tema}
                onChange={(e) => preferenza({ tema: e.target.value as PreferenzeUtente['tema'] })}
              >
                <option value="sistema">Come il sistema</option>
                <option value="chiaro">Chiaro</option>
                <option value="scuro">Scuro</option>
              </Select>
            </Campo>
            <Campo etichetta="Pagina di apertura">
              <Select
                value={form.preferenze.paginaIniziale}
                onChange={(e) => preferenza({ paginaIniziale: e.target.value })}
              >
                {PAGINE_INIZIALI.map((p) => (
                  <option key={p.valore} value={p.valore}>
                    {p.etichetta}
                  </option>
                ))}
              </Select>
            </Campo>
            <Campo etichetta="Righe per pagina negli elenchi">
              <Select
                value={String(form.preferenze.righePerPagina)}
                onChange={(e) => preferenza({ righePerPagina: Number(e.target.value) })}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </Campo>
          </div>

          <div className="mt-4 space-y-2 border-t border-line-soft pt-4">
            <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">Avvisi</p>
            <Checkbox
              etichetta="Segnalami le scadenze in arrivo"
              checked={form.preferenze.avvisiScadenze}
              onChange={(e) => preferenza({ avvisiScadenze: e.target.checked })}
            />
            <Checkbox
              etichetta="Segnalami i ricambi sotto scorta"
              checked={form.preferenze.avvisiSottoScorta}
              onChange={(e) => preferenza({ avvisiSottoScorta: e.target.checked })}
            />
          </div>
        </Card>
      </div>

      {/* ── Accesso ── */}
      <Card>
        <CardHeader titolo="Accesso" sottotitolo="Sicurezza dell’account" />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-lg border border-line-soft bg-surface-2 px-3 py-2 text-sm text-ink-muted">
            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
            Accesso non ancora protetto da password
          </span>
          <Button disabled title="Disponibile quando il gestionale avrà un accesso vero">
            Cambia password
          </Button>
          <Button variante="fantasma" disabled title="Disponibile quando il gestionale avrà un accesso vero">
            <LogOut className="size-4" aria-hidden="true" />
            Esci
          </Button>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Il gestionale lavora sull’archivio locale di questo dispositivo e non ha ancora un sistema di
          accesso: chiunque apra questo indirizzo vede gli stessi dati. Password e uscita si attiveranno
          insieme all’autenticazione.
        </p>
      </Card>

      {/* ── Salvataggio ── */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variante="primario" onClick={salva} disabled={!modificato}>
          <Save className="size-4" aria-hidden="true" />
          Salva modifiche
        </Button>
        {modificato && (
          <Button variante="fantasma" onClick={() => setForm(db.utente)}>
            Annulla
          </Button>
        )}
        {salvato && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
            <Check className="size-4" aria-hidden="true" />
            Profilo aggiornato
          </span>
        )}
      </div>
    </div>
  )
}
