import type { NomeIcona } from '@/lib/icone'

export type Servizio = {
  slug: string
  titolo: string
  descrizione: string
  icona: NomeIcona
  categoria: 'Dispositivi' | 'Riparazioni' | 'Software' | 'Sistemi'
  /** Prezzo indicativo di partenza in euro, `null` se dipende dal preventivo. */
  prezzoDa: number | null
  tempi: string
}

/**
 * Catalogo statico dei servizi: è il fallback sempre disponibile quando
 * Supabase non è configurato oppure non risponde (il sito resta rapido e
 * completamente renderizzabile a build time).
 */
export const servizi: Servizio[] = [
  {
    slug: 'riparazione-smartphone',
    titolo: 'Riparazione Smartphone',
    descrizione:
      'Tutte le marche: display, batteria, ricarica, fotocamera, audio e danni da liquido.',
    icona: 'smartphone',
    categoria: 'Dispositivi',
    prezzoDa: 39,
    tempi: '30 min – 24 h',
  },
  {
    slug: 'riparazione-tablet',
    titolo: 'Riparazione Tablet',
    descrizione: 'iPad e tablet Android: vetro, touch, batteria, ricarica e problemi di sistema.',
    icona: 'tablet',
    categoria: 'Dispositivi',
    prezzoDa: 49,
    tempi: '1 – 3 giorni',
  },
  {
    slug: 'riparazione-iphone',
    titolo: 'Riparazione iPhone',
    descrizione:
      'Dal 6 fino agli ultimi modelli: display originali o compatibili, True Tone e Face ID.',
    icona: 'iphone',
    categoria: 'Dispositivi',
    prezzoDa: 59,
    tempi: '30 – 90 min',
  },
  {
    slug: 'riparazione-samsung',
    titolo: 'Riparazione Samsung',
    descrizione:
      'Galaxy S, A, Note e Z: display OLED, scocche, ricarica e riparazioni a livello scheda.',
    icona: 'samsung',
    categoria: 'Dispositivi',
    prezzoDa: 55,
    tempi: '1 – 2 giorni',
  },
  {
    slug: 'riparazione-pc-windows',
    titolo: 'Riparazione PC Windows',
    descrizione:
      'Notebook e fissi: avvio bloccato, schermata blu, ventole, tastiere e upgrade SSD.',
    icona: 'monitor',
    categoria: 'Dispositivi',
    prezzoDa: 35,
    tempi: '1 – 3 giorni',
  },
  {
    slug: 'riparazione-mac',
    titolo: 'Riparazione Mac',
    descrizione:
      'MacBook, iMac e Mac mini: liquidi, scheda logica, macOS e migrazione dei dati.',
    icona: 'laptop',
    categoria: 'Dispositivi',
    prezzoDa: 59,
    tempi: '2 – 5 giorni',
  },
  {
    slug: 'riparazione-console',
    titolo: 'Riparazione Console',
    descrizione:
      'PlayStation, Xbox e Nintendo: HDMI, surriscaldamento, lettore, drift dei controller.',
    icona: 'console',
    categoria: 'Dispositivi',
    prezzoDa: 45,
    tempi: '2 – 4 giorni',
  },
  {
    slug: 'cambio-display',
    titolo: 'Cambio Display',
    descrizione:
      'Vetro rotto o touch che non risponde: ricambi selezionati e collaudo completo.',
    icona: 'schermo',
    categoria: 'Riparazioni',
    prezzoDa: 49,
    tempi: '30 – 90 min',
  },
  {
    slug: 'cambio-batteria',
    titolo: 'Cambio Batteria',
    descrizione:
      'Autonomia dimezzata o spegnimenti improvvisi: batteria nuova certificata e test dei cicli.',
    icona: 'batteria',
    categoria: 'Riparazioni',
    prezzoDa: 39,
    tempi: '30 – 60 min',
  },
  {
    slug: 'connettore-di-ricarica',
    titolo: 'Connettore di Ricarica',
    descrizione: 'Non carica o il cavo balla: pulizia o sostituzione del connettore in giornata.',
    icona: 'cavo',
    categoria: 'Riparazioni',
    prezzoDa: 45,
    tempi: '45 – 90 min',
  },
  {
    slug: 'recupero-dati',
    titolo: 'Recupero Dati',
    descrizione:
      'Foto, documenti e archivi da hard disk, SSD, schede di memoria e telefoni guasti.',
    icona: 'recupero',
    categoria: 'Software',
    prezzoDa: null,
    tempi: '1 – 7 giorni',
  },
  {
    slug: 'formattazione',
    titolo: 'Formattazione',
    descrizione:
      'Installazione pulita di Windows o macOS con driver, programmi e dati trasferiti.',
    icona: 'formattazione',
    categoria: 'Software',
    prezzoDa: 55,
    tempi: '24 – 48 h',
  },
  {
    slug: 'rimozione-virus',
    titolo: 'Rimozione Virus',
    descrizione: 'Malware, ransomware e pop-up: bonifica completa e messa in sicurezza.',
    icona: 'virus',
    categoria: 'Software',
    prezzoDa: 45,
    tempi: '24 – 48 h',
  },
  {
    slug: 'assistenza-remota',
    titolo: 'Assistenza Remota',
    descrizione:
      'Risolviamo subito in collegamento remoto sicuro, senza spostare il computer.',
    icona: 'remoto',
    categoria: 'Software',
    prezzoDa: 25,
    tempi: 'in pochi minuti',
  },
  {
    slug: 'assemblaggio-pc-gaming',
    titolo: 'Assemblaggio PC Gaming',
    descrizione:
      'Configurazioni su misura per gioco e lavoro: scelta componenti, montaggio e collaudo.',
    icona: 'gaming',
    categoria: 'Sistemi',
    prezzoDa: null,
    tempi: '3 – 7 giorni',
  },
  {
    slug: 'assistenza-informatica',
    titolo: 'Assistenza Informatica',
    descrizione:
      'Supporto continuativo per privati, studi e aziende, in sede o su appuntamento.',
    icona: 'informatica',
    categoria: 'Sistemi',
    prezzoDa: 39,
    tempi: 'entro 48 h',
  },
  {
    slug: 'configurazione-wi-fi',
    titolo: 'Configurazione Wi-Fi',
    descrizione:
      'Copertura completa di casa o ufficio con router, ripetitori e access point mesh.',
    icona: 'router',
    categoria: 'Sistemi',
    prezzoDa: 49,
    tempi: 'in giornata',
  },
  {
    slug: 'videosorveglianza',
    titolo: 'Videosorveglianza',
    descrizione:
      'Impianti a norma con visione da smartphone, registrazione continua e notifiche.',
    icona: 'cctv',
    categoria: 'Sistemi',
    prezzoDa: null,
    tempi: 'su preventivo',
  },
  {
    slug: 'installazione-telecamere',
    titolo: 'Installazione Telecamere',
    descrizione: 'Montaggio, cablaggio e configurazione di telecamere IP interne ed esterne.',
    icona: 'fotocamera',
    categoria: 'Sistemi',
    prezzoDa: null,
    tempi: '1 – 2 giorni',
  },
  {
    slug: 'reti-aziendali',
    titolo: 'Reti Aziendali',
    descrizione: 'Cablaggio strutturato, switch, firewall, NAS e backup per uffici e attività.',
    icona: 'rete',
    categoria: 'Sistemi',
    prezzoDa: null,
    tempi: 'su progetto',
  },
]

export const categorieServizi = [
  'Tutti',
  'Dispositivi',
  'Riparazioni',
  'Software',
  'Sistemi',
] as const

export type CategoriaServizio = (typeof categorieServizi)[number]
