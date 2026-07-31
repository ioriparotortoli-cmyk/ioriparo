import { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Boxes,
  CalendarPlus,
  CheckCircle2,
  Euro,
  FileText,
  Receipt,
  TrendingUp,
  UserPlus,
  Users,
  Wrench,
} from 'lucide-react'
import { Card, CardFooter, CardHeader } from '@/components/ui/Card'
import { Badge, BadgeStato } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { DeviceIcon } from '@/components/ui/DeviceIcon'
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import {
  contaPerStato,
  incassoDelGiorno,
  incassoDelMese,
  riparazioniAperte,
  riparazioniPerStato,
  scadenzeImminenti,
  ultimeRiparazioni,
} from '@/data/metriche'
import {
  formatData,
  formatEuroAuto,
  formatNumero,
  nomeAbbreviato,
  scadenzaRelativa,
} from '@/lib/format'
import { citazioneDelGiorno } from '@/lib/citazioni'
import { TIPI_SCADENZA } from '@/lib/stati'
import { cn } from '@/lib/cn'

const AZIONI_RAPIDE = [
  { etichetta: 'Nuova riparazione', percorso: '/gestionale/riparazioni/nuova', icona: Wrench, tono: 'bg-blue-600' },
  { etichetta: 'Nuovo cliente', percorso: '/gestionale/clienti?nuovo=1', icona: UserPlus, tono: 'bg-emerald-600' },
  { etichetta: 'Nuovo preventivo', percorso: '/gestionale/preventivi', icona: FileText, tono: 'bg-violet-600' },
  { etichetta: 'Nuova fattura', percorso: '/gestionale/fatture', icona: Receipt, tono: 'bg-amber-500' },
  { etichetta: 'Carico magazzino', percorso: '/gestionale/magazzino?nuovo=1', icona: Boxes, tono: 'bg-cyan-600' },
  { etichetta: 'Nuovo promemoria', percorso: '/gestionale/scadenze?nuovo=1', icona: CalendarPlus, tono: 'bg-rose-600' },
]

