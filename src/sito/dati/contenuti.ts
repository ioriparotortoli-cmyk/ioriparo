import type { NomeIcona } from '../componenti/Icona'
import { AZIENDA, GARANZIA, GOOGLE } from './azienda'

/* ─────────────── Galleria ─────────────── */

export type CategoriaGalleria = 'laboratorio' | 'impianti' | 'reti'

export interface VoceGalleria {
  /**
   * Nome del file in `public/foto`, senza estensione. Di ognuno esistono due
   * misure: `nome-p.jpg` per il riquadro nella griglia e `nome.jpg` per
   * l'immagine aperta. Caricare la grande anche nella griglia significherebbe
   * scaricare piu' di un mega di foto per vedere delle miniature.
   */
  foto: string
  categoria: CategoriaGalleria
  titolo: string
  descrizione: string
}

export const CATEGORIE_GALLERIA: { id: CategoriaGalleria | 'tutti'; etichetta: string }[] = [
  { id: 'tutti', etichetta: 'Tutti' },
  { id: 'laboratorio', etichetta: 'Laboratorio' },
  { id: 'impianti', etichetta: 'Impianti' },
  { id: 'reti', etichetta: 'Reti' },
]

/**
 * Foto di lavori davvero eseguiti in laboratorio e in cantiere.
 *
 * Le descrizioni dicono quello che si vede nella foto e niente di piu': non
 * ci sono numeri, misure o quantita' che non si possano verificare guardando
 * l'immagine. Prima al loro posto c'erano dei disegni con didascalie inventate
 * — terabyte recuperati, punti rete certificati, un «team» — e su un sito di
 * un'attivita' vera quelle cifre le si legge come impegni presi.
 *
 * Le foto sono passate da `scripts/foto.py`, che le raddrizza, le rimpicciolisce
 * e copre i dati dei clienti: nessuna deve mostrare IMEI, numeri di serie,
 * schede di accettazione o schermi con contenuti personali.
 */
export const GALLERIA: VoceGalleria[] = [
  {
    foto: 'batteria-iphone-originale',
    categoria: 'laboratorio',
    titolo: 'Batteria iPhone sostituita',
    descrizione: 'A intervento finito il telefono riconosce la batteria, senza l’avviso di parte non originale.',
  },
  {
    foto: 'iphone-vetro-rotto',
    categoria: 'laboratorio',
    titolo: 'iPhone con il vetro scheggiato',
    descrizione: 'Com’è arrivato al banco: angolo scheggiato e crepa che attraversa il display.',
  },
  {
    foto: 'xiaomi-batteria',
    categoria: 'laboratorio',
    titolo: 'Sostituzione batteria Xiaomi',
    descrizione: 'Telefono aperto sul banco per arrivare alla batteria.',
  },
  {
    foto: 'samsung-aperto',
    categoria: 'laboratorio',
    titolo: 'Samsung caduto in acqua',
    descrizione: 'Aperto e pulito subito dopo la caduta. Il recupero non si può garantire in partenza.',
  },
  {
    foto: 'switch-poe',
    categoria: 'reti',
    titolo: 'Switch PoE in un impianto',
    descrizione: 'Con il PoE corrente e dati viaggiano sullo stesso cavo: niente presa accanto a ogni telecamera.',
  },
  {
    foto: 'telecamera-esterno',
    categoria: 'impianti',
    titolo: 'Telecamera esterna sotto la gronda',
    descrizione: 'Montata al riparo dalla pioggia, con il cavo che rientra subito nella canalina.',
  },
  {
    foto: 'amplificatore-antenna',
    categoria: 'impianti',
    titolo: 'Impianto TV e antenna',
    descrizione: 'Amplificatore di segnale e derivazioni rifatti a partire dalla scatola a muro.',
  },
  {
    foto: 'quadro-impianto',
    categoria: 'impianti',
    titolo: 'Quadro di un impianto a muro',
    descrizione: 'Alimentatore e collegamenti raccolti dentro una cassetta stagna.',
  },
]

/* ─────────────── Recensioni ─────────────── */

export interface Recensione {
  nome: string
  ruolo: string
  testo: string
  colore: string
}

