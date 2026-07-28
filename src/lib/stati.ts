import type {
  StatoFattura,
  StatoImpianto,
  StatoOrdine,
  StatoPreventivo,
  StatoRiparazione,
  TipoDispositivo,
  TipoScadenza,
} from '@/types'

export interface ConfigStato {
  label: string
  /** Etichetta compatta per i badge in tabella */
  labelBreve?: string
  /** Classi Tailwind del badge (testo + fondo + bordo) */
  badge: string
  /** Colore pieno per grafici e pastiglie */
  colore: string
  /** Classi per l'icona tonda dei riepiloghi */
  icona: string
}

export const STATI_RIPARAZIONE: Record<StatoRiparazione, ConfigStato> = {
  in_attesa: {
    label: 'In attesa',
    badge: 'text-amber-300 bg-amber-500/12 border-amber-500/30',
    colore: '#f59e0b',
    icona: 'text-amber-400 bg-amber-500/15',
  },
  preventivo_inviato: {
    label: 'Preventivo inviato',
    badge: 'text-yellow-200 bg-yellow-500/12 border-yellow-500/30',
    colore: '#eab308',
    icona: 'text-yellow-300 bg-yellow-500/15',
  },
  in_lavorazione: {
    label: 'In lavorazione',
    badge: 'text-blue-300 bg-blue-500/12 border-blue-500/30',
    colore: '#3b82f6',
    icona: 'text-blue-400 bg-blue-500/15',
  },
  pronto_per_ritiro: {
    label: 'Pronto per il ritiro',
    labelBreve: 'Pronto',
    badge: 'text-emerald-300 bg-emerald-500/12 border-emerald-500/30',
    colore: '#22c55e',
    icona: 'text-emerald-400 bg-emerald-500/15',
  },
  consegnato: {
    label: 'Consegnato',
    badge: 'text-violet-300 bg-violet-500/12 border-violet-500/30',
    colore: '#a855f7',
    icona: 'text-violet-400 bg-violet-500/15',
  },
  non_riparabile: {
    label: 'Non riparabile',
    badge: 'text-rose-300 bg-rose-500/12 border-rose-500/30',
    colore: '#f43f5e',
    icona: 'text-rose-400 bg-rose-500/15',
  },
}

/** Ordine di visualizzazione dei filtri e delle legende. */
export const ORDINE_STATI: StatoRiparazione[] = [
  'in_attesa',
  'preventivo_inviato',
  'in_lavorazione',
  'pronto_per_ritiro',
  'consegnato',
  'non_riparabile',
]

/** Stati che contano come lavorazione ancora aperta. */
export const STATI_APERTI: StatoRiparazione[] = [
  'in_attesa',
  'preventivo_inviato',
  'in_lavorazione',
  'pronto_per_ritiro',
]

export const STATI_PREVENTIVO: Record<StatoPreventivo, ConfigStato> = {
  bozza: {
    label: 'Bozza',
    badge: 'text-slate-300 bg-slate-500/12 border-slate-500/30',
    colore: '#94a3b8',
    icona: 'text-slate-300 bg-slate-500/15',
  },
  inviato: {
    label: 'Inviato',
    badge: 'text-blue-300 bg-blue-500/12 border-blue-500/30',
    colore: '#3b82f6',
    icona: 'text-blue-400 bg-blue-500/15',
  },
  accettato: {
    label: 'Accettato',
    badge: 'text-emerald-300 bg-emerald-500/12 border-emerald-500/30',
    colore: '#22c55e',
    icona: 'text-emerald-400 bg-emerald-500/15',
  },
  rifiutato: {
    label: 'Rifiutato',
    badge: 'text-rose-300 bg-rose-500/12 border-rose-500/30',
    colore: '#f43f5e',
    icona: 'text-rose-400 bg-rose-500/15',
  },
  scaduto: {
    label: 'Scaduto',
    badge: 'text-amber-300 bg-amber-500/12 border-amber-500/30',
    colore: '#f59e0b',
    icona: 'text-amber-400 bg-amber-500/15',
  },
}

