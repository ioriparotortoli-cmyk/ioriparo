import type { NomeIcona } from '@/lib/icone'

export type Vantaggio = {
  titolo: string
  descrizione: string
  icona: NomeIcona
}

export const vantaggi: Vantaggio[] = [
  {
    titolo: 'Diagnosi rapida',
    descrizione: 'Controllo completo del dispositivo e risposta chiara, spesso già in giornata.',
    icona: 'diagnosi',
  },
  {
    titolo: 'Ricambi di alta qualità',
    descrizione: 'Componenti originali o equivalenti selezionati, testati prima del montaggio.',
    icona: 'ricambi',
  },
  {
    titolo: 'Preventivi gratuiti',
    descrizione: 'Nessun costo di preventivo: conosci la spesa prima di autorizzare il lavoro.',
    icona: 'preventivo',
  },
  {
    titolo: 'Tecnici qualificati',
    descrizione: 'Laboratorio interno con strumentazione professionale e microsaldatura.',
    icona: 'chip',
  },
  {
    titolo: 'Garanzia sulle riparazioni',
    descrizione: 'Ogni intervento è coperto da garanzia scritta su ricambio e manodopera.',
    icona: 'garanzia',
  },
  {
    titolo: 'Assistenza post-vendita',
    descrizione: 'Restiamo a disposizione dopo la consegna, anche da remoto o telefonicamente.',
    icona: 'postvendita',
  },
]

export type PassoProcesso = {
  numero: number
  titolo: string
  descrizione: string
  icona: NomeIcona
}

export const processo: PassoProcesso[] = [
  {
    numero: 1,
    titolo: 'Porti il dispositivo',
    descrizione:
      'In negozio a Tortolì o su appuntamento a domicilio. Registriamo dati, difetto e accessori.',
    icona: 'mano',
  },
  {
    numero: 2,
    titolo: 'Effettuiamo la diagnosi',
    descrizione:
      'Test hardware e software in laboratorio per individuare la causa reale del guasto.',
    icona: 'diagnosi',
  },
  {
    numero: 3,
    titolo: 'Ricevi il preventivo',
    descrizione:
      'Ti scriviamo costo, tempi e ricambi previsti. Si procede solo dopo la tua conferma.',
    icona: 'preventivo',
  },
  {
    numero: 4,
    titolo: 'Ripariamo il dispositivo',
    descrizione:
      'Intervento con ricambi di qualità e collaudo completo prima della riconsegna.',
    icona: 'ricambi',
  },
  {
    numero: 5,
    titolo: 'Consegna e garanzia',
    descrizione:
      'Ritiri il dispositivo con documento di garanzia e assistenza post-riparazione inclusa.',
    icona: 'garanzia',
  },
]

export type Faq = {
  domanda: string
  risposta: string
}

export const faq: Faq[] = [
  {
    domanda: 'Quanto costa una riparazione?',
    risposta:
      'Dipende dal modello e dal componente da sostituire. La sostituzione di un display parte da 49 €, il cambio batteria da 39 €, gli interventi software da 35 €. Dopo la diagnosi ricevi un preventivo scritto e senza impegno: il lavoro parte solo quando lo approvi.',
  },
  {
    domanda: 'Quanto tempo serve?',
    risposta:
      'Le riparazioni più comuni su smartphone (display, batteria, connettore di ricarica) si concludono in 30–90 minuti. Per computer e Mac i tempi medi sono di 1–3 giorni lavorativi, mentre recupero dati e interventi che richiedono ricambi su ordinazione possono arrivare a 5–7 giorni.',
  },
  {
    domanda: 'La diagnosi è gratuita?',
    risposta:
      'Sì, la diagnosi e il preventivo sono sempre gratuiti e senza impegno. Se decidi di non procedere non paghi nulla e ti restituiamo il dispositivo nelle stesse condizioni in cui lo abbiamo ricevuto.',
  },
  {
    domanda: 'I dati vengono cancellati?',
    risposta:
      'No. Nella maggior parte delle riparazioni i dati restano intatti. Quando l’intervento richiede una formattazione ti avvisiamo prima e, su richiesta, eseguiamo un backup completo. Trattiamo i tuoi dati in modo riservato e non li conserviamo dopo la consegna.',
  },
  {
    domanda: 'Che garanzia offrite?',
    risposta:
      'Tutte le riparazioni sono coperte da garanzia scritta: 12 mesi sui ricambi sostituiti e sulla manodopera (24 mesi per i privati sui componenti nuovi, come previsto dal Codice del Consumo). La garanzia non copre danni accidentali, cadute o contatto con liquidi successivi all’intervento.',
  },
]