export const RECENSIONI: Recensione[] = [
  {
    nome: 'Renato Congiu',
    ruolo: 'Google · giugno 2026',
    colore: '#7c3aed',
    testo:
      'Sono contento di esser venuto a conoscenza di questa attività. Ho avuto dei problemi col mio cellulare e il signor Stefano l’ha risolto subito, suggerendomi anche alcuni consigli su come gestirlo. Lo consiglio vivamente per la gentilezza e professionalità dimostrata.',
  },
  {
    nome: 'kaess diezapart',
    ruolo: 'Google · luglio 2026',
    colore: '#0d9488',
    testo:
      'Vorrei ringraziare il membro dello staff per la sua tempestività. Inizialmente mi era stato detto che ci sarebbero voluti 3-4 giorni per la sostituzione dello schermo del mio iPhone 17, ma tutto si è risolto in soli 2 giorni. Grazie di tutto, li consiglio vivamente.',
  },
  {
    nome: 'Smeralda Flores',
    ruolo: 'Local Guide · luglio 2026',
    colore: '#92400e',
    testo: 'Molto veloce e disponibile. Lo consiglio vivamente!',
  },
  {
    nome: 'Livio Angoletta',
    ruolo: 'Google · luglio 2026',
    colore: '#2563eb',
    testo:
      'Decisamente competente ed efficiente: mi ha risolto il problema su iPhone in 10 secondi. Altamente raccomandato.',
  },
  {
    nome: 'Nicolò Greci',
    ruolo: 'Google · luglio 2026',
    colore: '#4f46e5',
    testo: 'Onesto, competente e molto simpatico.',
  },
]

/* ─────────────── Domande frequenti ─────────────── */

export interface Domanda {
  domanda: string
  risposta: string
}

export const FAQ: Domanda[] = [
  {
    domanda: 'Quanto tempo serve per riparare uno smartphone?',
    risposta:
      'Display e batterie sono interventi da 45–90 minuti, se il ricambio è a magazzino: puoi aspettare in sede. Guasti alla scheda madre o danni da liquidi richiedono 24–72 ore perché prevedono lavaggio a ultrasuoni, asciugatura e test prolungati.',
  },
  {
    domanda: 'Il preventivo è gratuito?',
    risposta:
      'Sì. Diagnosi e preventivo sono gratuiti e non impegnano a nulla: se decidi di non procedere ti restituiamo il dispositivo nelle condizioni in cui è arrivato, senza costi. L’unica eccezione è il recupero dati, dove l’analisi approfondita viene concordata prima.',
  },
  {
    domanda: 'Usate ricambi originali?',
    risposta:
      'Quando disponibili sì, e lo scriviamo nel preventivo. Per molti modelli proponiamo anche compatibili di grado AAA selezionati, che costano meno. La differenza sta anche nella garanzia: 6 mesi sul ricambio originale, 3 mesi sul compatibile. La scelta resta tua, con prezzi e durata di entrambe le opzioni sotto gli occhi.',
  },
  {
    domanda: 'I miei dati sono al sicuro durante la riparazione?',
    risposta:
      'Sì. I tecnici accedono al dispositivo solo per i test necessari, non copiano nulla e sono vincolati da un impegno di riservatezza firmato. Ti consigliamo comunque un backup prima di consegnarlo: se non sai come farlo, lo facciamo insieme in negozio gratuitamente.',
  },
  {
    domanda: 'Che garanzia offrite?',
    risposta:
      `${GARANZIA.riparazioni} ${GARANZIA.esclusioni} ${GARANZIA.vendita} La stessa regola vale per gli impianti di rete e videosorveglianza, dove la garanzia riguarda gli apparati installati. La durata applicata al tuo intervento è sempre scritta sulla ricevuta.`,
  },
  {
    domanda: "Riparate anche a domicilio o presso l'azienda?",
    risposta:
      'Per computer fissi, reti, access point e videosorveglianza interveniamo direttamente sul posto in tutta l’Ogliastra e nel Nuorese. Per smartphone e tablet il laboratorio è indispensabile: possiamo però ritirare e riconsegnare il dispositivo se hai un contratto di assistenza attivo.',
  },
  {
    domanda: 'Quanto costa un impianto di videosorveglianza?',
    risposta:
      'Il prezzo dipende da quante telecamere servono, dalle inquadrature e dai percorsi dei cavi, quindi facciamo sempre un sopralluogo gratuito e poi un preventivo scritto. Nessun impegno fino alla tua approvazione.',
  },
  {
    domanda: 'Posso pagare a rate o con fattura aziendale?',
    risposta:
      'Accettiamo contanti, bancomat, carte e bonifico; per importi sopra i 300 € è disponibile il pagamento in tre rate senza interessi. Emettiamo fattura elettronica a privati, professionisti e aziende, con i dati raccolti una sola volta e riutilizzati per gli interventi successivi.',
  },
]

