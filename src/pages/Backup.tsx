import { useRef, useState } from 'react'
import { CloudUpload, Database, Download, FileSpreadsheet, RotateCcw, Upload } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useIntestazione } from '@/components/layout/intestazione'
import { caricaDatabase, esisteArchivioLocale, useGestionale } from '@/data/store'
import { caricaArchivio } from '@/data/archivio'
import { esportaCsv, esportaJson, nomeArchivio, nomeFileConData } from '@/lib/esporta'
import { totaleFattura, totalePreventivo, totaleRiparazione } from '@/lib/calcoli'
import { formatData } from '@/lib/format'
import { STATI_FATTURA, STATI_PREVENTIVO, STATI_RIPARAZIONE, TIPI_DISPOSITIVO } from '@/lib/stati'
import type { DatabaseGestionale } from '@/types'

export function Backup() {
  useIntestazione({
    titolo: 'Backup / Esportazioni',
    sottotitolo: 'Salva una copia dell’archivio o esporta i dati in CSV',
  })

  const { db, sorgente, ricarica, importaDatabase, ripristinaDemo } = useGestionale()
  const inputImport = useRef<HTMLInputElement>(null)
  const [esito, setEsito] = useState<{ tipo: 'ok' | 'errore'; testo: string } | null>(null)
  const [confermaRipristino, setConfermaRipristino] = useState(false)

  const online = sorgente === 'online'
  const [inCorso, setInCorso] = useState(false)
  // Da trasferire c'è qualcosa solo se questo browser ha un archivio suo.
  const daTrasferire = online && esisteArchivioLocale()

  /**
   * Copia nell'archivio condiviso quello che era rimasto in questo browser.
   * Operazione da fare una volta sola, al passaggio all'archivio online.
   */
  async function trasferisci() {
    if (!esisteArchivioLocale()) {
      setEsito({
        tipo: 'errore',
        testo: 'Questo browser non ha un archivio da trasferire: non è mai stato usato per il gestionale.',
      })
      return
    }
    setInCorso(true)
    setEsito(null)
    try {
      const voci = await caricaArchivio(caricaDatabase())
      await ricarica()
      setEsito({ tipo: 'ok', testo: `Trasferite ${voci} schede nell’archivio online.` })
    } catch (e) {
      setEsito({
        tipo: 'errore',
        testo: `Trasferimento non riuscito: ${e instanceof Error ? e.message : 'errore sconosciuto'}`,
      })
    } finally {
      setInCorso(false)
    }
  }

  function esportaTutto() {
    esportaJson(nomeFileConData(nomeArchivio(db.azienda.nome), 'json'), db)
    setEsito({ tipo: 'ok', testo: 'Backup completo esportato.' })
  }

  async function importa(file: File) {
    try {
      const testo = await file.text()
      const dati = JSON.parse(testo) as DatabaseGestionale

      // Controllo minimo di struttura prima di sostituire l'archivio.
      if (!Array.isArray(dati.clienti) || !Array.isArray(dati.riparazioni)) {
        throw new Error('struttura non valida')
      }

      importaDatabase(dati)
      setEsito({ tipo: 'ok', testo: 'Backup importato correttamente.' })
    } catch {
      setEsito({ tipo: 'errore', testo: 'File non valido: non sembra un backup del gestionale.' })
    }
  }

  const esportazioni = [
    {
      titolo: 'Riparazioni',
      descrizione: `${db.riparazioni.length} schede di accettazione`,
      azione: () =>
        esportaCsv(
          nomeFileConData('riparazioni', 'csv'),
          ['ID', 'Cliente', 'Dispositivo', 'Tipo', 'Difetto', 'Stato', 'Accettazione', 'Totale'],
          db.riparazioni.map((r) => [
            r.codice,
            db.clienti.find((c) => c.id === r.clienteId)?.nome,
            `${r.marca} ${r.modello}`,
            TIPI_DISPOSITIVO[r.tipoDispositivo],
            r.difettoSegnalato,
            STATI_RIPARAZIONE[r.stato].label,
            formatData(r.dataAccettazione),
            totaleRiparazione(r).toFixed(2),
          ]),
        ),
    },
    {
      titolo: 'Clienti',
      descrizione: `${db.clienti.length} anagrafiche`,
      azione: () =>
        esportaCsv(
          nomeFileConData('clienti', 'csv'),
          ['Nome', 'Tipo', 'Telefono', 'Email', 'Città', 'P.IVA', 'Cliente dal'],
          db.clienti.map((c) => [
            c.nome,
            c.tipo,
            c.telefono,
            c.email,
            c.citta,
            c.partitaIva,
            formatData(c.creatoIl),
          ]),
        ),
    },
    {
      titolo: 'Fatture',
      descrizione: `${db.fatture.length} documenti emessi`,
      azione: () =>
        esportaCsv(
          nomeFileConData('fatture', 'csv'),
          ['Numero', 'Cliente', 'Data', 'Stato', 'Metodo', 'Totale'],
          db.fatture.map((f) => [
            f.numero,
            db.clienti.find((c) => c.id === f.clienteId)?.nome,
            formatData(f.data),
            STATI_FATTURA[f.stato].label,
            f.metodoPagamento,
            totaleFattura(f).toFixed(2),
          ]),
        ),
    },
    {
      titolo: 'Preventivi',
      descrizione: `${db.preventivi.length} proposte`,
      azione: () =>
        esportaCsv(
          nomeFileConData('preventivi', 'csv'),
          ['Numero', 'Cliente', 'Data', 'Stato', 'Totale'],
          db.preventivi.map((p) => [
            p.numero,
            db.clienti.find((c) => c.id === p.clienteId)?.nome,
            formatData(p.data),
            STATI_PREVENTIVO[p.stato].label,
            totalePreventivo(p).toFixed(2),
          ]),
        ),
    },
    {
      titolo: 'Magazzino',
      descrizione: `${db.magazzino.length} articoli a catalogo`,
      azione: () =>
        esportaCsv(
          nomeFileConData('magazzino', 'csv'),
          ['Codice', 'Articolo', 'Categoria', 'Giacenza', 'Scorta minima', 'Acquisto', 'Vendita'],
          db.magazzino.map((a) => [
            a.codice,
            a.nome,
            a.categoria,
            a.quantita,
            a.scorta_minima,
            a.prezzoAcquisto.toFixed(2),
            a.prezzoVendita.toFixed(2),
          ]),
        ),
    },
    {
      titolo: 'Scadenze',
      descrizione: `${db.scadenze.length} promemoria`,
      azione: () =>
        esportaCsv(
          nomeFileConData('scadenze', 'csv'),
          ['Titolo', 'Descrizione', 'Tipo', 'Priorità', 'Data', 'Importo', 'Completata'],
          db.scadenze.map((s) => [
            s.titolo,
            s.descrizione,
            s.tipo,
            s.priorita,
            formatData(s.data),
            s.importo?.toFixed(2),
            s.completata ? 'sì' : 'no',
          ]),
        ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            titolo="Backup completo"
            sottotitolo="Un unico file JSON con tutto l’archivio"
          />
          <p className="mt-3 text-sm text-ink-muted">
            Contiene clienti, riparazioni, preventivi, fatture, magazzino, ordini, scadenze e
            impianti. Conservalo per trasferire i dati su un altro dispositivo.
          </p>
          <Button variante="primario" className="mt-4" onClick={esportaTutto}>
            <Database size={15} />
            Esporta backup JSON
          </Button>
        </Card>

        <Card>
          <CardHeader titolo="Ripristino" sottotitolo="Importa un backup esportato in precedenza" />
          <p className="mt-3 text-sm text-ink-muted">
            L’importazione sostituisce integralmente i dati presenti nel browser. Esporta un backup
            prima di procedere.
          </p>
          <Button className="mt-4" onClick={() => inputImport.current?.click()}>
            <Upload size={15} />
            Importa backup JSON
          </Button>
          <input
            ref={inputImport}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void importa(file)
              e.target.value = ''
            }}
          />

          {esito && (
            <p
              className={
                esito.tipo === 'ok'
                  ? 'mt-3 text-sm text-emerald-400'
                  : 'mt-3 text-sm text-rose-400'
              }
            >
              {esito.testo}
            </p>
          )}
        </Card>
      </div>

      <Card padding={false}>
        <div className="p-5 pb-2">
          <CardHeader
            titolo="Esportazioni CSV"
            sottotitolo="Compatibili con Excel e con il commercialista"
          />
        </div>
        <ul className="divide-y divide-line">
          {esportazioni.map((voce) => (
            <li key={voce.titolo} className="flex items-center gap-4 px-5 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-muted">
                <FileSpreadsheet size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-ink">{voce.titolo}</span>
                <span className="block text-[11px] text-ink-faint">{voce.descrizione}</span>
              </span>
              <Button dimensione="sm" onClick={voce.azione}>
                <Download size={14} />
                CSV
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader
          titolo={online ? 'Archivio online' : 'Archivio locale'}
          sottotitolo={
            online
              ? 'I dati sono nell’archivio condiviso e li vedi da ogni dispositivo'
              : 'I dati sono salvati nel browser di questo dispositivo'
          }
        />
        {online ? (
          <>
            <p className="mt-3 text-sm text-ink-muted">
              Ogni modifica viene scritta anche nell’archivio condiviso, e il sito legge da lì lo
              stato delle riparazioni. Non c’è nulla da salvare a mano.
            </p>
            {daTrasferire ? (
              <>
                <p className="mt-3 text-sm text-ink-muted">
                  Su questo browser è rimasto un archivio di prima del collegamento. Puoi portarlo
                  online adesso: è un’operazione da fare <strong className="text-ink">una volta
                  sola</strong>, e le schede già presenti con lo stesso identificativo vengono
                  aggiornate, non duplicate.
                </p>
                <Button className="mt-4" onClick={() => void trasferisci()} disabled={inCorso}>
                  <CloudUpload size={15} />
                  {inCorso ? 'Trasferimento…' : 'Trasferisci l’archivio di questo browser'}
                </Button>
              </>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                Questo browser non ha un archivio suo da trasferire: o è già stato portato online, o
                il gestionale qui non è mai stato usato prima del collegamento.
              </p>
            )}
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-ink-muted">
              Il gestionale sta lavorando senza archivio condiviso: ogni modifica resta nel browser
              corrente. Esporta un backup prima di cambiare dispositivo o di svuotare i dati di
              navigazione.
            </p>
            <Button variante="pericolo" className="mt-4" onClick={() => setConfermaRipristino(true)}>
              <RotateCcw size={15} />
              Ripristina dati dimostrativi
            </Button>
          </>
        )}
      </Card>

      <Modal
        aperta={confermaRipristino}
        titolo="Ripristinare i dati dimostrativi?"
        onChiudi={() => setConfermaRipristino(false)}
        larghezza="sm"
        piede={
          <>
            <Button onClick={() => setConfermaRipristino(false)}>Annulla</Button>
            <Button
              variante="pericolo"
              onClick={() => {
                ripristinaDemo()
                setConfermaRipristino(false)
              }}
            >
              <RotateCcw size={15} />
              Ripristina
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Tutte le modifiche locali (clienti, riparazioni, magazzino) verranno sostituite dai dati di
          esempio iniziali. L’operazione non è reversibile.
        </p>
      </Modal>
    </div>
  )
}
