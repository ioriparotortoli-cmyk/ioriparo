import { useState } from 'react'
import { Check, Save } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Campo, Input } from '@/components/ui/Form'
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import type { Azienda } from '@/types'

export function Impostazioni() {
  useIntestazione({
    titolo: 'Impostazioni',
    sottotitolo: 'Dati dell’attività e valori predefiniti dei documenti',
  })

  const { db, aggiornaAzienda } = useGestionale()
  const [form, setForm] = useState<Azienda>(db.azienda)
  const [salvato, setSalvato] = useState(false)

  function salva() {
    aggiornaAzienda({
      ...form,
      ivaPredefinita: Number(form.ivaPredefinita) || 0,
      giorniValiditaPreventivo: Number(form.giorniValiditaPreventivo) || 0,
    })
    setSalvato(true)
    window.setTimeout(() => setSalvato(false), 2500)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            titolo="Dati aziendali"
            sottotitolo="Compaiono su schede di accettazione, preventivi e fatture"
          />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Campo etichetta="Denominazione" className="sm:col-span-2">
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </Campo>
            <Campo etichetta="Claim" className="sm:col-span-2">
              <Input
                value={form.claim}
                onChange={(e) => setForm({ ...form, claim: e.target.value })}
              />
            </Campo>
            <Campo etichetta="Indirizzo">
              <Input
                value={form.indirizzo}
                onChange={(e) => setForm({ ...form, indirizzo: e.target.value })}
              />
            </Campo>
            <Campo etichetta="CAP e città">
              <Input
                value={form.citta}
                onChange={(e) => setForm({ ...form, citta: e.target.value })}
              />
            </Campo>
            <Campo etichetta="Telefono">
              <Input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </Campo>
            <Campo etichetta="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Campo>
            <Campo etichetta="Partita IVA" className="sm:col-span-2">
              <Input
                value={form.partitaIva}
                onChange={(e) => setForm({ ...form, partitaIva: e.target.value })}
              />
            </Campo>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader titolo="Documenti" sottotitolo="Valori applicati ai nuovi documenti" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Campo etichetta="IVA predefinita (%)">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.ivaPredefinita}
                  onChange={(e) =>
                    setForm({ ...form, ivaPredefinita: Number(e.target.value) })
                  }
                />
              </Campo>
              <Campo etichetta="Validità preventivi (giorni)">
                <Input
                  type="number"
                  min={0}
                  value={form.giorniValiditaPreventivo}
                  onChange={(e) =>
                    setForm({ ...form, giorniValiditaPreventivo: Number(e.target.value) })
                  }
                />
              </Campo>
              <Campo
                etichetta="Prefisso codice riparazione"
                aiuto="Usato per numerare le accettazioni, es. #24-0001"
                className="sm:col-span-2"
              >
                <Input
                  value={form.prefissoCodice}
                  onChange={(e) => setForm({ ...form, prefissoCodice: e.target.value })}
                />
              </Campo>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {salvato && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <Check size={16} />
            Impostazioni salvate
          </span>
        )}
        <Button variante="primario" onClick={salva}>
          <Save size={15} />
          Salva impostazioni
        </Button>
      </div>

    </div>
  )
}