/* ─────────────── Motivi e processo ─────────────── */

export interface Motivo {
  icona: NomeIcona
  titolo: string
  testo: string
}

export const MOTIVI: Motivo[] = [
  { icona: 'tool', titolo: 'Esperienza', testo: 'Laboratorio attrezzato: microsaldatura, riball, diagnosi a livello di componente.' },
  { icona: 'clock', titolo: 'Rapidità', testo: 'Gran parte delle riparazioni si chiude entro 24 ore. Display e batterie spesso in un’ora.' },
  { icona: 'box', titolo: 'Ricambi di qualità', testo: 'Componenti originali o compatibili di grado AAA, sempre dichiarati nel preventivo.' },
  { icona: 'shield', titolo: 'Garanzia', testo: 'Sei mesi sul ricambio originale, tre sul compatibile: la durata è scritta sulla ricevuta, non promessa a voce.' },
  { icona: 'chat', titolo: 'Assistenza', testo: 'Un tecnico dedicato ti aggiorna su ogni passaggio via WhatsApp o e-mail.' },
  { icona: 'euro', titolo: 'Preventivi trasparenti', testo: 'Costo fisso comunicato prima dell’intervento. Se non ripariamo, non paghi la diagnosi.' },
  { icona: 'net', titolo: 'Supporto tecnico', testo: 'Contratti di assistenza con SLA per uffici, hotel, B&B e negozi, anche da remoto.' },
  { icona: 'data', titolo: 'Dati al sicuro', testo: 'Procedure di riservatezza scritte e recupero dati eseguito internamente, mai in outsourcing.' },
]

export const PROCESSO = [
  { titolo: 'Diagnosi', testo: 'Gratuita e senza impegno, in sede o da remoto. Ti diciamo cosa è successo e cosa serve davvero.' },
  { titolo: 'Preventivo', testo: 'Costo fisso, tempi certi e tipo di ricambio dichiarato. Approvi con un clic dall’area clienti.' },
  { titolo: 'Riparazione', testo: 'Intervento in laboratorio con strumenti professionali e collaudo su 18 punti di controllo.' },
  { titolo: 'Riconsegna', testo: 'Notifica automatica, garanzia sul componente sostituito indicata sulla ricevuta e assistenza post riparazione.' },
]

/**
 * Numeri mostrati in Home. Devono essere verificabili: gli anni si calcolano
 * dall'anno di apertura, la valutazione arriva dal profilo Google pubblico.
 * Prima di aggiungerne altri (dispositivi riparati, impianti installati)
 * servono cifre reali prese dal gestionale, non stime.
 */
export const NUMERI = [
  { valore: new Date().getFullYear() - AZIENDA.fondata, suffisso: '', etichetta: 'Anni di attività' },
  { valore: GOOGLE.recensioni, suffisso: '', etichetta: 'Recensioni su Google' },
  { valore: GARANZIA.riparazioneOriginale, suffisso: ' mesi', etichetta: 'Garanzia sul ricambio originale' },
  { valore: GARANZIA.venditaConsumatore, suffisso: ' mesi', etichetta: 'Garanzia sui prodotti venduti' },
]

export const VALORI: Motivo[] = [
  { icona: 'shield', titolo: 'Onestà tecnica', testo: 'Se la riparazione non conviene, lo diciamo. Anche quando significa non fare il lavoro.' },
  { icona: 'doc', titolo: 'Trasparenza', testo: 'Prezzo, tempi e tipo di ricambio scritti nel preventivo, sempre consultabili online.' },
  { icona: 'data', titolo: 'Riservatezza', testo: 'I tuoi dati non escono dal laboratorio. Procedure conformi al GDPR, firmate da ogni tecnico.' },
  { icona: 'tool', titolo: 'Formazione continua', testo: 'Aggiornamento costante su nuovi modelli, strumenti di microsaldatura e standard di rete.' },
]

/**
 * Tappe dell'attività. Vuoto finché non ci sono date e fatti reali: una
 * cronologia inventata e' peggio di una cronologia assente, e la sezione che
 * la mostra si nasconde da sola quando l'elenco e' vuoto.
 */
export const TAPPE: { anno: string; titolo: string; testo: string }[] = []

export const SETTORI = ['Hotel e resort', 'B&B e affitti brevi', 'Negozi e retail', 'Uffici e studi', 'Ristorazione', 'Industria leggera']