export function Dashboard() {
  const { db } = useGestionale()
  useIntestazione({
    titolo: `Benvenuto, ${db.utente.nome.split(' ')[0]}`,
    sottotitolo: 'Riepilogo di oggi e azioni rapide',
  })


  const conteggi = useMemo(() => contaPerStato(db), [db])
  const vociStato = useMemo(() => riparazioniPerStato(db), [db])
  const ultime = useMemo(() => ultimeRiparazioni(db, 5), [db])
  const scadenze = useMemo(() => scadenzeImminenti(db, 3), [db])

  const citazione = citazioneDelGiorno()

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Una frase al giorno, prima dei numeri. Sta in disparte: e' l'unica
          cosa qui dentro che non chiede di fare niente. */}
      <figure className="m-0 border-l-2 border-brand/50 pl-4">
        <blockquote className="text-[15px] leading-snug text-balance text-ink-muted italic">
          {/* Una parola per elemento, ognuna con il suo ritardo: e' il modo
              piu' semplice di farle comparire in fila senza che il testo si
              allunghi mentre appare. */}
          {citazione.testo.split(' ').map((parola, i) => (
            // Lo spazio sta fuori dallo `span`: dentro a un elemento
            // `inline-block` verrebbe scartato e le parole si attaccherebbero.
            <Fragment key={i}>
              <span className="frase-parola" style={{ animationDelay: `${i * 55}ms` }}>
                {parola}
              </span>{' '}
            </Fragment>
          ))}
        </blockquote>
        <figcaption
          className="frase-parola mt-1 text-[11px] text-ink-faint"
          style={{ animationDelay: `${citazione.testo.split(' ').length * 55 + 150}ms` }}
        >
          Steve Jobs · {citazione.fonte}
        </figcaption>
      </figure>

      {/* Riepiloghi principali */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          etichetta="Riparazioni aperte"
          valore={riparazioniAperte(db)}
          icona={Briefcase}
          tono="blu"
          link="/gestionale/riparazioni"
        />
        <StatCard
          etichetta="In lavorazione"
          valore={conteggi.in_lavorazione}
          icona={Wrench}
          tono="ambra"
          link="/gestionale/riparazioni?stato=in_lavorazione"
        />
        <StatCard
          etichetta="Pronte per il ritiro"
          valore={conteggi.pronto_per_ritiro}
          icona={CheckCircle2}
          tono="verde"
          link="/gestionale/riparazioni?stato=pronto_per_ritiro"
        />
        <StatCard
          etichetta="Incasso oggi"
          valore={formatEuroAuto(incassoDelGiorno(db))}
          icona={Euro}
          tono="ciano"
          link="/gestionale/fatture"
          testoLink="Vedi dettagli"
        />
        <StatCard
          etichetta="Incasso mese"
          valore={formatEuroAuto(incassoDelMese(db))}
          icona={TrendingUp}
          tono="viola"
          link="/gestionale/statistiche"
          testoLink="Vedi dettagli"
        />
        <StatCard
          etichetta="Clienti totali"
          valore={formatNumero(db.clienti.length)}
          icona={Users}
          tono="rosa"
          link="/gestionale/clienti"
          testoLink="Vedi tutti"
        />
      </div>

      {/* Azioni principali */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {AZIONI_RAPIDE.map(({ etichetta, percorso, icona: Icona, tono }) => (
          <Link
            key={etichetta}
            to={percorso}
            className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-soft hover:bg-surface-2"
          >
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-lg text-white',
                tono,
              )}
            >
              <Icona size={19} />
            </span>
            <span className="text-[13px] leading-tight font-semibold text-ink">{etichetta}</span>
          </Link>
        ))}
      </div>

      {/* Stato del laboratorio */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader titolo="Riparazioni per stato" sottotitolo="Tocca uno stato per filtrare l’elenco" />
          {/* Elenco e non grafico: la lettura a colpo d'occhio è la stessa e la
              dashboard non deve caricare la libreria dei grafici, che serve
              soltanto in Statistiche. */}
          <ul className="mt-3 divide-y divide-line">
            {vociStato.map((voce) => (
              <li key={voce.stato}>
                <Link
                  to={`/gestionale/riparazioni?stato=${voce.stato}`}
                  className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: voce.colore }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{voce.label}</span>
                  <span className="shrink-0 text-[13px] font-semibold text-ink tabular-nums">
                    {voce.valore}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <CardFooter>
            <Link
              to="/gestionale/riparazioni"
              className="inline-flex items-center gap-1.5 font-medium text-blue-400 hover:text-blue-300"
            >
              Vedi tutte le riparazioni
              <ArrowRight size={14} />
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader titolo="Ultime riparazioni" />
          <ul className="mt-3 divide-y divide-line">
            {ultime.map((riparazione) => (
              <li key={riparazione.id}>
                <Link
                  to={`/gestionale/riparazioni/${riparazione.id}`}
                  className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-surface-2"
                >
                  <DeviceIcon tipo={riparazione.tipoDispositivo} dimensione="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink">
                      {riparazione.modello} —{' '}
                      {nomeAbbreviato(
                        db.clienti.find((c) => c.id === riparazione.clienteId)?.nome ?? '',
                      )}
                    </span>
                    <span className="block truncate text-[11px] text-ink-faint">
                      {riparazione.difettoSegnalato}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <BadgeStato stato={riparazione.stato} breve />
                    <span className="hidden text-[11px] text-ink-faint sm:block">
                      {formatData(riparazione.dataAccettazione)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <CardFooter>
            <Link
              to="/gestionale/riparazioni"
              className="inline-flex items-center gap-1.5 font-medium text-blue-400 hover:text-blue-300"
            >
              Vedi tutte le riparazioni
              <ArrowRight size={14} />
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader titolo="Promemoria / Scadenze" />
          <ul className="mt-3 space-y-3">
            {scadenze.map((scadenza) => {
              const tipo = TIPI_SCADENZA[scadenza.tipo]
              const urgente = scadenza.priorita === 'urgente'
              return (
                <li key={scadenza.id}>
                  <Link
                    to="/gestionale/scadenze"
                    className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
                  >
                    <span
                      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${tipo.colore}22`, color: tipo.colore }}
                    >
                      <CalendarPlus size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate text-[13px] font-semibold',
                          urgente ? 'text-rose-400' : 'text-blue-400',
                        )}
                      >
                        {scadenza.titolo}
                      </span>
                      {scadenza.descrizione && (
                        <span className="block truncate text-[12px] text-ink-muted">
                          {scadenza.descrizione}
                        </span>
                      )}
                      <span className="block text-[11px] text-ink-faint">
                        Scade il {formatData(scadenza.data)} · {scadenzaRelativa(scadenza.data)}
                      </span>
                    </span>
                    <Badge
                      className={
                        urgente
                          ? 'text-rose-300 bg-rose-500/12 border-rose-500/30'
                          : 'text-amber-300 bg-amber-500/12 border-amber-500/30'
                      }
                    >
                      {urgente ? 'Urgente' : 'Promemoria'}
                    </Badge>
                  </Link>
                </li>
              )
            })}
            {scadenze.length === 0 && (
              <li className="py-6 text-center text-xs text-ink-faint">Nessuna scadenza aperta</li>
            )}
          </ul>
          <CardFooter>
            <Link
              to="/gestionale/scadenze"
              className="inline-flex items-center gap-1.5 font-medium text-blue-400 hover:text-blue-300"
            >
              Vedi tutte le scadenze
              <ArrowRight size={14} />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
