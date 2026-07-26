# IO RIPARO

Il repository contiene due progetti indipendenti:

| Cartella | Progetto |
| --- | --- |
| `.` (radice) | **Gestionale** interno: accettazione, riparazioni, clienti, magazzino, fatture (Vite + React) |
| [`sito/`](./sito) | **Sito web pubblico**: vetrina, preventivi, prenotazioni e pannello amministratore (Next.js 15 + Supabase) |

---

## Gestionale Assistenza e Riparazioni

Gestionale per un centro di assistenza e riparazione di dispositivi mobili e computer:
accettazione dispositivi, avanzamento delle riparazioni, anagrafica clienti, preventivi,
fatture, magazzino ricambi, ordini fornitori, scadenze e statistiche.

Applicazione **Vite + React + TypeScript + Tailwind CSS**, interfaccia in italiano con tema scuro.

### Avvio rapido

```bash
npm install
npm run dev        # http://localhost:5173
```

Altri comandi:

```bash
npm run build      # controllo dei tipi + build di produzione in dist/
npm run preview    # anteprima della build
npm run lint       # oxlint
```

### Stack

| Ambito | Scelta |
| --- | --- |
| Build | Vite 8 |
| UI | React 19 + TypeScript |
| Stili | Tailwind CSS v4 (plugin `@tailwindcss/vite`, tema in `src/index.css`) |
| Routing | React Router 7 |
| Grafici | Recharts |
| Icone | lucide-react |
| Dati | archivio locale in `localStorage`, nessun backend |

### Pagine

| Percorso | Contenuto |
| --- | --- |
| `/` | Dashboard: riepiloghi, riparazioni per stato, ultime riparazioni, scadenze, andamento incassi, prodotti più venduti, scorciatoie |
| `/riparazioni` | Elenco dispositivi con filtri per stato, tipo, periodo e tecnico, ricerca, ordinamento, paginazione ed esportazione CSV |
| `/riparazioni/nuova` | Modulo di accettazione: dati cliente, dati dispositivo, difetto, condizioni, accessori, foto, firma del cliente |
| `/riparazioni/:id` | Scheda riparazione: stato, interventi e ricambi, totali con IVA, cliente, foto, firma, stampa |
| `/riparazioni/:id/modifica` | Modifica dell'accettazione |
| `/clienti`, `/clienti/:id` | Anagrafica privati e aziende, scheda cliente con storico riparazioni e fatture |
| `/preventivi` | Preventivi per stato con dettaglio e cambio stato |
| `/fatture` | Documenti emessi, incassi, registrazione del pagamento |
| `/magazzino` | Ricambi e accessori, carico/scarico rapido, avvisi di sotto scorta, margini |
| `/ordini` | Ordini a fornitore; alla ricezione la merce entra in giacenza |
| `/scadenze` | Pagamenti, contratti e promemoria con priorità |
| `/impianti` | Impianti installati presso i clienti e manutenzioni programmate |
| `/statistiche` | Incassi, riparazioni per mese, ricavi per categoria, tipologie di dispositivo |
| `/impostazioni` | Dati aziendali, IVA e numerazione predefinite |
| `/backup` | Backup JSON completo (esporta/importa) ed esportazioni CSV |

### Struttura del progetto

```
src/
  types/          modelli di dominio (Cliente, Riparazione, Fattura, …)
  data/
    seed.ts       dati dimostrativi generati rispetto alla data odierna
    store.tsx     Context con le operazioni CRUD e persistenza su localStorage
    metriche.ts   aggregazioni per dashboard e statistiche
  lib/            formattazione italiana, calcoli IVA, configurazione degli stati,
                  esportazioni CSV/JSON, hook di ordinamento e paginazione
  components/
    layout/       AppLayout, Sidebar, Topbar, contesto dell'intestazione di pagina
    ui/           Card, Badge, Button, campi di form, tabella, modale, firma…
    charts/       ciambella degli stati e andamento incassi
  pages/          una cartella per area funzionale
```

### Dati

L'app non ha backend: all'avvio carica un archivio dimostrativo (24 riparazioni, 24 clienti,
18 articoli di magazzino e circa tre mesi di fatture) e salva ogni modifica in `localStorage`
sotto la chiave `ioriparo:db:v1`.

Le date del dataset sono calcolate rispetto al giorno corrente, così dashboard, incassi del mese
e scadenze restano sempre significativi. Da *Impostazioni* si possono ripristinare i dati
dimostrativi, da *Backup* esportare e reimportare l'archivio.

### Convenzioni

- Interfaccia, nomi di dominio e commenti in italiano.
- I prezzi di riparazioni, preventivi e fatture sono **IVA inclusa**: l'imposta viene scorporata
  in fase di visualizzazione (`src/lib/calcoli.ts`).
- Gli stati delle riparazioni e i relativi colori sono definiti una sola volta in
  `src/lib/stati.ts` e riusati da badge, filtri, grafici e stampe.
- Gli stili base dei campi stanno nel layer `components` (`.ui-field` in `index.css`) così le
  utility Tailwind passate via `className` mantengono la precedenza.

---

## Sito web pubblico

Il sito vetrina con preventivi, prenotazioni e pannello amministratore vive in [`sito/`](./sito):
Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, Supabase.

```bash
npm run sito:install
npm run sito:dev              # http://localhost:3000
```

Oppure, per la build di produzione:

```bash
npm run sito:build
npm run sito:start            # anche con `npm start` dalla radice
```

Una copia autonoma della home in un unico file HTML (utile per un'anteprima rapida senza
eseguire Next.js) si ottiene con `npm run sito:anteprima`, che scrive `sito/anteprima/index.html`.

Dettagli, configurazione e schema del database: [`sito/README.md`](./sito/README.md).

> Nota: `npm run dev` nella radice avvia il **gestionale** (Vite, porta 5173); il sito pubblico
> ha i propri comandi `sito:*` e gira sulla porta 3000.
