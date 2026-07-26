-- ---------------------------------------------------------------------------
-- Io Riparo — schema del database (Supabase / PostgreSQL)
--
-- Esegui l'intero file nell'SQL Editor del progetto Supabase.
-- Crea tabelle, indici, policy RLS e il bucket di archiviazione delle immagini.
--
-- Modello di sicurezza:
--   · i moduli pubblici scrivono attraverso le route API con la service role key
--     (che ignora RLS), quindi nessuna policy di inserimento anonimo è necessaria;
--   · il pannello amministratore legge e scrive con la sessione dell'utente:
--     tutte le policy richiedono un utente autenticato;
--   · servizi, offerte e recensioni pubblicate sono leggibili anche in anonimo,
--     così il sito può mostrarli anche senza service role key.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------- servizi ----
create table if not exists public.servizi (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  titolo       text not null,
  descrizione  text not null default '',
  icona        text not null default 'ricambi',
  categoria    text not null default 'Riparazioni'
               check (categoria in ('Dispositivi', 'Riparazioni', 'Software', 'Sistemi')),
  prezzo_da    numeric(10, 2),
  tempi        text not null default 'su preventivo',
  attivo       boolean not null default true,
  ordine       integer,
  creato_il    timestamptz not null default now()
);

create index if not exists servizi_attivo_ordine_idx on public.servizi (attivo, ordine);

-- ------------------------------------------------------------ preventivi ----
create table if not exists public.preventivi (
  id           uuid primary key default gen_random_uuid(),
  riferimento  text not null unique,
  nome         text not null,
  telefono     text not null,
  email        text not null,
  dispositivo  text not null,
  servizio     text,
  problema     text not null,
  foto         text[] not null default '{}',
  stato        text not null default 'nuovo'
               check (stato in ('nuovo', 'inviato', 'accettato', 'rifiutato', 'completato')),
  prezzo       numeric(10, 2),
  note_interne text,
  creato_il    timestamptz not null default now()
);

create index if not exists preventivi_stato_idx on public.preventivi (stato);
create index if not exists preventivi_creato_idx on public.preventivi (creato_il desc);

-- ---------------------------------------------------------- appuntamenti ----
create table if not exists public.appuntamenti (
  id           uuid primary key default gen_random_uuid(),
  riferimento  text not null unique,
  nome         text not null,
  telefono     text not null,
  email        text not null,
  servizio     text not null,
  data         date not null,
  ora          text not null,
  modalita     text not null default 'negozio'
               check (modalita in ('negozio', 'domicilio', 'remoto')),
  note         text,
  stato        text not null default 'richiesto'
               check (stato in ('richiesto', 'confermato', 'completato', 'annullato')),
  creato_il    timestamptz not null default now()
);

-- Uno slot per volta: l'unicità evita doppie prenotazioni.
create unique index if not exists appuntamenti_slot_idx
  on public.appuntamenti (data, ora)
  where stato <> 'annullato';

create index if not exists appuntamenti_data_idx on public.appuntamenti (data);

-- --------------------------------------------------------------- messaggi ---
create table if not exists public.messaggi (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  email      text not null,
  telefono   text,
  messaggio  text not null,
  stato      text not null default 'nuovo' check (stato in ('nuovo', 'letto', 'completato')),
  creato_il  timestamptz not null default now()
);

create index if not exists messaggi_stato_idx on public.messaggi (stato);

-- ---------------------------------------------------------------- offerte ---
create table if not exists public.offerte (
  id           uuid primary key default gen_random_uuid(),
  titolo       text not null,
  descrizione  text not null default '',
  sconto       text,
  valida_fino  date,
  immagine     text,
  pubblicata   boolean not null default true,
  creata_il    timestamptz not null default now()
);

-- ------------------------------------------------------------- recensioni ---
create table if not exists public.recensioni (
  id           uuid primary key default gen_random_uuid(),
  autore       text not null,
  testo        text not null,
  valutazione  smallint not null default 5 check (valutazione between 1 and 5),
  dispositivo  text,
  data_testo   text,
  pubblicata   boolean not null default true,
  creata_il    timestamptz not null default now()
);

-- ------------------------------------------------------------------- RLS ----
alter table public.servizi      enable row level security;
alter table public.preventivi   enable row level security;
alter table public.appuntamenti enable row level security;
alter table public.messaggi     enable row level security;
alter table public.offerte      enable row level security;
alter table public.recensioni   enable row level security;

-- Lettura pubblica dei soli contenuti pubblicati.
drop policy if exists "servizi leggibili" on public.servizi;
create policy "servizi leggibili" on public.servizi
  for select using (attivo = true);

drop policy if exists "offerte leggibili" on public.offerte;
create policy "offerte leggibili" on public.offerte
  for select using (pubblicata = true);

drop policy if exists "recensioni leggibili" on public.recensioni;
create policy "recensioni leggibili" on public.recensioni
  for select using (pubblicata = true);

