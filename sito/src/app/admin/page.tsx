import Link from 'next/link'
import { CalendarClock, FileText, MessageCircle, TrendingUp } from 'lucide-react'
import { AvvisoConfigurazione, Pannello, Stato, Vuoto } from '@/components/admin/comuni'
import { supabaseServer } from '@/lib/supabase/server'
import { dataOra, euro, giorno } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Conteggio = { stato: string }

const mesiBrevi = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']

export default async function PannelloRiepilogo() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const oggi = new Date().toISOString().slice(0, 10)
  const seiMesiFa = new Date()
  seiMesiFa.setMonth(seiMesiFa.getMonth() - 5, 1)

  const [preventivi, messaggi, storico, prossimi, ultimi] = await Promise.all([
    supabase.from('preventivi').select('stato'),
    supabase.from('messaggi').select('id', { count: 'exact', head: true }).eq('stato', 'nuovo'),
    supabase.from('preventivi').select('creato_il,prezzo').gte('creato_il', seiMesiFa.toISOString()),
    supabase
      .from('appuntamenti')
      .select('id,nome,servizio,data,ora,modalita,stato')
      .gte('data', oggi)
      .neq('stato', 'annullato')
      .order('data', { ascending: true })
      .limit(5),
    supabase
      .from('preventivi')
      .select('id,riferimento,nome,dispositivo,stato,creato_il')
      .order('creato_il', { ascending: false })
      .limit(5),
  ])

  const perStato = (righe: Conteggio[] | null, stato: string) =>
    (righe ?? []).filter((riga) => riga.stato === stato).length

  const totalePreventivi = preventivi.data?.length ?? 0
  const accettati = perStato(preventivi.data as Conteggio[] | null, 'accettato')
  const conversione = totalePreventivi > 0 ? Math.round((accettati / totalePreventivi) * 100) : 0

  const incassato = (storico.data ?? []).reduce(
    (totale: number, riga: { prezzo: number | null }) => totale + (riga.prezzo ?? 0),
    0,
  )

  // Andamento delle richieste negli ultimi sei mesi.
  const mesi = Array.from({ length: 6 }, (_, indice) => {
    const data = new Date()
    data.setMonth(data.getMonth() - (5 - indice), 1)
    return { chiave: `${data.getFullYear()}-${data.getMonth()}`, etichetta: mesiBrevi[data.getMonth()], valore: 0 }
  })

  ;(storico.data ?? []).forEach((riga: { creato_il: string }) => {
    const data = new Date(riga.creato_il)
    const voce = mesi.find((mese) => mese.chiave === `${data.getFullYear()}-${data.getMonth()}`)
    if (voce) voce.valore += 1
  })

  const massimo = Math.max(1, ...mesi.map((mese) => mese.valore))

  const schede = [
    {
      etichetta: 'Preventivi da lavorare',
      valore: perStato(preventivi.data as Conteggio[] | null, 'nuovo'),
      icona: FileText,
      href: '/admin/preventivi',
    },
    {
      etichetta: 'Appuntamenti in arrivo',
      valore: prossimi.data?.length ?? 0,
      icona: CalendarClock,
      href: '/admin/appuntamenti',
    },
    { etichetta: 'Messaggi non letti', valore: messaggi.count ?? 0, icona: MessageCircle, href: '/admin/messaggi' },
    { etichetta: 'Preventivi accettati', valore: `${conversione}%`, icona: TrendingUp, href: '/admin/preventivi' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Riepilogo</h1>
        <p className="mt-1 text-sm testo-tenue">Stato delle richieste e attività degli ultimi sei mesi.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {schede.map((scheda) => (
          <li key={scheda.etichetta}>
            <Link
              href={scheda.href}
              className="block rounded-3xl border border-[color:var(--bordo)] bg-[color:var(--superficie)] p-5 transition-all hover:-translate-y-1 hover:border-elettrico-500/50"
            >
              <scheda.icona className="h-5 w-5 text-elettrico-400" aria-hidden="true" />
              <p className="mt-4 text-3xl font-extrabold tracking-tight">{scheda.valore}</p>
              <p className="mt-1 text-xs testo-tenue">{scheda.etichetta}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-2">
        <Pannello
          titolo="Richieste di preventivo"
          descrizione={`Ultimi sei mesi · valore preventivato ${euro(incassato)}`}
        >
          <div className="flex h-48 items-end gap-3">
            {mesi.map((mese) => (
              <div key={mese.chiave} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold testo-tenue">{mese.valore}</span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-elettrico-700 to-elettrico-400 transition-all"
                  style={{ height: `${Math.max(4, (mese.valore / massimo) * 100)}%` }}
                  role="img"
                  aria-label={`${mese.valore} preventivi a ${mese.etichetta}`}
                />
                <span className="text-xs testo-tenue">{mese.etichetta}</span>
              </div>
            ))}
          </div>
        </Pannello>

        <Pannello titolo="Prossimi appuntamenti">
          {(prossimi.data ?? []).length === 0 ? (
            <Vuoto testo="Nessun appuntamento in programma." />
          ) : (
            <ul className="space-y-3">
              {(prossimi.data ?? []).map(
                (riga: {
                  id: string
                  nome: string
                  servizio: string
                  data: string
                  ora: string
                  modalita: string
                  stato: string
                }) => (
                  <li
                    key={riga.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--bordo)] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{riga.nome}</p>
                      <p className="truncate text-xs testo-tenue">
                        {riga.servizio} · {riga.modalita}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{riga.ora}</p>
                      <p className="text-xs testo-tenue">{giorno(riga.data)}</p>
                    </div>
                    <Stato valore={riga.stato} />
                  </li>
                ),
              )}
            </ul>
          )}
        </Pannello>
      </div>

      <Pannello titolo="Ultimi preventivi ricevuti">
        {(ultimi.data ?? []).length === 0 ? (
          <Vuoto testo="Nessuna richiesta ancora arrivata." />
        ) : (
          <ul className="space-y-3">
            {(ultimi.data ?? []).map(
              (riga: {
                id: string
                riferimento: string
                nome: string
                dispositivo: string
                stato: string
                creato_il: string
              }) => (
                <li
                  key={riga.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--bordo)] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {riga.nome} · <span className="testo-tenue">{riga.dispositivo}</span>
                    </p>
                    <p className="text-xs testo-tenue">
                      {riga.riferimento} · {dataOra(riga.creato_il)}
                    </p>
                  </div>
                  <Stato valore={riga.stato} />
                </li>
              ),
            )}
          </ul>
        )}
      </Pannello>
    </div>
  )
}