export const STATI_FATTURA: Record<StatoFattura, ConfigStato> = {
  emessa: {
    label: 'Emessa',
    badge: 'text-blue-300 bg-blue-500/12 border-blue-500/30',
    colore: '#3b82f6',
    icona: 'text-blue-400 bg-blue-500/15',
  },
  pagata: {
    label: 'Pagata',
    badge: 'text-emerald-300 bg-emerald-500/12 border-emerald-500/30',
    colore: '#22c55e',
    icona: 'text-emerald-400 bg-emerald-500/15',
  },
  scaduta: {
    label: 'Scaduta',
    badge: 'text-rose-300 bg-rose-500/12 border-rose-500/30',
    colore: '#f43f5e',
    icona: 'text-rose-400 bg-rose-500/15',
  },
  annullata: {
    label: 'Annullata',
    badge: 'text-slate-300 bg-slate-500/12 border-slate-500/30',
    colore: '#94a3b8',
    icona: 'text-slate-300 bg-slate-500/15',
  },
}

export const STATI_ORDINE: Record<StatoOrdine, ConfigStato> = {
  bozza: {
    label: 'Bozza',
    badge: 'text-slate-300 bg-slate-500/12 border-slate-500/30',
    colore: '#94a3b8',
    icona: 'text-slate-300 bg-slate-500/15',
  },
  inviato: {
    label: 'Inviato',
    badge: 'text-blue-300 bg-blue-500/12 border-blue-500/30',
    colore: '#3b82f6',
    icona: 'text-blue-400 bg-blue-500/15',
  },
  in_transito: {
    label: 'In transito',
    badge: 'text-amber-300 bg-amber-500/12 border-amber-500/30',
    colore: '#f59e0b',
    icona: 'text-amber-400 bg-amber-500/15',
  },
  ricevuto: {
    label: 'Ricevuto',
    badge: 'text-emerald-300 bg-emerald-500/12 border-emerald-500/30',
    colore: '#22c55e',
    icona: 'text-emerald-400 bg-emerald-500/15',
  },
  annullato: {
    label: 'Annullato',
    badge: 'text-rose-300 bg-rose-500/12 border-rose-500/30',
    colore: '#f43f5e',
    icona: 'text-rose-400 bg-rose-500/15',
  },
}

export const STATI_IMPIANTO: Record<StatoImpianto, ConfigStato> = {
  attivo: {
    label: 'Attivo',
    badge: 'text-emerald-300 bg-emerald-500/12 border-emerald-500/30',
    colore: '#22c55e',
    icona: 'text-emerald-400 bg-emerald-500/15',
  },
  in_manutenzione: {
    label: 'In manutenzione',
    badge: 'text-blue-300 bg-blue-500/12 border-blue-500/30',
    colore: '#3b82f6',
    icona: 'text-blue-400 bg-blue-500/15',
  },
  da_verificare: {
    label: 'Da verificare',
    badge: 'text-amber-300 bg-amber-500/12 border-amber-500/30',
    colore: '#f59e0b',
    icona: 'text-amber-400 bg-amber-500/15',
  },
  dismesso: {
    label: 'Dismesso',
    badge: 'text-slate-300 bg-slate-500/12 border-slate-500/30',
    colore: '#94a3b8',
    icona: 'text-slate-300 bg-slate-500/15',
  },
}

export const TIPI_SCADENZA: Record<TipoScadenza, { label: string; colore: string }> = {
  pagamento_fornitore: { label: 'Pagamento fornitore', colore: '#f43f5e' },
  contratto: { label: 'Contratto', colore: '#f59e0b' },
  rinnovo: { label: 'Rinnovo', colore: '#3b82f6' },
  promemoria: { label: 'Promemoria', colore: '#a855f7' },
  tassa: { label: 'Tassa / F24', colore: '#22c55e' },
}

