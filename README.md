# IO RIPARO — Sito web e gestionale

Progetto unico che contiene due applicazioni con lo stesso archivio dati:

| Area | Percorso | Destinatari |
| --- | --- | --- |
| **Sito web pubblico** | `/` | clienti privati e aziende |
| **Gestionale** | `/gestionale` | staff del laboratorio |

Il sito presenta i servizi, raccoglie preventivi e appuntamenti e permette al cliente di seguire
la propria riparazione; il gestionale è il pannello con cui il laboratorio gestisce clienti,
riparazioni, preventivi, fatture, magazzino, ordini, scadenze e statistiche.

Applicazione **Vite + React + TypeScript**, interfaccia in italiano.

## Avvio rapido

```bash
npm install
npm run dev        # http://localhost:5173
```

Altri comandi:

```bash
npm run build      # sitemap + controllo dei tipi + build di produzione in dist/
npm run preview    # anteprima della build
npm run lint       # oxlint
npm run sitemap    # rigenera public/sitemap.xml
```

## Stack

| Ambito | Scelta |
| --- | --- |
| Build | Vite 8 |
| UI | React 19 + TypeScript |
| Stili sito pubblico | CSS proprietario con variabili di tema (`src/sito/sito.css`) |
| Stili gestionale | Tailwind CSS v4 (tema in `src/index.css`) |
| Routing | React Router 7 con caricamento a moduli separati |
| Grafici | Recharts (solo gestionale) |
| Icone | sprite SVG interno (sito) e lucide-react (gestionale) |
| Dati | archivio locale in `localStorage`, nessun backend |

Nessun font, script o immagine viene scaricato da domini esterni: il sito non effettua
richieste di terze parti e non installa cookie non necessari.

## Sito pubblico

| Percorso | Contenuto |
| --- | --- |
| `/` | Apertura con campo segnale animato, servizi, motivi, processo, numeri, settori, tracking, galleria, recensioni, FAQ, blog, invito al contatto |
| `/chi-siamo` | Storia, missione, valori e percorso dell'attività |
| `/servizi` | Le 11 specializzazioni, listino orientativo e domande frequenti |
| `/galleria` | Lavori eseguiti con filtro per categoria e visualizzatore a schermo intero |
| `/blog`, `/blog/:slug` | Guide tecniche con dati strutturati `Article` |
| `/preventivo` | Preventivo online in tre passaggi con stima di prezzo calcolata |
| `/prenota` | Prenotazione appuntamenti con giorni e fasce orarie disponibili |
| `/stato-riparazione` | Ricerca della pratica per codice e avanzamento in tempo reale |
| `/area-clienti` | Accesso cliente: pratiche, approvazione preventivi, documenti |
| `/contatti` | Recapiti, orari con stato "aperto ora", mappa disegnata e modulo |
| `/privacy`, `/cookie-policy` | Informative GDPR |
| `/mappa-del-sito` | Elenco di tutte le pagine (in XML su `/sitemap.xml`) |

Funzioni trasversali: menu mobile a scomparsa, ricerca interna (`Ctrl/⌘ K`) con sinonimi,
tema chiaro/scuro persistente, banner cookie con preferenze granulari, chat di assistenza,
pulsante WhatsApp e ritorno a inizio pagina, newsletter, notifiche a comparsa.

### Dati e SEO

I contenuti stanno in `src/sito/dati/` (servizi, galleria, recensioni, FAQ, blog, azienda):
sono l'unica fonte da cui derivano pagine, ricerca interna, sitemap e dati strutturati.

Ogni pagina imposta titolo, descrizione, canonical, Open Graph, Twitter Card e JSON-LD
(`LocalBusiness`, `Service`, `FAQPage`, `Article`, `BreadcrumbList`) tramite `useSeo`.

## Gestionale

