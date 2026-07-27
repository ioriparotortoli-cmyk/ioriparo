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
npm run anteprima  # anteprima/io-riparo.html: tutto il sito in un unico file
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
| `/servizi` | Le 12 specializzazioni, listino orientativo e domande frequenti |
| `/servizi/:id` | Pagina dedicata a ogni servizio: interventi compresi, fasi, prezzi e domande |
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

Il marchio usato ovunque è il **file originale fornito dall'azienda**:

| File | Uso |
| --- | --- |
| `public/marchio/io-riparo-logo.png` | originale ricevuto, conservato intatto |
| `public/marchio/logo.png` | stesso file senza margine trasparente, per fondi chiari |
| `public/marchio/logo-chiaro.png` | lettering schiarito, per fondi scuri e gestionale |
| `public/marchio/simbolo.png` | solo la parte grafica, base delle icone |
| `public/marchio/icona-*.png` | favicon e icone app generate dal simbolo originale |
| `public/marchio/social.png` | immagine per le condivisioni |

Il passaggio tra la versione chiara e quella scura avviene via CSS (`.marchio--scuro` /
`.marchio--chiaro`): nessun ridisegno, nessuna reinterpretazione del marchio.

Palette del sito: nero con dominante blu (`#05070c`), blu elettrico (`#2563eb`), bianco e
grigio chiaro; tipografia di sistema (SF Pro Display / Segoe UI / Inter) con monospace per
codici pratica e dati tecnici.

## Moduli e invio e-mail

Il sito è statico: non c'è backend e nessuna richiesta resta nel browser. I moduli
**Contatti**, **Preventivo**, **Prenotazione** e **Newsletter** passano tutti da
`src/sito/lib/moduli.ts` e recapitano a `ioriparotortoli@gmail.com` in due modi:

1. **Servizio di invio** — basta valorizzare `VITE_MODULI_ENDPOINT` in `.env` con
   l'indirizzo fornito da Formspree, Web3Forms, Getform, Basin o equivalenti
   (`VITE_MODULI_CHIAVE` solo per i servizi che richiedono una chiave). I dati
   partono in JSON e arrivano in casella senza che il visitatore lasci il sito.
2. **Client di posta** — finché l'endpoint non è configurato il modulo apre il
   programma di posta con destinatario, oggetto e testo già compilati, così il
   sito è utilizzabile da subito.

In entrambi i casi il messaggio di conferma mostrato all'utente si adatta a quello
che è realmente successo. I moduli hanno un campo esca invisibile e un tempo minimo
di compilazione come filtro anti-robot, senza CAPTCHA.

L'indirizzo di risposta viene incluso solo quando il visitatore ne ha lasciato uno
valido: nella prenotazione l'e-mail è facoltativa e la richiesta parte comunque con
il numero di telefono, senza indirizzi inventati che i servizi scarterebbero.

## Dati dell'attività

Nome, indirizzo, telefono, WhatsApp, e-mail e partita IVA stanno **in un solo punto**
(`src/sito/dati/azienda.ts`) e da lì alimentano intestazione, contatti, piè di pagina,
informative, dati strutturati e pulsanti "Chiama ora" e WhatsApp.

| Dato | Valore |
| --- | --- |
| Attività | Io Riparo |
| Sede | Via Campidano 7, 08048 Tortolì (NU) |
| Telefono | 0782 208901 |
| WhatsApp | +39 338 435 6603 |
| E-mail | ioriparotortoli@gmail.com |
| Partita IVA | 01625710916 |

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
- **Profili social**: `social.facebook` e `social.instagram` in `src/sito/dati/azienda.ts` sono
  vuoti, quindi le due icone non compaiono nel piè di pagina. Basta incollare l'indirizzo del
  profilo perché l'icona torni visibile e finisca anche nei dati strutturati (`sameAs`).
- **Backend**: moduli, area clienti e tracking oggi lavorano sull'archivio locale del browser.
  Il sito è pubblicabile così com'è; quando servirà la persistenza reale basterà sostituire le
  funzioni di invio dei moduli e le letture in `src/sito/pagine/` con chiamate alle API,
  senza toccare interfaccia e componenti.
- **Dominio**: aggiornare `SITO_URL` in `src/sito/lib/seo.ts` e `scripts/genera-sitemap.mjs`.