export const TIPI_DISPOSITIVO: Record<TipoDispositivo, string> = {
  smartphone: 'Smartphone',
  tablet: 'Tablet',
  notebook: 'Notebook',
  desktop: 'PC Desktop',
  console: 'Console',
  smartwatch: 'Smartwatch',
  altro: 'Altro',
}

/** Marche proposte nella selezione, raggruppate per tipo di dispositivo. */
export const MARCHE_PER_TIPO: Record<TipoDispositivo, string[]> = {
  smartphone: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Oppo', 'Motorola', 'Altro'],
  tablet: ['Apple', 'Samsung', 'Lenovo', 'Huawei', 'Microsoft', 'Altro'],
  notebook: ['Apple', 'HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Altro'],
  desktop: ['Assemblato', 'HP', 'Dell', 'Lenovo', 'Acer', 'Apple', 'Altro'],
  console: ['Sony', 'Microsoft', 'Nintendo', 'Altro'],
  smartwatch: ['Apple', 'Samsung', 'Garmin', 'Huawei', 'Altro'],
  altro: ['Altro'],
}

/**
 * Modelli suggeriti per marca, divisi per tipo di dispositivo.
 *
 * Servono a compilare in fretta l'accettazione, non a vincolare: il campo
 * resta libero, perché nessun elenco copre ogni modello in circolazione e
 * quelli nuovi escono di continuo. Le voci qui sotto sono i modelli più
 * frequenti al banco; per gli altri si scrive a mano.
 */