-- Lo staff autenticato ha pieno accesso a tutte le tabelle.
do $$
declare
  tabella text;
begin
  foreach tabella in array array['servizi', 'preventivi', 'appuntamenti', 'messaggi', 'offerte', 'recensioni']
  loop
    execute format('drop policy if exists "staff gestisce %1$s" on public.%1$I', tabella);
    execute format(
      'create policy "staff gestisce %1$s" on public.%1$I for all to authenticated using (true) with check (true)',
      tabella
    );
  end loop;
end $$;

-- --------------------------------------------------------------- storage ----
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media lettura pubblica" on storage.objects;
create policy "media lettura pubblica" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media gestione staff" on storage.objects;
create policy "media gestione staff" on storage.objects
  for all to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

-- ------------------------------------------------------- dati di partenza ---
-- Popola i servizi con il catalogo predefinito del sito (facoltativo:
-- se la tabella resta vuota il sito usa il catalogo statico del codice).
insert into public.servizi (slug, titolo, descrizione, icona, categoria, prezzo_da, tempi, ordine)
values
  ('riparazione-smartphone', 'Riparazione Smartphone', 'Diagnosi e riparazione di tutte le marche: Apple, Samsung, Xiaomi, Huawei, Oppo e altri.', 'smartphone', 'Dispositivi', 39, '30 min – 24 h', 1),
  ('riparazione-tablet', 'Riparazione Tablet', 'iPad e tablet Android: vetro, display, batteria, ricarica e problemi software.', 'tablet', 'Dispositivi', 49, '1 – 3 giorni', 2),
  ('riparazione-pc-windows', 'Riparazione PC Windows', 'Notebook e desktop: avvio bloccato, schermata blu, hardware guasto e upgrade SSD.', 'monitor', 'Dispositivi', 35, '1 – 3 giorni', 3),
  ('riparazione-mac', 'Riparazione Mac', 'MacBook, iMac e Mac mini: sostituzione componenti, liquidi, macOS e migrazione dati.', 'laptop', 'Dispositivi', 59, '2 – 5 giorni', 4),
  ('sostituzione-display', 'Sostituzione Display', 'Vetro rotto o touch che non risponde: display originali o compatibili di alta qualità.', 'schermo', 'Riparazioni', 49, '30 – 90 min', 5),
  ('cambio-batteria', 'Cambio Batteria', 'Autonomia dimezzata o spegnimenti improvvisi: batteria nuova certificata e test di ciclo.', 'batteria', 'Riparazioni', 39, '30 – 60 min', 6),
  ('connettore-di-ricarica', 'Connettore di Ricarica', 'Il dispositivo non carica o il cavo balla: pulizia o sostituzione del connettore.', 'cavo', 'Riparazioni', 45, '45 – 90 min', 7),
  ('recupero-dati', 'Recupero Dati', 'Foto, documenti e archivi da hard disk, SSD, memorie e telefoni non funzionanti.', 'recupero', 'Software', null, '1 – 7 giorni', 8),
  ('rimozione-virus', 'Rimozione Virus', 'Malware, ransomware e pop-up: bonifica completa e messa in sicurezza del sistema.', 'virus', 'Software', 45, '24 – 48 h', 9),
  ('formattazione-computer', 'Formattazione Computer', 'Installazione pulita di Windows o macOS con driver, programmi e dati trasferiti.', 'ripristino', 'Software', 55, '24 – 48 h', 10),
  ('assemblaggio-pc-gaming', 'Assemblaggio PC Gaming', 'Configurazioni su misura per gioco e lavoro: scelta componenti, montaggio e collaudo.', 'gaming', 'Sistemi', null, '3 – 7 giorni', 11),
  ('configurazione-wi-fi', 'Configurazione Wi-Fi', 'Copertura completa di casa o ufficio con router, ripetitori e access point mesh.', 'wifi', 'Sistemi', 49, 'in giornata', 12),
  ('assistenza-a-domicilio', 'Assistenza a Domicilio', 'Interveniamo a casa o in azienda a Tortolì e in Ogliastra, su appuntamento.', 'domicilio', 'Sistemi', 39, 'entro 48 h', 13),
  ('videosorveglianza', 'Videosorveglianza', 'Progettazione di impianti a norma con visione da smartphone e registrazione continua.', 'cctv', 'Sistemi', null, 'su preventivo', 14),
  ('installazione-telecamere', 'Installazione Telecamere', 'Montaggio, cablaggio e configurazione di telecamere IP interne ed esterne.', 'fotocamera', 'Sistemi', null, '1 – 2 giorni', 15),
  ('reti-aziendali', 'Reti Aziendali', 'Cablaggio strutturato, switch, firewall, NAS e backup per uffici e attività.', 'rete', 'Sistemi', null, 'su progetto', 16),
  ('assistenza-remota', 'Assistenza Remota', 'Risolviamo subito in collegamento remoto sicuro, senza spostare il computer.', 'remoto', 'Software', 25, 'in pochi minuti', 17)
on conflict (slug) do nothing;
