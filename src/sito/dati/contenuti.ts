import type { NomeIcona } from '../componenti/Icona'
import type { NomeScena } from '../componenti/Illustrazione'

/* ─────────────── Galleria ─────────────── */

export type CategoriaGalleria = 'laboratorio' | 'impianti' | 'reti'

export interface VoceGalleria {
  scena: NomeScena
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

export const GALLERIA: VoceGalleria[] = [
  { scena: 'bench', categoria: 'laboratorio', titolo: 'Banco di microsaldatura', descrizione: 'Stazione ad aria calda e microscopio per interventi su scheda madre.' },
  { scena: 'phone', categoria: 'laboratorio', titolo: 'Sostituzione display smartphone', descrizione: 'Display originale, calibrazione e test su 18 punti di controllo.' },
  { scena: 'cam', categoria: 'impianti', titolo: 'Telecamera IP 4K su negozio', descrizione: 'Installazione con staffa antivandalo e cablaggio PoE nascosto.' },
  { scena: 'net', categoria: 'reti', titolo: 'Armadio rack certificato', descrizione: 'Switch gestito, patch panel ordinato ed etichettatura di ogni porta.' },
  { scena: 'laptop', categoria: 'laboratorio', titolo: 'Upgrade SSD su notebook', descrizione: 'Clonazione del sistema e sostituzione della pasta termica.' },
  { scena: 'wifi', categoria: 'reti', titolo: 'Access point in hotel', descrizione: 'Copertura completa sulle camere con roaming trasparente.' },
  { scena: 'data', categoria: 'laboratorio', titolo: 'Recupero dati da RAID', descrizione: "Ricostruzione dell'array e recupero di 1,8 TB di archivio aziendale." },
  { scena: 'cable', categoria: 'reti', titolo: 'Cablaggio strutturato Cat.6A', descrizione: '32 punti rete certificati in un ufficio su due piani.' },
  { scena: 'shop', categoria: 'impianti', titolo: 'Impianto completo per retail', descrizione: 'Videosorveglianza, Wi-Fi ospiti e casse collegate in un unico progetto.' },
  { scena: 'tablet', categoria: 'laboratorio', titolo: 'Vetro tablet separato', descrizione: 'Sostituzione del solo vetro: costo dimezzato rispetto al modulo completo.' },
  { scena: 'team', categoria: 'laboratorio', titolo: 'Il team al lavoro', descrizione: 'Tecnici specializzati tra laboratorio e cantiere.' },
  { scena: 'cam', categoria: 'impianti', titolo: 'Sopralluogo su capannone', descrizione: "Studio delle inquadrature e delle zone d'ombra prima del preventivo." },
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
    nome: 'Livio',
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
      'Quando disponibili sì, e lo scriviamo nel preventivo. Per molti modelli proponiamo anche compatibili di grado AAA selezionati, che costano meno e che garantiamo 12 mesi esattamente come gli originali. La scelta resta sempre tua, con i prezzi di entrambe le opzioni sotto gli occhi.',
  },
  {
    domanda: 'I miei dati sono al sicuro durante la riparazione?',
    risposta:
      'Sì. I tecnici accedono al dispositivo solo per i test necessari, non copiano nulla e sono vincolati da un impegno di riservatezza firmato. Ti consigliamo comunque un backup prima di consegnarlo: se non sai come farlo, lo facciamo insieme in negozio gratuitamente.',
  },
  {
    domanda: 'Che garanzia offrite?',
    risposta:
      'Dodici mesi su ricambio e manodopera per le riparazioni, ventiquattro mesi sugli impianti di rete e videosorveglianza. La garanzia è digitale, collegata al codice pratica e consultabile in qualsiasi momento dall’area clienti.',
  },
  {
    domanda: "Riparate anche a domicilio o presso l'azienda?",
    risposta:
      'Per computer fissi, reti, access point e videosorveglianza interveniamo direttamente sul posto in tutta l’Ogliastra e nel Nuorese. Per smartphone e tablet il laboratorio è indispensabile: possiamo però ritirare e riconsegnare il dispositivo se hai un contratto di assistenza attivo.',
  },
  {
    domanda: 'Quanto costa un impianto di videosorveglianza?',
    risposta:
      'Un impianto residenziale da quattro telecamere IP con registratore e installazione parte da 690 € IVA inclusa. Per attività commerciali e strutture ricettive facciamo sempre un sopralluogo gratuito: il prezzo dipende dalle inquadrature necessarie e dai percorsi dei cavi.',
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
  { icona: 'tool', titolo: 'Esperienza', testo: 'Dal 2013 in laboratorio: microsaldatura, riball, diagnosi a livello di componente.' },
  { icona: 'clock', titolo: 'Rapidità', testo: 'Il 78% delle riparazioni viene chiuso entro 24 ore. Display e batterie spesso in un’ora.' },
  { icona: 'box', titolo: 'Ricambi di qualità', testo: 'Componenti originali o compatibili di grado AAA, sempre dichiarati nel preventivo.' },
  { icona: 'shield', titolo: 'Garanzia', testo: 'Dodici mesi su ricambio e manodopera, con tagliando digitale collegato alla pratica.' },
  { icona: 'chat', titolo: 'Assistenza', testo: 'Un tecnico dedicato ti aggiorna su ogni passaggio via WhatsApp o e-mail.' },
  { icona: 'euro', titolo: 'Preventivi trasparenti', testo: 'Costo fisso comunicato prima dell’intervento. Se non ripariamo, non paghi la diagnosi.' },
  { icona: 'net', titolo: 'Supporto tecnico', testo: 'Contratti di assistenza con SLA per uffici, hotel, B&B e negozi, anche da remoto.' },
  { icona: 'data', titolo: 'Dati al sicuro', testo: 'Procedure di riservatezza scritte e recupero dati eseguito internamente, mai in outsourcing.' },
]

export const PROCESSO = [
  { titolo: 'Diagnosi', testo: 'Gratuita e senza impegno, in sede o da remoto. Ti diciamo cosa è successo e cosa serve davvero.' },
  { titolo: 'Preventivo', testo: 'Costo fisso, tempi certi e tipo di ricambio dichiarato. Approvi con un clic dall’area clienti.' },
  { titolo: 'Riparazione', testo: 'Intervento in laboratorio con strumenti professionali e collaudo su 18 punti di controllo.' },
  { titolo: 'Riconsegna', testo: 'Notifica automatica, garanzia digitale di 12 mesi e assistenza post riparazione.' },
]

export const NUMERI = [
  { valore: 18400, suffisso: '', etichetta: 'Dispositivi riparati' },
  { valore: 12, suffisso: '+', etichetta: 'Anni di attività' },
  { valore: 98, suffisso: '%', etichetta: 'Clienti soddisfatti' },
  { valore: 340, suffisso: '', etichetta: 'Impianti installati' },
]

export const VALORI: Motivo[] = [
  { icona: 'shield', titolo: 'Onestà tecnica', testo: 'Se la riparazione non conviene, lo diciamo. Anche quando significa non fare il lavoro.' },
  { icona: 'doc', titolo: 'Trasparenza', testo: 'Prezzo, tempi e tipo di ricambio scritti nel preventivo, sempre consultabili online.' },
  { icona: 'data', titolo: 'Riservatezza', testo: 'I tuoi dati non escono dal laboratorio. Procedure conformi al GDPR, firmate da ogni tecnico.' },
  { icona: 'tool', titolo: 'Formazione continua', testo: 'Aggiornamento costante su nuovi modelli, strumenti di microsaldatura e standard di rete.' },
]

export const TAPPE = [
  { anno: '2013', titolo: 'Apertura del laboratorio', testo: 'Prima postazione di microsaldatura e riparazione smartphone.' },
  { anno: '2016', titolo: 'Reparto computer e recupero dati', testo: 'Strumentazione dedicata a hard disk, SSD e RAID.' },
  { anno: '2019', titolo: 'Divisione reti e videosorveglianza', testo: 'Primi impianti chiavi in mano per hotel e attività commerciali.' },
  { anno: '2023', titolo: 'Gestionale interno e tracking online', testo: 'Ogni pratica tracciabile dal cliente in tempo reale.' },
  { anno: 'oggi', titolo: 'Contratti di assistenza gestita', testo: 'Monitoraggio proattivo delle reti dei clienti business.' },
]

export const SETTORI = ['Hotel e resort', 'B&B e affitti brevi', 'Negozi e retail', 'Uffici e studi', 'Ristorazione', 'Industria leggera']
