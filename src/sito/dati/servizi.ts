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
    prezzo: 'da 39 €',
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
    prezzo: 'da 59 €',
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
    prezzo: 'da 45 €',
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
    prezzo: 'da 49 €',
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
    prezzo: 'da 49 €',
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
    prezzo: 'da 99 €',
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
    prezzo: 'da 690 €',
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
    prezzo: 'da 240 €',
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
    prezzo: 'da 240 €',
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
    prezzo: 'da 60 €/punto',
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
    prezzo: 'da 90 €/mese',
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
  { intervento: 'Sostituzione display', dispositivo: 'Smartphone', tempi: '60–90 min', da: 69, garanzia: '3–6 mesi' },
  { intervento: 'Sostituzione batteria', dispositivo: 'Smartphone / tablet', tempi: '45 min', da: 39, garanzia: '3–6 mesi' },
  { intervento: 'Riparazione connettore di ricarica', dispositivo: 'Smartphone', tempi: '2 ore', da: 49, garanzia: '3–6 mesi' },
  { intervento: 'Trattamento ossido da liquidi', dispositivo: 'Tutti', tempi: '24–48 ore', da: 59, garanzia: '—' },
  { intervento: 'Upgrade SSD + clonazione', dispositivo: 'Notebook / desktop', tempi: '3 ore', da: 89, garanzia: '12–24 mesi' },
  { intervento: 'Sostituzione tastiera o cerniere', dispositivo: 'Notebook', tempi: '1 giorno', da: 79, garanzia: '3–6 mesi' },
  { intervento: 'Recupero dati logico', dispositivo: 'HDD / SSD / memorie', tempi: '2–5 giorni', da: 99, garanzia: '—' },
  { intervento: 'Impianto TVCC 4 telecamere', dispositivo: 'Casa / negozio', tempi: '1 giorno', da: 690, garanzia: '12–24 mesi' },
  { intervento: 'Access point Wi-Fi 6 + configurazione', dispositivo: 'Ufficio / struttura', tempi: 'mezza giornata', da: 240, garanzia: '12–24 mesi' },
  { intervento: 'Punto rete certificato Cat.6', dispositivo: 'Cablaggio', tempi: 'su misura', da: 60, garanzia: '12–24 mesi' },
]

/** Categorie e guasti del preventivo online: la stima nasce da questi valori. */
export const CATEGORIE_PREVENTIVO = [
  { id: 'smartphone', titolo: 'Smartphone', nota: 'Telefoni di ogni marca', base: [39, 189] as [number, number] },
  { id: 'tablet', titolo: 'Tablet', nota: 'iPad e Android', base: [59, 229] as [number, number] },
  { id: 'notebook', titolo: 'Notebook', nota: 'Portatili e MacBook', base: [49, 279] as [number, number] },
  { id: 'desktop', titolo: 'Computer fisso', nota: 'Assemblati e all-in-one', base: [45, 249] as [number, number] },
  { id: 'dati', titolo: 'Recupero dati', nota: 'HDD, SSD, memorie', base: [99, 449] as [number, number] },
  { id: 'impianto', titolo: 'Impianto o rete', nota: 'TVCC, Wi-Fi, cablaggio', base: [240, 1900] as [number, number] },
]

export const GUASTI_PREVENTIVO = [
  { id: 'display', titolo: 'Display rotto', nota: 'Vetro o pannello danneggiato', k: 1 },
  { id: 'batteria', titolo: 'Batteria', nota: 'Autonomia scarsa o gonfiore', k: 0.6 },
  { id: 'liquidi', titolo: 'Danno da liquidi', nota: 'Caduta in acqua, ossido', k: 1.2 },
  { id: 'accensione', titolo: 'Non si accende', nota: 'Nessun segno di vita', k: 1.35 },
  { id: 'software', titolo: 'Lentezza o software', nota: 'Sistema instabile, virus', k: 0.5 },
  { id: 'altro', titolo: 'Altro / non lo so', nota: 'Ci pensiamo noi in diagnosi', k: 0.9 },
]

export const SERVIZI_APPUNTAMENTO = [
  'Diagnosi smartphone o tablet',
  'Diagnosi computer o notebook',
  'Consulenza recupero dati',
  'Sopralluogo videosorveglianza',
  'Sopralluogo rete Wi-Fi',
  'Ritiro dispositivo',
]