export const MODELLI_PER_MARCA: Partial<Record<TipoDispositivo, Record<string, string[]>>> = {
  smartphone: {
    Apple: [
      'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'iPhone Air',
      'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 16e',
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
      'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
      'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
      'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
      'iPhone SE (2022)', 'iPhone SE (2020)', 'iPhone XR', 'iPhone XS', 'iPhone X', 'iPhone 8',
    ],
    Samsung: [
      'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
      'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S24 FE',
      'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S23 FE',
      'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22', 'Galaxy S21', 'Galaxy S20',
      'Galaxy Z Fold 6', 'Galaxy Z Fold 5', 'Galaxy Z Flip 6', 'Galaxy Z Flip 5',
      'Galaxy A56', 'Galaxy A55', 'Galaxy A54', 'Galaxy A36', 'Galaxy A35', 'Galaxy A34',
      'Galaxy A26', 'Galaxy A25', 'Galaxy A16', 'Galaxy A15', 'Galaxy A14', 'Galaxy A05s',
    ],
    Xiaomi: [
      'Xiaomi 15 Ultra', 'Xiaomi 15 Pro', 'Xiaomi 15', 'Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13',
      'Redmi Note 14 Pro+', 'Redmi Note 14 Pro', 'Redmi Note 14',
      'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12',
      'Redmi 14C', 'Redmi 13C', 'Redmi A3',
      'Poco X7 Pro', 'Poco X6 Pro', 'Poco F6', 'Poco M6 Pro',
    ],
    Huawei: [
      'P60 Pro', 'P50 Pro', 'P40 Lite', 'P30 Lite',
      'Mate 50 Pro', 'Nova 12', 'Nova 11', 'Nova 9',
    ],
    OnePlus: ['OnePlus 13', 'OnePlus 12', 'OnePlus 11', 'Nord 4', 'Nord 3', 'Nord CE 4'],
    Oppo: ['Find X8 Pro', 'Find X8', 'Reno 12', 'Reno 11', 'Reno 10', 'A79', 'A78', 'A58'],
    Motorola: ['Edge 50 Pro', 'Edge 50', 'Edge 40', 'Moto G84', 'Moto G54', 'Moto G34', 'Razr 50'],
  },

  tablet: {
    Apple: [
      'iPad Pro 13" (M4)', 'iPad Pro 11" (M4)', 'iPad Air 13"', 'iPad Air 11"',
      'iPad (10ª gen)', 'iPad (9ª gen)', 'iPad mini (7ª gen)', 'iPad mini (6ª gen)',
    ],
    Samsung: [
      'Galaxy Tab S10 Ultra', 'Galaxy Tab S10+', 'Galaxy Tab S9 Ultra', 'Galaxy Tab S9',
      'Galaxy Tab S6 Lite', 'Galaxy Tab A9+', 'Galaxy Tab A9',
    ],
    Lenovo: ['Tab P12', 'Tab P11', 'Tab M11', 'Tab M10'],
    Huawei: ['MatePad Pro 12.2', 'MatePad 11.5', 'MatePad SE'],
    Microsoft: ['Surface Pro 11', 'Surface Pro 9', 'Surface Go 4', 'Surface Go 3'],
  },

  notebook: {
    Apple: [
      'MacBook Air 13" M4', 'MacBook Air 15" M4', 'MacBook Air 13" M3', 'MacBook Air M2', 'MacBook Air M1',
      'MacBook Pro 14" M4', 'MacBook Pro 16" M4', 'MacBook Pro 14" M3', 'MacBook Pro 13" M2',
    ],
    HP: ['Pavilion 15', 'Pavilion x360', 'EliteBook 840', 'ProBook 450', 'Victus 15', 'Omen 16', 'HP 255 G9'],
    Dell: ['XPS 13', 'XPS 15', 'Latitude 5450', 'Latitude 7440', 'Inspiron 15', 'Vostro 15', 'G15'],
    Lenovo: ['ThinkPad X1 Carbon', 'ThinkPad E14', 'ThinkPad T14', 'IdeaPad 3', 'IdeaPad Slim 5', 'Legion 5', 'Yoga Slim 7'],
    Asus: ['Zenbook 14', 'Vivobook 15', 'Vivobook Go 15', 'ROG Strix G16', 'TUF Gaming A15', 'ProArt 16'],
    Acer: ['Aspire 3', 'Aspire 5', 'Swift Go 14', 'Nitro V 15', 'Predator Helios 16', 'TravelMate P2'],
    MSI: ['Katana 15', 'Thin 15', 'Modern 15', 'Stealth 16', 'Cyborg 15'],
  },

  desktop: {
    Apple: ['iMac 24" M4', 'iMac 24" M3', 'Mac mini M4', 'Mac mini M2', 'Mac Studio'],
    HP: ['ProDesk 400', 'EliteDesk 800', 'Pavilion Desktop TP01', 'Victus 15L'],
    Dell: ['OptiPlex 7010', 'OptiPlex 3000', 'Vostro 3020', 'XPS Desktop 8960'],
    Lenovo: ['ThinkCentre M70q', 'ThinkCentre M90t', 'IdeaCentre 3', 'Legion Tower 5'],
    Acer: ['Aspire TC', 'Veriton S', 'Predator Orion 3000'],
  },

  console: {
    Sony: ['PlayStation 5 Pro', 'PlayStation 5 Slim', 'PlayStation 5', 'PlayStation 4 Pro', 'PlayStation 4 Slim', 'PlayStation 4', 'PlayStation Portal'],
    Microsoft: ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S', 'Xbox One'],
    Nintendo: ['Switch 2', 'Switch OLED', 'Switch Lite', 'Switch'],
  },

  smartwatch: {
    Apple: ['Apple Watch Series 10', 'Apple Watch Series 9', 'Apple Watch SE (2ª gen)', 'Apple Watch Ultra 2', 'Apple Watch Ultra'],
    Samsung: ['Galaxy Watch 7', 'Galaxy Watch 6', 'Galaxy Watch 6 Classic', 'Galaxy Watch FE', 'Galaxy Fit 3'],
    Garmin: ['Forerunner 265', 'Forerunner 55', 'Fenix 7', 'Venu 3', 'Instinct 2'],
    Huawei: ['Watch GT 5', 'Watch GT 4', 'Watch Fit 3', 'Band 9'],
  },
}

/** Modelli suggeriti per la coppia tipo + marca; vuoto se non ce ne sono. */
export function modelliSuggeriti(tipo: TipoDispositivo, marca: string): string[] {
  return MODELLI_PER_MARCA[tipo]?.[marca] ?? []
}