export type Recensione = {
  autore: string
  iniziali: string
  valutazione: number
  data: string
  testo: string
  dispositivo: string
}

/**
 * Recensioni mostrate quando l'integrazione Google Places non è configurata.
 * Con `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID` il sito carica quelle reali.
 */
export const recensioni: Recensione[] = [
  {
    autore: 'Marco P.',
    iniziali: 'MP',
    valutazione: 5,
    data: '2 settimane fa',
    testo:
      'Display dell’iPhone sostituito in un’ora, prezzo esattamente come da preventivo. Personale competente e disponibile, consigliatissimi.',
    dispositivo: 'iPhone 13',
  },
  {
    autore: 'Giulia S.',
    iniziali: 'GS',
    valutazione: 5,
    data: '1 mese fa',
    testo:
      'Portatile che non si accendeva più: recuperati tutti i dati e installato un SSD nuovo. Ora va più veloce di quando l’ho comprato.',
    dispositivo: 'Notebook HP',
  },
  {
    autore: 'Andrea M.',
    iniziali: 'AM',
    valutazione: 5,
    data: '1 mese fa',
    testo:
      'Hanno installato le telecamere nel mio negozio in mezza giornata, spiegandomi tutto con calma. Serietà e professionalità.',
    dispositivo: 'Videosorveglianza',
  },
  {
    autore: 'Francesca L.',
    iniziali: 'FL',
    valutazione: 5,
    data: '2 mesi fa',
    testo:
      'Batteria del telefono cambiata mentre aspettavo. Gentilissimi, prezzi onesti e garanzia scritta.',
    dispositivo: 'Samsung Galaxy S22',
  },
  {
    autore: 'Stefano C.',
    iniziali: 'SC',
    valutazione: 5,
    data: '3 mesi fa',
    testo:
      'MacBook con danno da liquido dato per perso da altri: qui l’hanno riparato. Assistenza impeccabile anche dopo.',
    dispositivo: 'MacBook Air',
  },
  {
    autore: 'Roberta N.',
    iniziali: 'RN',
    valutazione: 5,
    data: '4 mesi fa',
    testo:
      'Rete e Wi-Fi dell’ufficio finalmente stabili in tutte le stanze. Intervento veloce e preventivo rispettato.',
    dispositivo: 'Rete aziendale',
  },
]

export type FotoGalleria = {
  titolo: string
  categoria: 'Prima e dopo' | 'Riparazioni' | 'Laboratorio'
  descrizione: string
  /** Immagine sorgente: sostituibile con foto reali in `public/galleria`. */
  file: string
}

export const galleria: FotoGalleria[] = [
  {
    titolo: 'Display iPhone: prima e dopo',
    categoria: 'Prima e dopo',
    descrizione: 'Vetro completamente frantumato, sostituito con display nuovo e True Tone attivo.',
    file: '/galleria/prima-dopo-display.svg',
  },
  {
    titolo: 'Scheda madre dopo ossidazione',
    categoria: 'Prima e dopo',
    descrizione: 'Bonifica ai ultrasuoni e microsaldatura dei componenti corrosi da liquido.',
    file: '/galleria/prima-dopo-scheda.svg',
  },
  {
    titolo: 'Upgrade SSD su notebook',
    categoria: 'Riparazioni',
    descrizione: 'Clonazione del disco e installazione SSD NVMe: avvio in meno di 10 secondi.',
    file: '/galleria/riparazione-ssd.svg',
  },
  {
    titolo: 'Sostituzione batteria',
    categoria: 'Riparazioni',
    descrizione: 'Batteria certificata con test di capacità e cicli prima della riconsegna.',
    file: '/galleria/riparazione-batteria.svg',
  },
  {
    titolo: 'Postazione di microsaldatura',
    categoria: 'Laboratorio',
    descrizione: 'Microscopio, stazione ad aria calda e strumenti antistatici professionali.',
    file: '/galleria/laboratorio-microsaldatura.svg',
  },
  {
    titolo: 'Banco diagnosi',
    categoria: 'Laboratorio',
    descrizione: 'Alimentatori da banco e strumenti di misura per l’analisi dei consumi.',
    file: '/galleria/laboratorio-banco.svg',
  },
]

export const categorieGalleria = ['Tutte', 'Prima e dopo', 'Riparazioni', 'Laboratorio'] as const