| Percorso | Contenuto |
| --- | --- |
| `/gestionale` | Dashboard: riepiloghi, riparazioni per stato, ultime riparazioni, scadenze, incassi |
| `/gestionale/riparazioni` | Elenco con filtri, ricerca, ordinamento, paginazione ed esportazione CSV |
| `/gestionale/riparazioni/nuova` | Accettazione: dati cliente e dispositivo, difetto, accessori, foto, firma |
| `/gestionale/riparazioni/:id` | Scheda con stato, interventi, ricambi, totali IVA, stampa |
| `/gestionale/clienti` | Anagrafica privati e aziende con storico |
| `/gestionale/preventivi`, `/fatture` | Documenti commerciali e incassi |
| `/gestionale/magazzino`, `/ordini` | Ricambi, sotto scorta, ordini a fornitore |
| `/gestionale/scadenze`, `/impianti` | Promemoria e impianti installati |
| `/gestionale/statistiche` | Incassi, riparazioni per mese, ricavi per categoria |
| `/gestionale/impostazioni`, `/backup` | Dati aziendali, backup ed esportazioni |

Le due aree condividono l'archivio: la pratica che il tecnico aggiorna nel gestionale è la
stessa che il cliente vede su `/stato-riparazione` e nell'area riservata.

## Struttura del progetto

```
public/
  marchio/        logo ufficiale (PNG), versione su fondo scuro, icone e immagine social
  favicon.svg     marchio vettoriale per la scheda del browser
  robots.txt      sitemap.xml  site.webmanifest
scripts/
  genera-sitemap.mjs   sitemap XML generata dalle rotte e dagli articoli
src/
  sito/           sito pubblico
    sito.css      sistema di design: colori, tipografia, componenti, animazioni
    SitoLayout    intestazione, piè di pagina, pannelli, pulsanti flottanti
    dati/         contenuti e recapiti (unica fonte)
    componenti/   marchio, icone, illustrazioni, galleria, recensioni, FAQ, scheda pratica…
    pagine/       una pagina per rotta
    lib/          SEO, hook (rivela allo scorrimento, contatori), formattazione
  components/     gestionale: layout, elementi di interfaccia, stampe, grafici
  pages/          gestionale: una cartella per area funzionale
  data/           archivio dimostrativo, contesto con le operazioni CRUD, metriche
  lib/            formattazione italiana, calcoli IVA, stati, esportazioni
  types/          modelli di dominio condivisi
```

## Identità grafica

Il marchio ufficiale è in `public/marchio/io-riparo-logo.png` (versione con lettering chiaro
per fondi scuri accanto). Per intestazione, favicon e icone è disponibile la versione
vettoriale ridisegnata in `src/sito/componenti/Marchio.tsx`, con lo stesso gradiente
istituzionale **#29ABE2 → #0071BC**.

Palette del sito: nero con dominante blu (`#05070c`), blu elettrico (`#2563eb`), bianco e
grigio chiaro; tipografia di sistema (SF Pro Display / Segoe UI / Inter) con monospace per
codici pratica e dati tecnici.

## Convenzioni

- Interfaccia, nomi di dominio e commenti in italiano.
- I prezzi di riparazioni, preventivi e fatture sono **IVA inclusa**: l'imposta viene scorporata
  in fase di visualizzazione (`src/lib/calcoli.ts`).
- Gli stati delle riparazioni e i relativi colori sono definiti una sola volta in
  `src/lib/stati.ts`; il sito li traduce in linguaggio per il cliente in `SchedaPratica`.
- Gli stili del sito valgono solo dove il layout pubblico è montato (`body[data-sito]`,
  `#app`, `#layers`): il gestionale continua a usare esclusivamente Tailwind.
- Le animazioni rispettano `prefers-reduced-motion`.

## Da completare prima della pubblicazione

- **Fotografie reali**: le illustrazioni vettoriali di galleria, servizi e blog vanno
  sostituite con foto del laboratorio e degli impianti (formato WebP/AVIF, `loading="lazy"`).
- **Dati aziendali**: indirizzo, partita IVA e profili social sono in `src/sito/dati/azienda.ts`
  e in `src/data/seed.ts` (gestionale).
- **Backend**: moduli, area clienti e tracking oggi lavorano sull'archivio locale. Per la
  messa online servono API con salvataggio su database, invio e-mail e autenticazione.
- **Dominio**: aggiornare `SITO_URL` in `src/sito/lib/seo.ts` e `scripts/genera-sitemap.mjs`.
