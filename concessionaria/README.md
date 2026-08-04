# Aurora Motori — sito web e pannello di gestione

Sito completo per una concessionaria multiservizi: vendita di auto e moto,
noleggio a breve e lungo termine, reparto detailing, finanziamenti, permuta e
assistenza post vendita. Comprende il catalogo con ricerca avanzata, la
prenotazione online del noleggio con pagamento, l'area riservata ai clienti e un
pannello di amministrazione da cui lo staff aggiorna tutto senza toccare il
codice.

Applicazione **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
+ Framer Motion**. Interfaccia e codice in italiano.

## Avvio rapido

```bash
npm install
cp .env.example .env.local     # facoltativo in sviluppo
npm run immagini               # genera le fotografie segnaposto
npm run dev                    # http://localhost:3000
```

Il pannello è su [http://localhost:3000/admin](http://localhost:3000/admin). In
sviluppo la password predefinita è `aurora`; in produzione va impostata
(vedi [Configurazione](#configurazione)).

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Sviluppo con ricaricamento immediato |
| `npm run build` | Compilazione di produzione |
| `npm start` | Avvio della build compilata |
| `npm run tipi` | Controllo dei tipi TypeScript |
| `npm run immagini` | Rigenera le fotografie mancanti (`--tutto` per rifarle tutte) |

## Le pagine

| Percorso | Contenuto |
| --- | --- |
| `/` | Apertura a schermo intero, dodici servizi, veicoli in vetrina, noleggio, detailing, traguardi, offerte, recensioni |
| `/catalogo` | Ricerca e filtri su marca, modello, anno, prezzo, alimentazione, cambio, chilometri, potenza e tipologia |
| `/catalogo/[slug]` | Scheda veicolo: galleria, video, caratteristiche, dotazioni, prezzo, rata, test drive, WhatsApp |
| `/noleggio` | Flotta con tariffe giornaliere, settimanali e mensili; calendario disponibilità e prenotazione con pagamento |
| `/detailing` | Dieci trattamenti, confronto prima/dopo trascinabile, prenotazione dell'appuntamento |
| `/servizi` | Tutti i servizi in dettaglio, officina interna |
| `/finanziamenti` | Simulatore di rata, tre formule di finanziamento, valutazione della permuta |
| `/chi-siamo` | Storia, missione, valori, squadra |
| `/blog`, `/blog/[slug]` | Guide all'acquisto, manutenzione, cura del veicolo, novità |
| `/contatti` | Recapiti, mappa, orari, preventivo, modulo contatti, domande frequenti |
| `/area-clienti` | Accesso e registrazione, noleggi, appuntamenti, richieste, acquisti, documenti e fatture |
| `/privacy`, `/cookie-policy`, `/termini` | Informative e condizioni |
| `/admin` | Pannello di gestione, protetto da password |

## Il pannello di gestione

Da `/admin` lo staff può:

* **Veicoli** — aggiungere auto e moto, modificare prezzi, dotazioni e
  fotografie, gestire le tariffe di noleggio, nascondere un veicolo senza
  eliminarlo, metterlo in vetrina in home e segnarlo come prenotato o venduto.
* **Noleggi** — vedere chi ritira oggi, confermare, segnare pagamenti e
  riconsegne, esportare tutto in CSV.
* **Richieste** — informazioni, test drive, finanziamenti, permute e preventivi,
  con lo stato di lavorazione e i recapiti a un tocco.
* **Appuntamenti** — il calendario di lavoro della cabina detailing.
* **Clienti** — anagrafica, allegato di fatture e contratti, storico acquisti,
  reimpostazione della password.
* **Recensioni** — trascrivere quelle di Google e Facebook, pubblicarle o
  nasconderle. La media mostrata sul sito e nei dati per Google si calcola da qui.
* **Blog** — scrivere e pubblicare articoli in un formato di testo semplice.
* **Offerte** — promozioni in home, che scadono da sole alla data indicata.
* **Messaggi** — quanto arriva dal modulo contatti e dalla chat, più gli
  iscritti alla newsletter.
* **Statistiche** — andamento a dodici mesi di richieste, noleggi, appuntamenti
  e registrazioni, composizione del catalogo.
* **Orari** — aperture di salone e officina, riflesse ovunque sul sito.

## Configurazione

Tutte le variabili stanno in [`.env.example`](.env.example). Il sito pubblico
funziona senza nessuna di esse.

| Variabile | Serve a |
| --- | --- |
| `NEXT_PUBLIC_SITO` | Canonical, sitemap, Open Graph e ritorni dai pagamenti |
| `PANNELLO_PASSWORD`, `PANNELLO_SEGRETO` | Pannello e sessioni dell'area clienti — **obbligatorie in produzione** |
| `DATABASE_URL` | Attiva il deposito PostgreSQL al posto del file JSON |
| `RESEND_API_KEY`, `POSTA_MITTENTE`, `POSTA_STAFF` | Email di conferma e avvisi allo staff |
| `TWILIO_*` | Promemoria via SMS |
| `STRIPE_SECRET_KEY` | Pagamento con carta dell'acconto di noleggio |
| `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | Pagamento con PayPal |
| `NEXT_PUBLIC_GA_ID` | Google Analytics, caricato solo dopo il consenso |

Senza chiavi di pagamento il metodo online non viene proposto e il noleggio si
chiude con il saldo al ritiro. Senza chiavi email le prenotazioni vengono
comunque registrate e compaiono nel pannello: in console si vede il messaggio
che sarebbe partito.

## Dove finiscono i dati

L'archivio ha due depositi intercambiabili, scelti automaticamente:

* **PostgreSQL**, quando `DATABASE_URL` è impostata. Ogni collezione (veicoli,
  noleggi, clienti…) è una riga della tabella `archivio` con il contenuto in
  una colonna `jsonb`; la tabella viene creata al primo avvio e le scritture
  avvengono in transazione. È la scelta obbligata sulle piattaforme serverless,
  dove il disco non è scrivibile.
* **File JSON** altrimenti, in `dati-locali/archivio.json`, con scrittura
  atomica. Va benissimo su un server singolo.

Il resto del progetto non sa quale dei due sia attivo: conosce solo `leggi`,
`scrivi` e `modifica` in [`src/lib/archivio.ts`](src/lib/archivio.ts).

Il pacchetto `pg` è una dipendenza **facoltativa**: chi resta sul deposito su
file non deve installarlo.

## Le fotografie

Il progetto non scarica immagini da servizi esterni. `npm run immagini` le
compone con `sharp`: gradienti profondi, silhouette di veicoli in controluce,
scie di luce blu e una grana leggera, tutto coerente con la palette del sito.
Sono segnaposto dichiarati, non fotografie vere.

Quando arrivano gli scatti veri basta sovrascrivere i file dentro
`public/immagini/` mantenendo gli stessi nomi: nessuna modifica al codice. Lo
script segnala da solo se un veicolo del catalogo è rimasto senza fotografie.

L'apertura della home usa un filmato se lo trova in `public/video/apertura.mp4`
(o `.webm`); altrimenti alterna tre immagini con una dissolvenza lenta. Il video
non è incluso perché pesa decine di megabyte e non ha senso versionarlo.

## Struttura

```
src/
  app/
    (sito)/          pagine pubbliche, con intestazione e piè di pagina
    admin/           pannello di gestione
    api/             rotte REST
  componenti/
    admin/           schermate di gestione
    animazioni/      comparse e contatori
    catalogo/        ricerca e filtri
    clienti/         area riservata
    comuni/          consenso, cookie, chat, PWA
    contatti/        mappa e modulo
    detailing/       confronto prima/dopo e prenotazione
    finanziamenti/   simulatore di rata
    home/            sezioni della pagina iniziale
    layout/          marchio, intestazione, piè di pagina, tema
    moduli/          modulo unico delle richieste commerciali
    noleggio/        calendario, prenotazione, esito del pagamento
    ui/              pulsanti, campi, icone, finestre, sezioni
    veicoli/         scheda, galleria, azioni
  dati/              anagrafica, catalogo iniziale, servizi, contenuti
  lib/               archivio, depositi, tipi, SEO, pagamenti, posta, sessioni
scripts/             generatore delle immagini
public/              immagini, marchio, service worker, pagina offline
```

## Scelte tecniche

**Il filtraggio del catalogo avviene nel browser.** Qualche decina di veicoli sta
in pochi chilobyte: mandarli tutti una volta sola dà risultati immediati a ogni
tocco invece di una richiesta per ogni spunta. Le funzioni di
[`src/lib/catalogo.ts`](src/lib/catalogo.ts) sono pure e girano identiche sul
server, quindi una ricerca condivisa arriva già filtrata anche ai motori di
ricerca. Se un giorno i veicoli fossero migliaia, la strada è invertire i due
lati senza riscrivere le regole.

**I prezzi si ricalcolano sempre sul server.** Il totale mostrato durante la
prenotazione è un'anteprima; quello che finisce nell'archivio lo calcola la
rotta API con le stesse funzioni di [`src/lib/noleggio.ts`](src/lib/noleggio.ts),
perché i dati nel browser sono modificabili. Lì sta anche la regola che applica
la combinazione di tariffe più conveniente: sette giorni costano una settimana,
non sette giornate.

**Il consenso ai cookie blocca davvero.** Analytics e mappa di Google non
vengono inseriti nella pagina finché la scelta non è esplicita: non basta non
inizializzarli, perché il solo caricamento dello script deposita dati. Senza
consenso, al posto della mappa c'è un segnaposto con il collegamento alle
indicazioni, che funziona comunque.

**La chat è interna.** I messaggi finiscono nella stessa casella del modulo
contatti e lo staff li legge dal pannello. Una chat di terze parti costerebbe
uno script pesante, cookie da dichiarare e i dati dei visitatori consegnati a un
fornitore, per un'attività che riceve qualche messaggio al giorno.

**Le password dei clienti non esistono in chiaro.** Si conserva l'impronta
prodotta da scrypt con un sale casuale diverso per ciascuno. Nemmeno lo staff
può leggerle: dal pannello si possono solo sostituire.

**Nessuna richiesta a domini esterni al primo caricamento.** Caratteri, icone e
fotografie stanno tutti sul dominio del sito.

## Accessibilità

Contrasti verificati sulle soglie WCAG AA in entrambi i temi; il blu del tema
chiaro è volutamente profondo per reggere il testo piccolo. Ogni campo ha
un'etichetta collegata, le icone decorative sono nascoste ai lettori di schermo,
i grafici del pannello hanno una tabella equivalente. Il carosello delle
recensioni si ferma al passaggio del puntatore e quando un elemento riceve il
fuoco da tastiera. Chi ha ridotto le animazioni di sistema vede il sito fermo,
con tutti i contenuti visibili.

## PWA

Il sito è installabile: manifesto con icone e scorciatoie, e un registratore di
servizio che tiene in cache le risorse statiche e mostra una pagina di cortesia
quando manca la rete. Le pagine non vengono servite dalla cache di proposito: su
un sito dove prezzi e disponibilità cambiano ogni giorno, mostrare come
disponibile un veicolo venduto la settimana prima farebbe più danni che vantaggi.
