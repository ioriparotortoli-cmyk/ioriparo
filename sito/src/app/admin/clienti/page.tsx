import { CalendarClock, FileText, Mail, MessageCircle, Phone } from 'lucide-react'
import { AvvisoConfigurazione, Pannello, Vuoto } from '@/components/admin/comuni'
import { supabaseServer } from '@/lib/supabase/server'
import { dataOra } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Cliente = {
  email: string
  nome: string
  telefono: string | null
  preventivi: number
  appuntamenti: number
  messaggi: number
  dispositivi: Set<string>
  ultimoContatto: string
}

/**
 * L'anagrafica non è una tabella a sé: si ricava da preventivi, appuntamenti e
 * messaggi, raggruppati per indirizzo email. Così ogni richiesta arrivata dal
 * sito alimenta automaticamente l'elenco clienti, senza doppie registrazioni.
 */
export default async function PaginaClienti() {
  const supabase = await supabaseServer()
  if (!supabase) return <AvvisoConfigurazione />

  const [preventivi, appuntamenti, messaggi] = await Promise.all([
    supabase.from('preventivi').select('nome,email,telefono,dispositivo,creato_il').limit(1000),
    supabase.from('appuntamenti').select('nome,email,telefono,servizio,creato_il').limit(1000),
    supabase.from('messaggi').select('nome,email,telefono,creato_il').limit(1000),
  ])

  const clienti = new Map<string, Cliente>()

  const registra = (
    riga: { nome: string; email: string; telefono?: string | null; creato_il: string },
    tipo: 'preventivi' | 'appuntamenti' | 'messaggi',
    dispositivo?: string | null,
  ) => {
    const chiave = riga.email.trim().toLowerCase()
    if (!chiave) return

    const esistente = clienti.get(chiave)
    const cliente: Cliente = esistente ?? {
      email: chiave,
      nome: riga.nome,
      telefono: riga.telefono ?? null,
      preventivi: 0,
      appuntamenti: 0,
      messaggi: 0,
      dispositivi: new Set<string>(),
      ultimoContatto: riga.creato_il,
    }

    cliente[tipo] += 1
    if (!cliente.telefono && riga.telefono) cliente.telefono = riga.telefono
    if (dispositivo) cliente.dispositivi.add(dispositivo)
    if (riga.creato_il > cliente.ultimoContatto) {
      cliente.ultimoContatto = riga.creato_il
      cliente.nome = riga.nome
    }

    clienti.set(chiave, cliente)
  }

  ;(preventivi.data ?? []).forEach((riga) =>
    registra(riga as never, 'preventivi', (riga as { dispositivo?: string }).dispositivo),
  )
  ;(appuntamenti.data ?? []).forEach((riga) =>
    registra(riga as never, 'appuntamenti', (riga as { servizio?: string }).servizio),
  )
  ;(messaggi.data ?? []).forEach((riga) => registra(riga as never, 'messaggi'))

  const elenco = [...clienti.values()].sort((a, b) =>
    b.ultimoContatto.localeCompare(a.ultimoContatto),
  )

  const ricorrenti = elenco.filter(
    (cliente) => cliente.preventivi + cliente.appuntamenti + cliente.messaggi > 1,
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Clienti</h1>
        <p className="mt-1 text-sm testo-tenue">
          Anagrafica costruita automaticamente da preventivi, appuntamenti e messaggi ricevuti dal
          sito, raggruppati per email.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Pannello className="text-center">
          <p className="text-3xl font-extrabold tracking-tight">{elenco.length}</p>
          <p className="mt-1 text-xs testo-tenue">clienti in anagrafica</p>
        </Pannello>
        <Pannello className="text-center">
          <p className="text-3xl font-extrabold tracking-tight">{ricorrenti}</p>
          <p className="mt-1 text-xs testo-tenue">con più di un contatto</p>
        </Pannello>
        <Pannello className="text-center">
          <p className="text-3xl font-extrabold tracking-tight">
            {(preventivi.data?.length ?? 0) +
              (appuntamenti.data?.length ?? 0) +
              (messaggi.data?.length ?? 0)}
          </p>
          <p className="mt-1 text-xs testo-tenue">richieste totali</p>
        </Pannello>
      </div>

      {elenco.length === 0 ? (
        <Vuoto testo="Nessun cliente: l’anagrafica si popola con le richieste ricevute dal sito." />
      ) : (
        <ul className="space-y-3">
          {elenco.map((cliente) => (
            <li key={cliente.email}>
              <Pannello>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold">{cliente.nome}</h2>
                    <p className="mt-1 text-xs testo-tenue">
                      Ultimo contatto: {dataOra(cliente.ultimoContatto)}
                    </p>
                    {cliente.dispositivi.size > 0 && (
                      <p className="mt-2 text-xs testo-tenue">
                        {[...cliente.dispositivi].slice(0, 4).join(' · ')}
                      </p>
                    )}
                  </div>

                  <ul className="flex flex-wrap items-center gap-2 text-xs">
                    {cliente.preventivi > 0 && (
                      <li className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--bordo)] px-2.5 py-1 testo-tenue">
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                        {cliente.preventivi} preventivi
                      </li>
                    )}
                    {cliente.appuntamenti > 0 && (
                      <li className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--bordo)] px-2.5 py-1 testo-tenue">
                        <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                        {cliente.appuntamenti} appuntamenti
                      </li>
                    )}
                    {cliente.messaggi > 0 && (
                      <li className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--bordo)] px-2.5 py-1 testo-tenue">
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        {cliente.messaggi} messaggi
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  <a
                    href={`mailto:${cliente.email}`}
                    className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {cliente.email}
                  </a>
                  {cliente.telefono && (
                    <>
                      <a
                        href={`tel:${cliente.telefono}`}
                        className="inline-flex items-center gap-1.5 text-elettrico-400 hover:underline"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {cliente.telefono}
                      </a>
                      <a
                        href={`https://wa.me/${cliente.telefono.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        WhatsApp
                      </a>
                    </>
                  )}
                </div>
              </Pannello>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
