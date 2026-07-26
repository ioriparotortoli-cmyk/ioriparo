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
      'Diagnosi e riparazione di tutte le marche: Apple, Samsung, Xiaomi, Huawei, Oppo e altri.',
    icona: 'smartphone',
    categoria: 'Dispositivi',
    prezzoDa: 39,
    tempi: '30 min – 24 h',
  },
  {
    slug: 'riparazione-tablet',
    titolo: 'Riparazione Tablet',
    descrizione:
      'iPad e tablet Android: vetro, display, batteria, ricarica e problemi software.',
    icona: 'tablet',
    categoria: 'Dispositivi',
    prezzoDa: 49,
    tempi: '1 – 3 giorni',
  },
  {
    slug: 'riparazione-pc-windows',
    titolo: 'Riparazione PC Windows',
    descrizione:
      'Notebook e desktop: avvio bloccato, schermata blu, hardware guasto e upgrade SSD.',
    icona: 'monitor',
    categoria: 'Dispositivi',
    prezzoDa: 35,
    tempi: '1 – 3 giorni',
  },
  {
    slug: 'riparazione-mac',
    titolo: 'Riparazione Mac',
    descrizione:
      'MacBook, iMac e Mac mini: sostituzione componenti, liquidi, macOS e migrazione dati.',
    icona: 'laptop',
    categoria: 'Dispositivi',
    prezzoDa: 59,
    tempi: '2 – 5 giorni',
  },
  {
    slug: 'sostituzione-display',
    titolo: 'Sostituzione Display',
    descrizione:
      'Vetro rotto o touch che non risponde: display originali o compatibili di alta qualità.',
    icona: 'schermo',
    categoria: 'Riparazioni',
    prezzoDa: 49,
    tempi: '30 – 90 min',
  },
  {
    slug: 'cambio-batteria',
    titolo: 'Cambio Batteria',
    descrizione:
      'Autonomia dimezzata o spegnimenti improvvisi: batteria nuova certificata e test di ciclo.',
    icona: 'batteria',
    categoria: 'Riparazioni',
    prezzoDa: 39,
    tempi: '30 – 60 min',
  },
  {
    slug: 'connettore-di-ricarica',
    titolo: 'Connettore di Ricarica',
    descrizione:
      'Il dispositivo non carica o il cavo balla: pulizia o sostituzione del connettore.',
    icona: 'cavo',
    categoria: 'Riparazioni',
    prezzoDa: 45,
    tempi: '45 – 90 min',
  },
  {
    slug: 'recupero-dati',
    titolo: 'Recupero Dati',
    descrizione:
      'Foto, documenti e archivi da hard disk, SSD, memorie e telefoni non funzionanti.',
    icona: 'recupero',
    categoria: 'Software',
    prezzoDa: null,
    tempi: '1 – 7 giorni',
  },
  {
    slug: 'rimozione-virus',
    titolo: 'Rimozione Virus',
    descrizione:
      'Malware, ransomware e pop-up: bonifica completa e messa in sicurezza del sistema.',
    icona: 'virus',
    categoria: 'Software',
    prezzoDa: 45,
    tempi: '24 – 48 h',
  },
  {
    slug: 'formattazione-computer',
    titolo: 'Formattazione Computer',
    descrizione:
      'Installazione pulita di Windows o macOS con driver, programmi e dati trasferiti.',
    icona: 'ripristino',
    categoria: 'Software',
    prezzoDa: 55,
    tempi: '24 – 48 h',
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
    slug: 'configurazione-wi-fi',
    titolo: 'Configurazione Wi-Fi',
    descrizione:
      'Copertura completa di casa o ufficio con router, ripetitori e access point mesh.',
    icona: 'wifi',
    categoria: 'Sistemi',
    prezzoDa: 49,
    tempi: 'in giornata',
  },
  {
    slug: 'assistenza-a-domicilio',
    titolo: 'Assistenza a Domicilio',
    descrizione:
      'Interveniamo a casa o in azienda a Tortolì e in Ogliastra, su appuntamento.',
    icona: 'domicilio',
    categoria: 'Sistemi',
    prezzoDa: 39,
    tempi: 'entro 48 h',
  },
  {
    slug: 'videosorveglianza',
    titolo: 'Videosorveglianza',
    descrizione:
      'Progettazione di impianti a norma con visione da smartphone e registrazione continua.',
    icona: 'cctv',
    categoria: 'Sistemi',
    prezzoDa: null,
    tempi: 'su preventivo',
  },
  {
    slug: 'installazione-telecamere',
    titolo: 'Installazione Telecamere',
    descrizione:
      'Montaggio, cablaggio e configurazione di telecamere IP interne ed esterne.',
    icona: 'fotocamera',
    categoria: 'Sistemi',
    prezzoDa: null,
    tempi: '1 – 2 giorni',
  },
  {
    slug: 'reti-aziendali',
    titolo: 'Reti Aziendali',
    descrizione:
      'Cablaggio strutturato, switch, firewall, NAS e backup per uffici e attività.',
    icona: 'rete',
    categoria: 'Sistemi',
    prezzoDa: null,
    tempi: 'su progetto',
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
]

export const categorieServizi = [
  'Tutti',
  'Dispositivi',
  'Riparazioni',
  'Software',
  'Sistemi',
] as const

export type CategoriaServizio = (typeof categorieServizi)[number]
