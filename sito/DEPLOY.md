# Pubblicare il sito su Vercel

Guida completa: dal repository a un URL pubblico funzionante, fino al collegamento del dominio.
Servono circa 20 minuti, di cui la metà di attesa per il DNS.

Tutto ciò che riguarda il codice è già pronto (`vercel.json`, variabili d'ambiente documentate,
build verificata). Restano i passaggi che richiedono i tuoi account: Vercel, Supabase e il
registrar del dominio.

---

## 0. Prima di iniziare

| Cosa serve | Note |
| --- | --- |
| Account GitHub con il repository | già presente: `stepp8989/ioriparo` |
| Account Vercel | registrati su [vercel.com](https://vercel.com) con GitHub: è il modo più rapido |
| Account Supabase | facoltativo al primo deploy, necessario per moduli e pannello |
| Dominio | quello che vuoi collegare (es. `ioriparo.it`) |

> **Piano Vercel**: il piano Hobby è gratuito ma, secondo le condizioni d'uso di Vercel, è
> riservato a progetti non commerciali. Per il sito di un'attività serve il piano Pro. Puoi
> comunque pubblicare subito su Hobby per vedere il sito online e passare a Pro prima di
> collegare il dominio aziendale.

### Il ramo da pubblicare

Il sito vive nel ramo `claude/io-riparo-website-reymou`, che **non** è il ramo predefinito del
repository. Hai due strade:

- **Consigliata**: unisci il ramo in quello predefinito prima di importare il progetto, così i
  deploy di produzione seguono il ramo principale.
- **Alternativa**: in Vercel, *Settings → Git → Production Branch*, imposta
  `claude/io-riparo-website-reymou`.

---

## 1. Supabase (database, login e archivio immagini)

Puoi saltare questo passaggio e farlo dopo: senza Supabase il sito è online e completo, ma i
moduli rispondono in modalità dimostrativa e il pannello amministratore non è utilizzabile.

1. Su [supabase.com](https://supabase.com) crea un progetto (regione consigliata: *Europe (Frankfurt)*).
2. Apri **SQL Editor**, incolla il contenuto di [`supabase/schema.sql`](./supabase/schema.sql) ed
   esegui. Crea tabelle, indici, policy RLS, il bucket `media` e il catalogo dei servizi.
3. Vai in **Authentication → Users → Add user**, crea l'utenza dello staff con email e password
   (spunta *Auto Confirm User*). Sarà l'accesso a `/admin`: la registrazione pubblica non esiste.
4. In **Project Settings → API** copia:
   - *Project URL* → `NEXT_PUBLIC_SUPABASE_URL`
   - chiave *anon public* → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - chiave *service_role* → `SUPABASE_SERVICE_ROLE_KEY` (**segreta**: mai in un file del repository,
     mai in una variabile che inizia con `NEXT_PUBLIC_`)

---

## 2. Importare il progetto su Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → scegli `stepp8989/ioriparo`.
   Se non compare, autorizza l'app GitHub di Vercel sul repository.
2. Nella schermata di configurazione:
   - **Root Directory**: premi *Edit* e seleziona `sito` ← **passaggio fondamentale**, altrimenti
     Vercel prova a costruire il gestionale nella radice.
   - **Framework Preset**: si imposta da solo su *Next.js*.
   - **Build Command** e **Output Directory**: lascia i valori predefiniti.
3. Apri **Environment Variables** e inserisci quelle del punto 3 qui sotto.
4. **Deploy**. Il primo build richiede 1–3 minuti.

Al termine ottieni un URL tipo `https://ioriparo.vercel.app`: il sito è già online e pubblico.

---

## 3. Variabili d'ambiente

Inseriscile in *Settings → Environment Variables*, selezionando tutti gli ambienti
(*Production*, *Preview*, *Development*).

### Indispensabili

| Nome | Valore | Perché |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | prima `https://ioriparo.vercel.app`, poi il dominio definitivo | canonical, sitemap, Open Graph |
| `NEXT_PUBLIC_TELEFONO` | es. `+393401234567` | pulsante *Chiama Ora* e dati strutturati |
| `NEXT_PUBLIC_WHATSAPP` | es. `+393401234567` | pulsante WhatsApp |
| `NEXT_PUBLIC_EMAIL` | es. `info@ioriparo.it` | contatti e modulo |
| `NEXT_PUBLIC_PARTITA_IVA` | la tua partita IVA | footer e privacy policy |

> I valori attualmente nel codice sono **segnaposto** (`+39 350 000 0000`, `00000000000`).
> Vanno sostituiti prima di annunciare il sito.

### Per moduli e pannello amministratore

| Nome | Valore |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL di Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chiave anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | chiave service_role (segreta) |
| `SUPABASE_BUCKET` | `media` |

### Facoltative

| Nome | A cosa serve |
| --- | --- |
| `RESEND_API_KEY` | notifiche email a ogni richiesta ([resend.com](https://resend.com), piano gratuito sufficiente) |
| `EMAIL_MITTENTE` | es. `Io Riparo <noreply@ioriparo.it>` (il dominio va verificato su Resend) |
| `EMAIL_DESTINATARIO` | dove ricevere le notifiche |
| `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID` | importa le recensioni reali dalla scheda Google |
| `NEXT_PUBLIC_GOOGLE_PROFILO`, `NEXT_PUBLIC_GOOGLE_RECENSIONI` | link alla scheda e al modulo recensione |
| `NEXT_PUBLIC_FACEBOOK`, `NEXT_PUBLIC_INSTAGRAM` | profili social nel footer |

**Dopo ogni modifica alle variabili serve un nuovo deploy** (*Deployments → … → Redeploy*):
Next.js incorpora le variabili `NEXT_PUBLIC_*` durante il build.

---

## 4. Verificare che sia tutto a posto

Dal tuo computer, con il repository clonato:

```bash
cd sito
npm run verifica-online https://ioriparo.vercel.app
```

Controlla pagine, sitemap, robots, immagine Open Graph, protezione dell'area riservata e
coerenza del dominio nei canonical. Finché non colleghi il dominio, gli ultimi due controlli
falliscono se `NEXT_PUBLIC_SITE_URL` non coincide con l'indirizzo che stai verificando.

Da controllare anche a mano:

- la home si apre e il tema scuro/chiaro funziona;
- *Richiedi Preventivo* invia davvero (con Supabase configurato arriva in `/admin/preventivi`);
- `/admin` chiede il login e le credenziali Supabase funzionano.

---

## 5. Collegare il dominio

1. In Vercel: *Settings → Domains → Add*. Inserisci il dominio, ad esempio `ioriparo.it`.
   Aggiungi **anche** `www.ioriparo.it`: Vercel propone da solo il reindirizzamento fra i due.
   Scegli quale è il principale (con `www` o senza) e lascia che l'altro rimandi lì.
2. Vercel mostra i record DNS da creare. **Copia esattamente i valori indicati nel pannello**,
   perché cambiano nel tempo. Di norma sono:
   - dominio senza `www`: record **A** su `@` verso l'indirizzo IP indicato da Vercel
     (storicamente `76.76.21.21`, oggi spesso `216.198.79.1`);
   - `www`: record **CNAME** verso `cname.vercel-dns.com`.
3. Inserisci i record nel pannello del registrar (Aruba, Register, GoDaddy, Namecheap…).
   Elimina eventuali vecchi record A o CNAME sugli stessi nomi, altrimenti restano in conflitto.
4. Attendi la propagazione: di solito 10–60 minuti, in rari casi fino a 24 ore. Vercel emette il
   certificato HTTPS da solo quando il DNS è corretto.

Per controllare la propagazione:

```bash
dig +short ioriparo.it
dig +short www.ioriparo.it
```

### Se le email passano dallo stesso dominio

Non toccare i record **MX** e i TXT di SPF/DKIM: riguardano la posta e sono indipendenti dai
record del sito. Cambia solo i record A/CNAME che Vercel richiede.

---

## 6. Dopo il collegamento del dominio

1. Aggiorna `NEXT_PUBLIC_SITE_URL` con il dominio definitivo (es. `https://www.ioriparo.it`)
   e fai un **Redeploy**: senza questo passaggio sitemap, canonical e anteprime social
   continuano a puntare all'indirizzo `.vercel.app`.
2. Rilancia la verifica:

   ```bash
   npm run verifica-online https://www.ioriparo.it
   ```

3. Registra il sito su [Google Search Console](https://search.google.com/search-console),
   verifica la proprietà e invia `https://www.ioriparo.it/sitemap.xml`.
4. Sul profilo **Google Business** dell'attività inserisci l'indirizzo del sito: è il fattore
   che pesa di più per le ricerche locali "riparazione smartphone Tortolì".
5. Se usi WhatsApp Business, controlla che il numero in `NEXT_PUBLIC_WHATSAPP` sia quello
   collegato all'account.
6. Sostituisci le foto segnaposto della galleria (`public/galleria/`) con foto reali del
   laboratorio e delle riparazioni, oppure caricale dal pannello *Immagini*.

---

## In alternativa: deploy da riga di comando

```bash
npm i -g vercel
cd sito
vercel login
vercel link            # collega la cartella al progetto Vercel
vercel env add NEXT_PUBLIC_SITE_URL production
# … ripeti per le altre variabili
vercel --prod          # pubblica
```

`vercel link` chiede la *Root Directory*: indica `sito` se lanci il comando dalla radice del
repository, oppure lascia `.` se sei già dentro `sito/`.

---

## Problemi frequenti

| Sintomo | Causa e rimedio |
| --- | --- |
| Il build fallisce con "No Next.js version detected" | *Root Directory* non impostata su `sito` |
| Il sito si vede ma i moduli dicono "modalità dimostrativa" | mancano le variabili Supabase, oppure manca `SUPABASE_SERVICE_ROLE_KEY` |
| `/admin` mostra "Supabase non è configurato" | stesse variabili mancanti; dopo averle aggiunte serve un redeploy |
| Accesso al pannello rifiutato | l'utente va creato in *Supabase → Authentication → Users*, non dal sito |
| Le anteprime su WhatsApp o Facebook mostrano il vecchio indirizzo | `NEXT_PUBLIC_SITE_URL` non aggiornata, oppure la cache del social: usa il debugger di Facebook per forzare il refresh |
| Le immagini caricate dal pannello non si vedono | `NEXT_PUBLIC_SUPABASE_URL` deve essere presente **al momento del build** (è usata in `next.config.ts` per autorizzare il dominio delle immagini): fai un redeploy dopo averla aggiunta |
| Il dominio resta "Invalid Configuration" | record DNS non ancora propagati o in conflitto con vecchi record A/CNAME |
| Errore 429 inviando più moduli di fila | è il limite anti-spam: 5 invii ogni 10 minuti per indirizzo IP |

---

## Nota sulla sicurezza

- `SUPABASE_SERVICE_ROLE_KEY` dà accesso completo al database ignorando le policy: tienila solo
  fra le variabili d'ambiente di Vercel. Se pensi che sia stata esposta, rigenerala da Supabase.
- L'area `/admin` è esclusa da `robots.txt` e protetta dal middleware, ma la vera barriera è la
  password dell'utente Supabase: usane una lunga e attiva l'autenticazione a due fattori
  sull'account Supabase.
- L'intestazione `Strict-Transport-Security` è impostata a un anno senza `preload`. Se in futuro
  tutti i sottodomini saranno su HTTPS, puoi rafforzarla in `vercel.json` aggiungendo
  `includeSubDomains; preload`.
