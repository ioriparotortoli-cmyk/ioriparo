# Io Riparo — Sito web

Sito pubblico del centro assistenza informatica **Io Riparo** (Tortolì, NU): vetrina dei servizi,
preventivi online con foto del dispositivo, prenotazione appuntamenti, recensioni, galleria e
pannello amministratore protetto.

Applicazione **Next.js 15 + React 19 + TypeScript + Tailwind CSS v4**, con **Framer Motion** per le
animazioni, **Lucide** per le icone, **Supabase** come database/storage/autenticazione e **Resend**
per le notifiche email. Tutto il backend è serverless (route handler e server action di Next).

## Avvio rapido

```bash
cd sito
npm install
cp .env.example .env.local   # facoltativo: il sito parte anche senza
npm run dev                  # http://localhost:3000
```

Altri comandi:

```bash
npm run build      # build di produzione
npm run start      # avvio della build (http://localhost:3000)
npm run typecheck  # controllo dei tipi
npm run immagini   # rigenera og.png e le icone PWA
npm run anteprima  # genera anteprima/index.html (vedi sotto)
```

Gli stessi comandi sono richiamabili dalla radice del repository:

```bash
npm run sito:install
npm run sito:dev
npm run sito:build && npm run sito:start
```

## Anteprima in un unico file

`npm run anteprima` produce `anteprima/index.html`: una copia autonoma della home
(CSS, caratteri e immagini incorporati, nessuna richiesta esterna) che si apre con un doppio clic
o si pubblica su qualsiasi hosting statico. Riusa il markup e il CSS della build reale, quindi non
va tenuta allineata a mano; va rigenerata dopo le modifiche, con il sito in esecuzione:

```bash
npm run build && npm run start   # in un terminale
npm run anteprima                # in un altro
```

Restano attivi tema chiaro/scuro, filtri dei servizi e della galleria, domande frequenti e
ingrandimento delle foto. Non essendoci un server, i moduli e le altre pagine non sono
raggiungibili: è un'anteprima della home, non un sostituto del sito.

> Il sito funziona **anche senza alcuna variabile d'ambiente**: usa i contenuti statici e i moduli
> rispondono in "modalità dimostrativa" (nessun dato salvato). Configurando Supabase e Resend
> diventa pienamente operativo.

## Struttura

```
sito/
  src/app/
    layout.tsx            metadati SEO, Open Graph, JSON-LD, tema, header/footer
    page.tsx              home: hero, offerte, servizi, perché noi, processo,
                          recensioni, galleria, FAQ, richiamo finale, contatti
    preventivo/           modulo preventivo con caricamento foto
    prenota/              prenotazione appuntamenti online
    privacy-policy/ cookie-policy/   informative
    api/                  route serverless: preventivi, appuntamenti, contatti
    admin/                area riservata (login, riepilogo, gestione contenuti)
    sitemap.ts robots.ts manifest.ts
  src/components/
    layout/               header, footer, logo, ricerca, tema, pulsanti flottanti
    sezioni/              sezioni della home
    moduli/               moduli e campi condivisi
    admin/                componenti del pannello
    ui/                   bottoni, sezioni, animazioni di comparsa
  src/lib/
    config/sito.ts        dati aziendali e contatti (da variabili d'ambiente)
    dati/                 catalogo servizi, contenuti, offerte
    supabase/             client browser, server e service role
    seo.ts                dati strutturati schema.org
    validazione.ts        schemi zod dei moduli
    email.ts              notifiche via Resend
  supabase/schema.sql     tabelle, policy RLS e bucket storage
  public/                 logo, favicon, og.png, immagini della galleria
```

## Configurazione

Copia `.env.example` in `.env.local`. Le variabili più importanti:

| Variabile | A cosa serve |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | dominio pubblico (canonical, sitemap, Open Graph) |
| `NEXT_PUBLIC_TELEFONO` / `NEXT_PUBLIC_WHATSAPP` | pulsanti "Chiama Ora" e WhatsApp |
| `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PARTITA_IVA` | contatti e dati fiscali nel footer |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | database e login del pannello |
| `SUPABASE_SERVICE_ROLE_KEY` | scrittura dei moduli pubblici dalle route API |
| `RESEND_API_KEY`, `EMAIL_DESTINATARIO` | notifiche email allo staff |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | importazione automatica delle recensioni Google |

