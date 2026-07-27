import type { NomeScena } from '../componenti/Illustrazione'

/** Blocco di testo di un articolo: paragrafo, sottotitolo o elenco puntato. */
export type BloccoArticolo =
  | { tipo: 'p'; testo: string }
  | { tipo: 'h'; testo: string }
  | { tipo: 'elenco'; voci: string[] }

export interface Articolo {
  slug: string
  categoria: string
  scena: NomeScena
  data: string
  /** Data ISO per i dati strutturati e la sitemap */
  dataIso: string
  lettura: string
  titolo: string
  sommario: string
  corpo: BloccoArticolo[]
}

export const ARTICOLI: Articolo[] = [
  {
    slug: 'batteria-smartphone-durata',
    categoria: 'Guida',
    scena: 'phone',
    data: '12 luglio 2026',
    dataIso: '2026-07-12',
    lettura: '6 min',
    titolo: 'Batteria dello smartphone: 7 abitudini che allungano la vita (e 3 miti da dimenticare)',
    sommario:
      'La batteria non si "rovina" ricaricandola spesso. Ecco cosa la consuma davvero e quando conviene sostituirla invece di comprare un telefono nuovo.',
    corpo: [
      { tipo: 'h', testo: 'Come funziona davvero una batteria agli ioni di litio' },
      {
        tipo: 'p',
        testo:
          'Ogni batteria ha un numero finito di cicli di carica: un ciclo corrisponde al consumo del 100% della capacità, anche se distribuito su più giorni. La maggior parte degli smartphone dichiara circa 500 cicli prima di scendere all’80% della capacità originale, che in uso normale significa due o tre anni. Quando in laboratorio misuriamo una batteria sotto l’80%, il calo di autonomia percepito è quasi sempre accompagnato da spegnimenti improvvisi con freddo o carico elevato.',
      },
      {
        tipo: 'p',
        testo:
          'Il nemico numero uno non è il numero di ricariche, ma il calore. Una batteria tenuta a 35-40 °C perde capacità molto più in fretta di una che lavora a temperatura ambiente: per questo lasciare il telefono sul cruscotto in estate o usarlo intensamente mentre è in carica è il modo più rapido per rovinarla.',
      },
      { tipo: 'h', testo: 'Le sette abitudini che funzionano' },
      {
        tipo: 'elenco',
        voci: [
          'Mantieni la carica tra il 20% e l’80% quando puoi: è la fascia in cui la cella lavora con meno stress.',
          'Evita di ricaricare sotto la luce diretta del sole o sotto il cuscino: il calore accumulato è il danno peggiore.',
          'Togli le cover spesse durante la ricarica rapida, soprattutto in estate.',
          'Attiva la ricarica ottimizzata: il telefono completa il 100% poco prima della sveglia invece di restare carico tutta la notte.',
          'Usa alimentatori certificati: quelli senza marchio erogano tensioni instabili che stressano il circuito di carica.',
          'Se non usi un dispositivo per mesi, riponilo intorno al 50% e non a zero: sotto una certa soglia la cella può non riprendersi più.',
          'Aggiorna il sistema: le ottimizzazioni software di gestione energetica hanno un effetto reale e misurabile.',
        ],
      },
      { tipo: 'h', testo: 'I tre miti da dimenticare' },
      {
        tipo: 'p',
        testo:
          'Primo: "bisogna scaricare completamente il telefono ogni tanto". Falso, era vero per le vecchie batterie al nichel; con il litio le scariche profonde fanno solo danni. Secondo: "lasciarlo in carica tutta la notte lo brucia". I circuiti moderni interrompono la carica al 100%, il problema semmai è il calore accumulato. Terzo: "le app che chiudono i processi allungano la batteria": nella pratica costringono il sistema a riaprire tutto da capo, consumando di più.',
      },
      { tipo: 'h', testo: 'Quando conviene sostituire invece di cambiare telefono' },
      {
        tipo: 'p',
        testo:
          'La sostituzione della batteria su uno smartphone di fascia media costa in genere tra 39 e 69 euro e restituisce autonomia da dispositivo nuovo. Se il telefono ha meno di cinque anni, riceve ancora aggiornamenti di sicurezza e non ha altri guasti, sostituire la batteria è quasi sempre la scelta migliore: economica, immediata e con un impatto ambientale enormemente inferiore.',
      },
      {
        tipo: 'p',
        testo:
          'In laboratorio misuriamo capacità residua e cicli prima di proporre l’intervento: se la batteria è ancora sana e il problema è un’app che consuma in background, te lo diciamo e la sostituzione non serve.',
      },
    ],
  },
  {
    slug: 'wifi-hotel-bnb',
    categoria: 'Aziende',
    scena: 'wifi',
    data: '28 giugno 2026',
    dataIso: '2026-06-28',
    lettura: '7 min',
    titolo: 'Wi-Fi in hotel e B&B: perché il router del provider non basta mai',
    sommario:
      'Le recensioni negative delle strutture ricettive parlano spesso di connessione lenta. Come si progetta una rete che copre davvero tutte le camere.',
    corpo: [
      { tipo: 'h', testo: 'Il problema non è la linea, è la distribuzione' },
      {
        tipo: 'p',
        testo:
          'Quando una struttura ci chiama perché "internet va piano", nove volte su dieci la fibra è perfetta: il collo di bottiglia è il modem del provider piazzato in reception che deve coprire tre piani di muri in tufo. Il segnale radio non attraversa i muri portanti, e un access point in più messo a caso peggiora la situazione perché i dispositivi restano agganciati a quello sbagliato.',
      },
      { tipo: 'h', testo: 'Il survey: misurare prima di comprare' },
      {
        tipo: 'p',
        testo:
          'Prima di preventivare qualsiasi apparato facciamo un sopralluogo con strumentazione che misura potenza e interferenze camera per camera. Il risultato è una mappa che mostra esattamente dove il segnale cade e quanti access point servono davvero: spesso sono meno di quelli che il cliente si aspettava, posizionati in punti diversi da quelli immaginati.',
      },
      { tipo: 'h', testo: 'Roaming, canali, ospiti' },
      {
        tipo: 'elenco',
        voci: [
          'Roaming trasparente: l’ospite passa dalla hall alla camera senza perdere la videochiamata, perché gli access point si passano il dispositivo con gli standard 802.11k/v/r.',
          'Pianificazione dei canali: in un condominio o in centro città la banda 2,4 GHz è satura; separare le reti e portare i dispositivi moderni sui 5 GHz risolve gran parte dei rallentamenti.',
          'Rete ospiti separata: i clienti navigano su una VLAN isolata che non vede il gestionale, le casse o le telecamere. È una misura di sicurezza, non un lusso.',
          'Portale di accesso: nome della struttura, credenziali giornaliere e limite di banda per dispositivo, così un solo ospite che scarica non rallenta tutti gli altri.',
        ],
      },
      { tipo: 'h', testo: 'Quanto costa e quanto rende' },
      {
        tipo: 'p',
        testo:
          'Per una struttura da venti camere si parte tipicamente da tre o quattro access point professionali, uno switch PoE e la configurazione: un investimento che si ripaga con poche recensioni negative evitate. Il conto va fatto sul valore di una recensione a tre stelle, non sul prezzo dell’apparato.',
      },
      {
        tipo: 'p',
        testo:
          'Aggiungiamo sempre un monitoraggio: se un access point smette di rispondere lo sappiamo prima che sia l’ospite a segnalarlo alla reception.',
      },
    ],
  },
  {
    slug: 'videosorveglianza-regole',
    categoria: 'Sicurezza',
    scena: 'cam',
    data: '14 giugno 2026',
    dataIso: '2026-06-14',
    lettura: '5 min',
    titolo: 'Videosorveglianza a norma: cosa puoi riprendere e cosa no',
    sommario:
      'Telecamere sulla soglia di casa, in negozio o in azienda: le regole del Garante Privacy spiegate senza linguaggio da avvocato.',
    corpo: [
      { tipo: 'h', testo: 'Il principio di fondo' },
      {
        tipo: 'p',
        testo:
          'Puoi riprendere ciò che è tuo e ciò che serve a proteggerlo, non lo spazio pubblico né la proprietà altrui. Una telecamera puntata sul marciapiede, sul portone del vicino o su un’area comune condominiale senza delibera è quasi sempre illegittima, e il problema non è teorico: le sanzioni ci sono e le contestazioni tra vicini finiscono spesso davanti al Garante.',
      },
      { tipo: 'h', testo: 'Le regole pratiche per un’abitazione' },
      {
        tipo: 'elenco',
        voci: [
          'Inquadra solo le tue pertinenze: ingresso, giardino, box. Se un pezzo di strada entra inevitabilmente nel campo, si maschera via software con una zona di privacy.',
          'Se le immagini restano sul dispositivo e le vedi solo tu per fini personali, il GDPR non si applica in senso stretto, ma la regola sul non riprendere terzi resta.',
          'Se pubblichi o condividi le immagini, entri in un’altra categoria: valuta bene le conseguenze.',
        ],
      },
      { tipo: 'h', testo: 'Le regole per negozi, uffici e aziende' },
      {
        tipo: 'p',
        testo:
          'Qui gli obblighi sono più stringenti. Serve il cartello informativo prima del raggio d’azione della telecamera, un’informativa completa a disposizione, la designazione di chi può accedere alle immagini e la registrazione del trattamento. La conservazione va limitata: 24 ore come regola, fino a una settimana in casi motivati, di più solo per esigenze specifiche e documentate.',
      },
      {
        tipo: 'p',
        testo:
          'Se ci sono dipendenti entra in gioco anche lo Statuto dei lavoratori: l’impianto non può essere usato per controllare a distanza l’attività lavorativa e serve un accordo sindacale o l’autorizzazione dell’Ispettorato del lavoro. È il passaggio che più spesso viene ignorato, ed è quello che costa di più quando emerge.',
      },
      { tipo: 'h', testo: 'Come lo gestiamo noi' },
      {
        tipo: 'p',
        testo:
          'Ogni impianto che installiamo esce con le zone di privacy già configurate, i tempi di conservazione impostati, gli accessi nominali con password individuali e la cartellonistica fornita. Consegniamo anche un documento che descrive l’impianto e le impostazioni: se domani ricevi una richiesta, hai già la risposta pronta in un raccoglitore.',
      },
    ],
  },
]

export const trovaArticolo = (slug?: string) => ARTICOLI.find((a) => a.slug === slug)
