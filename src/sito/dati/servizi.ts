import type { NomeIcona } from '../componenti/Icona'
import type { NomeScena } from '../componenti/Illustrazione'

export type FamigliaServizio = 'dispositivi' | 'reti' | 'aziende'

export interface Servizio {
  id: string
  famiglia: FamigliaServizio
  icona: NomeIcona
  scena: NomeScena
  titolo: string
  /** Testo breve usato nelle card e nelle anteprime */
  descrizione: string
  tag: string[]
  prezzo: string
  tempo: string
}

export const FAMIGLIE: { id: FamigliaServizio | 'tutti'; etichetta: string }[] = [
  { id: 'tutti', etichetta: 'Tutti' },
  { id: 'dispositivi', etichetta: 'Dispositivi' },
  { id: 'reti', etichetta: 'Reti e sicurezza' },
  { id: 'aziende', etichetta: 'Aziende' },
]

export const SERVIZI: Servizio[] = [
  {
    id: 'riparazione-smartphone',
    famiglia: 'dispositivi',
    icona: 'phone',
    scena: 'phone',
    titolo: 'Riparazione smartphone',
    descrizione:
      'Display, batterie, connettori di ricarica, fotocamere e danni da liquidi su tutte le marche. Microsaldatura per guasti alla scheda madre.',
    tag: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo'],
    prezzo: 'da 29,90 €',
    tempo: 'da 60 minuti',
  },
  {
    id: 'riparazione-tablet',
    famiglia: 'dispositivi',
    icona: 'tablet',
    scena: 'tablet',
    titolo: 'Riparazione tablet',
    descrizione:
      'Vetro e display separati per ridurre il costo, sostituzione batterie gonfie, tasti e connettori. Anche su tablet di grande formato.',
    tag: ['iPad', 'Galaxy Tab', 'Lenovo', 'Surface'],
    prezzo: 'su preventivo',
    tempo: '1–2 giorni',
  },
  {
    id: 'riparazione-computer',
    famiglia: 'dispositivi',
    icona: 'desktop',
    scena: 'laptop',
    titolo: 'Riparazione computer',
    descrizione:
      'Diagnosi hardware e software, sostituzione alimentatori, schede madri e dissipatori, rimozione malware e reinstallazione pulita del sistema.',
    tag: ['Windows', 'macOS', 'Linux', 'Assemblati'],
    prezzo: 'su preventivo',
    tempo: '1–3 giorni',
  },
  {
    id: 'assistenza-notebook',
    famiglia: 'dispositivi',
    icona: 'laptop',
    scena: 'laptop',
    titolo: 'Assistenza notebook',
    descrizione:
      'Tastiere, cerniere, display, ventole e pasta termica. Upgrade a SSD NVMe con clonazione del sistema: il portatile torna più veloce di quando era nuovo.',
    tag: ['Upgrade SSD', 'RAM', 'Cerniere', 'Ventole'],
    prezzo: 'su preventivo',
    tempo: '1–2 giorni',
  },
  {
    id: 'riparazione-console',
    famiglia: 'dispositivi',
    icona: 'box',
    scena: 'bench',
    titolo: 'Riparazione console',
    descrizione:
      'PlayStation, Xbox e Nintendo Switch: pulizia e pasta termica, ventole rumorose, porte HDMI, lettori ottici e drifting dei controller.',
    tag: ['PlayStation', 'Xbox', 'Switch', 'Controller'],
    prezzo: 'su preventivo',
    tempo: '1–2 giorni',
  },
  {
    id: 'recupero-dati',
    famiglia: 'dispositivi',
    icona: 'data',
    scena: 'data',
    titolo: 'Recupero dati',
    descrizione:
      'Hard disk, SSD, schede di memoria, RAID e telefoni non avviabili. Prima analisi gratuita: ti diciamo cosa è recuperabile prima di iniziare.',
    tag: ['HDD', 'SSD', 'RAID', 'microSD', 'NAS'],
    prezzo: 'su preventivo',
    tempo: '2–5 giorni',
  },
  {
    id: 'videosorveglianza',
    famiglia: 'reti',
    icona: 'cam',
    scena: 'cam',
    titolo: 'Videosorveglianza professionale',
    descrizione:
      'Progettazione, installazione e configurazione di impianti IP e analogici, con visione da smartphone, notifiche intelligenti e conformità alle regole del Garante.',
    tag: ['IP 4K', 'Visione notturna', 'Analitiche', 'Cloud'],
    prezzo: 'su preventivo',
    tempo: '1 giorno',
  },
  {
    id: 'impianti-wifi',
    famiglia: 'reti',
    icona: 'wifi',
    scena: 'wifi',
    titolo: 'Impianti internet e Wi-Fi',
    descrizione:
      'Copertura misurata sul posto con survey radio: niente stanze scoperte, niente disconnessioni. Fibra, FWA, backup su rete mobile e portale ospiti.',
    tag: ['Wi-Fi 6', 'Survey', 'Guest portal', 'Failover'],
    prezzo: 'su preventivo',
    tempo: 'mezza giornata',
  },
  {
    id: 'reti-aziendali',
    famiglia: 'aziende',
    icona: 'net',
    scena: 'net',
    titolo: 'Reti aziendali',
    descrizione:
      'Progettazione di rete con VLAN, firewall, VPN per il lavoro da remoto e monitoraggio continuo. Documentazione completa consegnata al cliente.',
    tag: ['VLAN', 'Firewall', 'VPN', 'Monitoraggio'],
    prezzo: 'su progetto',
    tempo: 'su misura',
  },
  {
    id: 'access-point',
    famiglia: 'reti',
    icona: 'ap',
    scena: 'wifi',
    titolo: 'Installazione access point',
    descrizione:
      'Access point professionali con roaming trasparente tra i piani e gestione centralizzata. Ideali per hotel, B&B, uffici e capannoni.',
    tag: ['Roaming', 'PoE', 'Mesh', 'Controller'],
    prezzo: 'su preventivo',
    tempo: 'mezza giornata',
  },
  {
    id: 'cablaggio-rete',
    famiglia: 'reti',
    icona: 'cable',
    scena: 'cable',
    titolo: 'Cablaggio di rete',
    descrizione:
      'Cablaggio strutturato in categoria 6 e 6A, armadi rack ordinati, certificazione dei punti rete e fibra ottica per collegamenti tra edifici.',
    tag: ['Cat.6/6A', 'Rack', 'Fibra', 'Certificazione'],
    prezzo: 'su preventivo',
    tempo: 'su misura',
  },
  {
    id: 'assistenza-aziende',
    famiglia: 'aziende',
    icona: 'tool',
    scena: 'shop',
    titolo: 'Assistenza tecnica alle aziende',
    descrizione:
      'Contratti di manutenzione con SLA garantito, interventi in sede e da remoto, sostituzione temporanea dei dispositivi e report periodici.',
    tag: ['Hotel', 'B&B', 'Negozi', 'Uffici', 'Ristoranti'],
    prezzo: 'su preventivo',
    tempo: 'SLA 4 ore',
  },
]

