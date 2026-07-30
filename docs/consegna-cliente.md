# Consegnare il gestionale a un cliente

Ogni cliente ha **il suo archivio** e **la sua pubblicazione**. Il programma è
lo stesso per tutti: una correzione vale per tutti. I dati no — quelli stanno in
database separati, e non si toccano nemmeno per sbaglio.

Tempo: 30-45 minuti a cliente, la prima volta un'ora.

---

## Cosa serve prima di cominciare

- Un account **Vercel** a pagamento (uno solo, copre tutti i clienti)
- La sua **email** per l'accesso
- Il suo **logo** e i suoi dati (nome, indirizzo, P.IVA, telefono)
- Il contratto firmato e la nomina a responsabile del trattamento

---

## 1. Supabase — il suo archivio

1. [supabase.com](https://supabase.com) → **New project**
2. **Regione: Frankfurt (EU Central)** — i dati dei suoi clienti restano in
   Europa, e con il GDPR è la scelta che non ti fa fare domande
3. Nome del progetto: quello del cliente
4. Password del database: generala e **salvala nel tuo gestore di password**.
   Non la rivedrai
5. **Piano Pro.** Non il gratuito: si mette in pausa da solo dopo un periodo di
   inattività e non ha salvataggi seri. Se perdi i dati di un'officina, rispondi
   tu

## 2. Le tabelle

**SQL Editor** → incolla tutto il contenuto di `supabase/schema.sql` → **Run**.

Se compare *«Potential issues detected»*, è normale: prosegui.

## 3. Il suo accesso

**Authentication → Users → Add user**

- La sua email
- Una password provvisoria (la cambia lui al primo accesso)
- Spunta **Auto Confirm User**, altrimenti resta in attesa di una conferma che
  non arriverà mai

## 4. Le chiavi

**Project Settings → API keys**. Ti servono due cose:

- **Project URL** (`https://xxxx.supabase.co`)
- La chiave **publishable / anon**

> ⚠️ La chiave **secret / service_role non si copia da nessuna parte.** Non nel
> sito, non in un messaggio, non in un file. È quella che scavalca ogni
> controllo: chi ce l'ha legge e cancella tutto l'archivio.

## 5. Vercel — la pubblicazione

**Add New → Project** → importa **lo stesso repository** degli altri.

Variabili d'ambiente:

| Nome | Valore |
|---|---|
| `VITE_SUPABASE_URL` | il Project URL **del cliente** |
| `VITE_SUPABASE_ANON_KEY` | la chiave publishable **del cliente** |
| `VITE_SOLO_GESTIONALE` | `1` |

`VITE_SOLO_GESTIONALE=1` è quella che tiene fuori il sito di Io Riparo. **Senza,
il suo indirizzo mostra il tuo sito**: chi siamo, le tue foto, le tue
recensioni, i tuoi contatti.

Poi **Deploy**.

## 6. Il dominio

Il suo (`gestionale.suonegozio.it`): in Vercel **Settings → Domains**, e lui
aggiunge il CNAME che Vercel gli indica.

Oppure un sottodominio tuo, se non ne ha uno.

## 7. Chiudere il giro su Supabase

**Authentication → URL Configuration → Site URL** = il dominio appena
collegato. Serve al ripristino della password: senza, il collegamento che
riceve per email lo porterebbe altrove.

---

## 8. Prova tu, prima di consegnare

Apri l'indirizzo **in una finestra anonima**:

- Esce la **schermata di accesso** (non un sito, non una pagina bianca)
- Entri con l'utente creato
- Compare l'avviso **«Manca ancora qualcosa sulla tua attività»**
- In alto a sinistra c'è scritto **Gestionale**, non Io Riparo

Se una di queste non torna, fermati: c'è qualcosa di storto nelle variabili.

## 9. Mezz'ora insieme a lui

1. Cambia la password
2. **Impostazioni**: dati dell'attività e **logo** → *Salva impostazioni*
3. Fate una **scheda di prova** e stampatela: l'intestazione deve essere la sua
4. Cancellate la scheda di prova
5. Mostragli **Backup ed esportazioni**: sono i suoi dati e se li può portare
   via quando vuole. Dirlo tu prima che lo chieda lui vale molto

## 10. Consegna

- Indirizzo, email, password
- Contratto e nomina firmati
- Fattura dell'avviamento

---

## Dopo: quando correggi qualcosa

Fai il push sul repository e **ogni pubblicazione si aggiorna da sola**. È il
motivo per cui tutti i clienti stanno sullo stesso repository.

Controlla che il progetto Vercel del cliente sia agganciato al ramo giusto:
**Settings → Environments → Production → Branch Tracking**.

Dopo una modifica che tocca il database, lo schema va aggiornato **su ogni
archivio**, uno per uno. Tienine il conto.

---

## Cosa non gli dai mai

- **Il codice sorgente.** Compra il servizio, non il programma
- **La chiave secret** del suo Supabase (e nemmeno del tuo)
- **L'accesso alla tua organizzazione Supabase**, dove ci sono gli archivi degli
  altri clienti

Se un giorno se ne va, si porta via **i suoi dati** — c'è l'esportazione — non
il software.

---

## Quello che ancora non c'è

Da dire al cliente **prima** di firmare, non dopo:

- **La fattura elettronica non la emette.** Continua con il programma che usa
  già, che è anche quello che manda allo SdI
- **I permessi per dipendente non ci sono**: chi entra vede tutto, incassi
  compresi
- **Le condizioni di servizio stampate sulla scheda sono quelle di Io Riparo**
  (garanzia 6/3 mesi, 90 giorni per il ritiro, acconto non restituito). Portano
  il nome giusto, ma le clausole sono quelle: finché non diventano modificabili
  dalle impostazioni, vanno lette insieme a lui