> **Da personalizzare prima della pubblicazione**: telefono, WhatsApp, email, partita IVA e link
> social sono valori segnaposto. Impostali via variabili d'ambiente (nessuna modifica al codice).

### Supabase

1. Crea un progetto su [supabase.com](https://supabase.com).
2. Apri *SQL Editor* ed esegui `supabase/schema.sql`: crea tabelle, indici, policy RLS,
   il bucket `media` e popola il catalogo servizi.
3. In *Authentication → Users* crea l'utente dello staff (email + password): sarà l'accesso a
   `/admin`. La registrazione pubblica non è prevista.
4. Copia URL e chiavi da *Project Settings → API* nel file `.env.local`.

### Recensioni Google

Con `GOOGLE_PLACES_API_KEY` (Places API New) e `GOOGLE_PLACE_ID` la sezione recensioni importa
automaticamente quelle reali della scheda Google, con cache giornaliera. Senza le chiavi mostra le
recensioni pubblicate dal pannello e, in mancanza, quelle predefinite.

### Notifiche email

Con `RESEND_API_KEY` ogni preventivo, appuntamento e messaggio genera una email allo staff
(`EMAIL_DESTINATARIO`) con *reply-to* già impostato sul cliente.

## Pannello amministratore

Area protetta su `/admin` (login Supabase, sessione via cookie, accesso filtrato dal middleware).

| Sezione | Cosa permette |
| --- | --- |
| Riepilogo | preventivi da lavorare, appuntamenti in arrivo, messaggi non letti, tasso di accettazione, andamento a sei mesi |
| Preventivi | lettura delle richieste con foto, cambio stato, eliminazione |
| Appuntamenti | conferma, completamento o annullamento delle prenotazioni |
| Messaggi | messaggi del modulo contatti |
| Servizi e prezzi | creazione e modifica dei servizi mostrati in home (titolo, descrizione, icona, categoria, prezzo, tempi, ordine, visibilità) |
| Offerte | promozioni pubblicate in cima alla home, con scadenza |
| Recensioni | recensioni pubblicate sul sito quando Google non è collegato |
| Immagini | caricamento su Supabase Storage e copia dell'URL pubblico |

## SEO e prestazioni

- Metadati completi, canonical, Open Graph e Twitter Card con immagine `og.png` generata.
- Dati strutturati `LocalBusiness`/`ComputerRepairService`, `WebSite`, `FAQPage` e `BreadcrumbList`.
- `sitemap.xml`, `robots.txt` e `manifest.webmanifest` generati da Next.
- Home statica con rigenerazione oraria (ISR); nessuna libreria di grafici o UI pesante.
- Font `Inter` self-hosted da `next/font`, immagini vettoriali, JavaScript iniziale ridotto
  (~100 kB condivisi).
- Animazioni disattivate automaticamente con `prefers-reduced-motion`.
- Intestazioni di sicurezza (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`) e protezione anti-spam sui moduli (campo trappola + limite di frequenza).

## Sostituire le immagini della galleria

Le foto in `public/galleria/*.svg` sono segnaposto vettoriali. Sostituiscile con foto reali
(stesso nome file, oppure aggiorna `src/lib/dati/contenuti.ts`) oppure caricale dal pannello
*Immagini* e usa gli URL pubblici di Supabase Storage.

## Pubblicazione

Guida completa passo per passo, dal repository al dominio collegato:
**[DEPLOY.md](./DEPLOY.md)**.

In breve, su Vercel (o qualsiasi host che supporti Next.js in modalità server):

1. Importa il repository e imposta la *Root Directory* su `sito/`.
2. Aggiungi le variabili d'ambiente del file `.env.example`.
3. Distribuisci: le route API e le server action girano come funzioni serverless.
4. Verifica il risultato con `npm run verifica-online https://iltuodominio.it`.

`vercel.json` fissa la regione delle funzioni su Francoforte (`fra1`), l'intestazione HSTS e la
cache delle immagini statiche.