export interface VoceListino {
  intervento: string
  dispositivo: string
  tempi: string
  da: number
  garanzia: string
}

export const LISTINO: VoceListino[] = [
  { intervento: 'Display OLED', dispositivo: 'Smartphone', tempi: '60–90 min', da: 130, garanzia: '3–6 mesi' },
  { intervento: 'Batteria', dispositivo: 'iPhone e Android', tempi: '45 min', da: 100, garanzia: '3 mesi' },
  { intervento: 'Connettore di ricarica originale', dispositivo: 'iPhone', tempi: '2 ore', da: 100, garanzia: '6 mesi' },
  { intervento: 'Connettore di ricarica originale', dispositivo: 'Samsung', tempi: '2 ore', da: 80, garanzia: '6 mesi' },
  { intervento: 'Pulizia da caduta in acqua', dispositivo: 'Smartphone', tempi: '24–48 ore', da: 50, garanzia: '—' },
  { intervento: 'Trasferimento dati', dispositivo: 'Da telefono a telefono', tempi: '1 ora', da: 50, garanzia: '—' },
  { intervento: 'Pellicola idrogel', dispositivo: 'Tutti i cellulari', tempi: '10 min', da: 29.9, garanzia: '—' },
]

/** Categorie del preventivo online. */
export const CATEGORIE_PREVENTIVO = [
  { id: 'smartphone', titolo: 'Smartphone', nota: 'Telefoni di ogni marca' },
  { id: 'tablet', titolo: 'Tablet', nota: 'iPad e Android' },
  { id: 'notebook', titolo: 'Notebook', nota: 'Portatili e MacBook' },
  { id: 'desktop', titolo: 'Computer fisso', nota: 'Assemblati e all-in-one' },
  { id: 'dati', titolo: 'Recupero dati', nota: 'HDD, SSD, memorie' },
  { id: 'impianto', titolo: 'Impianto o rete', nota: 'TVCC, Wi-Fi, cablaggio' },
]

/**
 * Prezzi di partenza del preventivo online, per coppia categoria + guasto.
 *
 * Solo cifre reali del laboratorio: dove non c'è una cifra la pagina scrive
 * "su preventivo" invece di calcolarne una. Una stima inventata mette il
 * cliente al banco con in testa un numero che non esiste.
 */
export const STIME_PREVENTIVO: Record<string, { da?: number; fisso?: number; nota?: string }> = {
  'smartphone|display': { da: 130, nota: 'Display OLED: la cifra esatta dipende dal modello' },
  'smartphone|batteria': {
    da: 100,
    nota: 'Ricambio compatibile selezionato. Su iPhone non compare l’avviso «Parte non originale» e il telefono la riconosce regolarmente; la durata varia con il modello',
  },
  'smartphone|liquidi': {
    fisso: 50,
    nota: 'Pulizia con alcool isopropilico. Il costo è lo stesso anche se il dispositivo non si recupera, e sull’esito non c’è garanzia',
  },
}

export const GUASTI_PREVENTIVO = [
  { id: 'display', titolo: 'Display rotto', nota: 'Vetro o pannello danneggiato' },
  { id: 'batteria', titolo: 'Batteria', nota: 'Autonomia scarsa o gonfiore' },
  { id: 'liquidi', titolo: 'Danno da liquidi', nota: 'Caduta in acqua, ossido' },
  { id: 'accensione', titolo: 'Non si accende', nota: 'Nessun segno di vita' },
  { id: 'software', titolo: 'Lentezza o software', nota: 'Sistema instabile, virus' },
  { id: 'altro', titolo: 'Altro / non lo so', nota: 'Ci pensiamo noi in diagnosi' },
]

export const SERVIZI_APPUNTAMENTO = [
  'Diagnosi smartphone o tablet',
  'Diagnosi computer o notebook',
  'Consulenza recupero dati',
  'Sopralluogo videosorveglianza',
  'Sopralluogo rete Wi-Fi',
  'Ritiro dispositivo',
]
