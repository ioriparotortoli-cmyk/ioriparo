/**
 * Contenuti delle pagine dedicate a ciascun servizio.
 * Ogni voce alimenta `/servizi/:id`: testo di apertura, cosa comprende
 * l'intervento, come si svolge e le domande più frequenti su quel servizio.
 */

export interface DettaglioServizio {
  /** Titolo della pagina, più discorsivo di quello della scheda */
  titolo: string
  intro: string
  /** Interventi compresi, mostrati come elenco puntato */
  interventi: string[]
  /** Passaggi dell'intervento, numerati */
  fasi: { titolo: string; testo: string }[]
  /** Domande specifiche del servizio */
  domande: { domanda: string; risposta: string }[]
}

export const DETTAGLI: Record<string, DettaglioServizio> = {
  'riparazione-smartphone': {
    titolo: 'Riparazione smartphone a Tortolì',
    intro:
      'Display rotto, batteria che non tiene, connettore che non carica, telefono caduto in acqua: sono gli interventi che facciamo ogni giorno. La diagnosi è gratuita e il preventivo viene scritto prima di aprire il dispositivo, con il tipo di ricambio dichiarato.',
    interventi: [
      'Sostituzione display e vetro su tutte le marche, con ricambi originali o compatibili di grado AAA',
      'Sostituzione batteria con misurazione preventiva di capacità residua e cicli',
      'Riparazione o sostituzione del connettore di ricarica, spesso solo da pulire',
      'Pulizia da caduta in acqua con alcool isopropilico: 50 €, che si pagano anche se il telefono non si recupera',
      'Fotocamere, altoparlanti, microfoni, tasti e vetro posteriore',
      'Microsaldatura su scheda madre per telefoni che non si accendono',
    ],
    fasi: [
      { titolo: 'Diagnosi', testo: 'Verifichiamo il guasto davanti a te quando possibile: in molti casi bastano dieci minuti.' },
      { titolo: 'Preventivo', testo: 'Prezzo fisso, tempi certi e tipo di ricambio scritti prima dell’intervento.' },
      { titolo: 'Riparazione', testo: 'Se il ricambio è a magazzino display e batterie si sostituiscono in un’ora.' },
      { titolo: 'Collaudo', testo: 'Si controlla quello che l’intervento poteva toccare: touch, luminosità, prossimità, audio, ricarica, fotocamere.' },
    ],
    domande: [
      {
        domanda: 'Perdo i dati durante la riparazione?',
        risposta:
          'No, gli interventi più comuni non toccano la memoria. Consigliamo comunque un backup prima di consegnarlo: se non sai come farlo lo prepariamo insieme in negozio, gratuitamente.',
      },
      {
        domanda: 'Il telefono è caduto in acqua: quanto costa?',
        risposta:
          'La pulizia costa 50 € e si pagano in ogni caso, anche se il telefono non riparte: il lavoro di apertura, pulizia con alcool isopropilico e asciugatura viene fatto comunque. Sul risultato non possiamo dare garanzie né prima né dopo — l’ossido continua a lavorare e un telefono che riparte oggi può fermarsi fra un mese. Preferiamo dirlo prima: se il telefono non ti serve abbastanza da rischiare 50 €, è giusto saperlo.',
      },
      {
        domanda: 'Conviene riparare o cambiare telefono?',
        risposta:
          'Se il telefono ha meno di cinque anni, riceve ancora aggiornamenti di sicurezza e ha un solo guasto, riparare conviene quasi sempre. Quando non conviene te lo diciamo, anche se significa non fare il lavoro.',
      },
    ],
  },

  'riparazione-tablet': {
    titolo: 'Riparazione tablet e iPad',
    intro:
      'Sui tablet il modulo completo costa molto: quando il pannello è integro sostituiamo solo il vetro e il conto si dimezza. Lavoriamo su iPad, Galaxy Tab, Lenovo, Huawei e Surface, compresi i formati grandi.',
    interventi: [
      'Sostituzione del solo vetro quando il display sottostante funziona',
      'Sostituzione del modulo display completo',
      'Batterie gonfie o esaurite, con smaltimento a norma della vecchia cella',
      'Connettori di ricarica, tasti volume e accensione',
      'Recupero del funzionamento dopo cadute e danni da liquidi',
    ],
    fasi: [
      { titolo: 'Apertura controllata', testo: 'I tablet sono incollati: si aprono a caldo, con pazienza, per non danneggiare le cornici.' },
      { titolo: 'Valutazione', testo: 'Verifichiamo se serve il modulo completo o basta il vetro: cambia molto sul prezzo.' },
      { titolo: 'Sostituzione', testo: 'Incollaggio con biadesivo dedicato e pressatura, come in fabbrica.' },
      { titolo: 'Collaudo', testo: 'Test del touch su tutta la superficie, sensori e ricarica prima della riconsegna.' },
    ],
    domande: [
      {
        domanda: 'Quanto tempo serve per un tablet?',
        risposta:
          'In genere uno o due giorni: l’incollaggio ha bisogno di tempi di presa che non si possono accelerare senza compromettere il risultato.',
      },
      {
        domanda: 'Riparate anche i tablet dei bambini con cover integrata?',
        risposta: 'Sì. Se la cover ha assorbito l’urto spesso il danno è solo al vetro e la spesa è contenuta.',
      },
    ],
  },

  'riparazione-computer': {
    titolo: 'Riparazione computer fissi',
    intro:
      'Computer che non si accende, si spegne da solo, va lento o è pieno di malware: prima capiamo se il problema è hardware o software, poi ti diciamo cosa conviene fare. Nessun intervento parte senza il tuo via libera.',
    interventi: [
      'Diagnosi hardware con test di alimentatore, memorie, disco e temperature',
      'Sostituzione di alimentatori, schede madri, dissipatori e ventole',
      'Upgrade a SSD con clonazione del sistema: il computer torna reattivo',
      'Rimozione di virus e malware, ripristino del sistema operativo',
      'Assemblaggio e configurazione di postazioni nuove, anche per ufficio',
    ],
    fasi: [
      { titolo: 'Diagnosi', testo: 'Test componente per componente: nessuna sostituzione fatta a tentativi.' },
      { titolo: 'Preventivo', testo: 'Ti indichiamo cosa è necessario e cosa è facoltativo, con i prezzi separati.' },
      { titolo: 'Intervento', testo: 'Riparazione o upgrade, mantenendo dati, programmi e configurazioni.' },
      { titolo: 'Verifica', testo: 'Prove di carico prolungate per essere certi che il guasto non si ripresenti.' },
    ],
    domande: [
      {
        domanda: 'Il computer è lento: devo cambiarlo?',
        risposta:
          'Quasi mai. Nella maggior parte dei casi bastano un SSD e una pulizia del sistema per riportarlo a essere veloce, con una spesa molto inferiore a un acquisto nuovo.',
      },
      {
        domanda: 'Conservate i miei programmi e le mie cartelle?',
        risposta: 'Sì. Nelle migrazioni cloniamo il disco: ritrovi tutto dov’era, comprese le impostazioni.',
      },
    ],
  },

  'assistenza-notebook': {
    titolo: 'Assistenza notebook e MacBook',
    intro:
      'Cerniere che cedono, tastiere che saltano, ventole rumorose, portatili che si spengono per il calore. Sui notebook la meccanica conta quanto l’elettronica: interveniamo su entrambe.',
    interventi: [
      'Sostituzione di display, cerniere, scocche e tastiere',
      'Pulizia del sistema di raffreddamento e sostituzione della pasta termica',
      'Upgrade a SSD NVMe e ampliamento della memoria',
      'Riparazione dei connettori di alimentazione e delle prese USB',
      'Sostituzione delle batterie con celle nuove e certificate',
    ],
    fasi: [
      { titolo: 'Controllo temperature', testo: 'Misuriamo il comportamento sotto carico prima di aprire: i sintomi raccontano molto.' },
      { titolo: 'Smontaggio', testo: 'Ogni vite viene catalogata: al rimontaggio nulla resta fuori posto.' },
      { titolo: 'Intervento', testo: 'Ricambio o manutenzione, con prova immediata prima di richiudere.' },
      { titolo: 'Collaudo', testo: 'Stress test e verifica delle temperature a regime.' },
    ],
    domande: [
      {
        domanda: 'Il portatile si spegne da solo: è grave?',
        risposta:
          'Di solito no: nove volte su dieci è polvere nel dissipatore e pasta termica esaurita. È una manutenzione, non una riparazione, e costa poco.',
      },
      {
        domanda: 'Riparate anche i MacBook?',
        risposta: 'Sì, comprese le sostituzioni di batteria, display e tastiere a farfalla.',
      },
    ],
  },

  'riparazione-console': {
    titolo: 'Riparazione console da gioco',
    intro:
      'PlayStation, Xbox e Nintendo Switch soffrono soprattutto di calore, polvere e connettori usurati. Interveniamo su alimentazione, raffreddamento, lettori ottici e joystick, con prove di funzionamento sotto carico reale.',
    interventi: [
      'Pulizia completa e sostituzione della pasta termica su PS4, PS5 e Xbox',
      'Sostituzione di ventole rumorose e riparazione dei circuiti di alimentazione',
      'Lettori ottici che non leggono o non caricano i dischi',
      'Riparazione delle porte HDMI e dei connettori di ricarica su Switch',
      'Drifting degli stick analogici sui controller e sui Joy-Con',
    ],
    fasi: [
      { titolo: 'Prova del difetto', testo: 'Riproduciamo il problema in laboratorio: con le console i sintomi cambiano a caldo.' },
      { titolo: 'Preventivo', testo: 'Ti diciamo se conviene riparare o se il pezzo è ormai fuori produzione.' },
      { titolo: 'Intervento', testo: 'Manutenzione o sostituzione del componente, con saldature quando serve.' },
      { titolo: 'Test prolungato', testo: 'Una sessione di gioco reale per verificare temperature e stabilità.' },
    ],
    domande: [
      {
        domanda: 'La console fa molto rumore: si può risolvere?',
        risposta:
          'Sì. Il rumore nasce dalla ventola che compensa la polvere accumulata: dopo una pulizia completa e la nuova pasta termica la console torna silenziosa.',
      },
      {
        domanda: 'Riparate il drifting dei controller?',
        risposta: 'Sì, sostituendo il modulo dello stick. È un intervento rapido e molto più economico di un controller nuovo.',
      },
    ],
  },

  'recupero-dati': {
    titolo: 'Recupero dati da hard disk, SSD e memorie',
    intro:
      'Foto, documenti, archivi di lavoro: quando un disco non viene più riconosciuto la prima cosa da fare è spegnerlo e non insistere. Ogni tentativo in più riduce le possibilità di recupero.',
    interventi: [
      'Hard disk meccanici che non vengono riconosciuti o fanno rumore',
      'SSD e chiavette con controller danneggiato',
      'Schede di memoria e memorie interne di smartphone e fotocamere',
      'Volumi RAID e NAS aziendali, con ricostruzione dell’array',
      'File cancellati per errore o unità formattate',
    ],
    fasi: [
      { titolo: 'Analisi', testo: 'Prima verifica gratuita: ti diciamo cosa è recuperabile prima di iniziare e quanto costa.' },
      { titolo: 'Copia di lavoro', testo: 'Si lavora sempre su una copia settore per settore, mai sull’originale.' },
      { titolo: 'Estrazione', testo: 'Recupero dei file e verifica che siano davvero apribili, non solo presenti.' },
      { titolo: 'Consegna', testo: 'I dati vengono consegnati su un supporto nuovo, con elenco di quanto recuperato.' },
    ],
    domande: [
      {
        domanda: 'Quante possibilità ci sono di recuperare tutto?',
        risposta:
          'Dipende dal danno. Sui guasti logici si recupera quasi sempre la totalità; sui danni meccanici la percentuale varia e te la comunichiamo dopo l’analisi, prima di qualsiasi spesa.',
      },
      {
        domanda: 'I miei file restano riservati?',
        risposta:
          'Sì. Il recupero avviene internamente, mai in outsourcing, e la copia di lavoro viene cancellata in modo sicuro entro 30 giorni dalla riconsegna.',
      },
    ],
  },

  videosorveglianza: {
    titolo: 'Impianti di videosorveglianza',
    intro:
      'Progettiamo e installiamo impianti per abitazioni, negozi, uffici e capannoni: telecamere IP ad alta risoluzione, registrazione locale, visione da smartphone e configurazione conforme alle indicazioni del Garante Privacy.',
    interventi: [
      'Sopralluogo gratuito con studio delle inquadrature e delle zone d’ombra',
      'Telecamere IP fino a 4K, con visione notturna reale e non simulata',
      'Registratori con spazio dimensionato sui giorni di conservazione richiesti',
      'Notifiche intelligenti che distinguono persone e veicoli, riducendo i falsi allarmi',
      'Zone di privacy, accessi nominali e cartellonistica per la conformità normativa',
    ],
    fasi: [
      { titolo: 'Sopralluogo', testo: 'Verifichiamo cosa serve davvero inquadrare: spesso servono meno telecamere del previsto.' },
      { titolo: 'Progetto', testo: 'Preventivo con posizioni, percorsi dei cavi e tempi di conservazione delle immagini.' },
      { titolo: 'Installazione', testo: 'Cablaggio PoE nascosto, staffe adeguate al punto di montaggio, nessun cavo a vista.' },
      { titolo: 'Consegna', testo: 'Configurazione dell’app, formazione all’uso e documento con le impostazioni adottate.' },
    ],
    domande: [
      {
        domanda: 'Posso vedere le telecamere dal telefono?',
        risposta: 'Sì, da smartphone e computer, anche fuori casa. Configuriamo noi l’accesso in modo sicuro, senza esporre il registratore su internet.',
      },
      {
        domanda: 'Cosa posso riprendere per legge?',
        risposta:
          'Le tue pertinenze. Lo spazio pubblico e la proprietà altrui vanno mascherati: lo facciamo via software con le zone di privacy, e forniamo la cartellonistica necessaria.',
      },
    ],
  },

  'impianti-wifi': {
    titolo: 'Impianti internet e reti Wi-Fi',
    intro:
      'Se la connessione cade o non arriva in tutte le stanze, quasi mai è colpa della linea: è il modo in cui il segnale viene distribuito. Misuriamo la copertura sul posto e progettiamo di conseguenza.',
    interventi: [
      'Survey radio con misurazione della copertura stanza per stanza',
      'Access point professionali con passaggio automatico tra i piani',
      'Configurazione di fibra, FWA e collegamenti di riserva su rete mobile',
      'Rete ospiti separata per hotel, B&B, ristoranti e negozi',
      'Ripetitori e ponti radio per capannoni, magazzini e dipendenze',
    ],
    fasi: [
      { titolo: 'Misurazione', testo: 'Rileviamo potenza e interferenze: si scopre dove il segnale cade davvero.' },
      { titolo: 'Progetto', testo: 'Numero e posizione degli apparati, con il preventivo dettagliato.' },
      { titolo: 'Installazione', testo: 'Montaggio, cablaggio e configurazione delle reti, compresa quella ospiti.' },
      { titolo: 'Verifica', testo: 'Nuova misurazione a impianto acceso, per dimostrare il risultato ottenuto.' },
    ],
    domande: [
      {
        domanda: 'Basta un ripetitore per risolvere?',
        risposta:
          'Raramente. Un ripetitore dimezza la banda e crea una seconda rete a cui i dispositivi restano attaccati anche quando non conviene. Con gli access point il passaggio è automatico e la velocità resta piena.',
      },
      {
        domanda: 'Lavorate anche con la linea di un altro operatore?',
        risposta: 'Sì, l’impianto è indipendente dall’operatore: se cambi fornitore la rete resta la tua.',
      },
    ],
  },

  'reti-aziendali': {
    titolo: 'Reti aziendali e sicurezza',
    intro:
      'Uffici, studi professionali e attività che non possono permettersi fermi: progettiamo reti con separazione del traffico, accesso da remoto sicuro e monitoraggio continuo, e lasciamo la documentazione al cliente.',
    interventi: [
      'Segmentazione della rete con VLAN: gestionale, casse, telecamere e ospiti separati',
      'Firewall configurato con regole scritte e commentate',
      'VPN per il lavoro da remoto e per le sedi collegate',
      'Monitoraggio degli apparati con avviso prima che l’utente se ne accorga',
      'Backup della configurazione e piano di ripristino',
    ],
    fasi: [
      { titolo: 'Analisi', testo: 'Rilievo di quello che c’è, di come viene usato e di dove nascono i fermi.' },
      { titolo: 'Progetto', testo: 'Schema della rete, apparati proposti e tempi di intervento concordati.' },
      { titolo: 'Realizzazione', testo: 'Migrazione pianificata negli orari di chiusura, per non fermare il lavoro.' },
      { titolo: 'Manutenzione', testo: 'Contratto con SLA, monitoraggio e report periodici.' },
    ],
    domande: [
      {
        domanda: 'Perché separare le reti?',
        risposta:
          'Perché un dispositivo compromesso sulla rete ospiti non deve poter raggiungere il gestionale o le telecamere. È la misura di sicurezza con il miglior rapporto tra costo e beneficio.',
      },
      {
        domanda: 'Consegnate la documentazione dell’impianto?',
        risposta: 'Sempre. Schema, credenziali e configurazioni sono del cliente: nessun vincolo con noi.',
      },
    ],
  },

  'access-point': {
    titolo: 'Installazione access point',
    intro:
      'Hotel, B&B, uffici e capannoni hanno bisogno di copertura uniforme, non di potenza. Installiamo access point professionali gestiti da controller, con passaggio trasparente tra un apparato e l’altro.',
    interventi: [
      'Access point Wi-Fi 6 alimentati via cavo di rete (PoE)',
      'Roaming tra i piani senza interruzione di videochiamate e streaming',
      'Gestione centralizzata: una modifica si applica a tutti gli apparati',
      'Portale di accesso per gli ospiti con credenziali a scadenza',
      'Limite di banda per dispositivo, perché nessuno rallenti gli altri',
    ],
    fasi: [
      { titolo: 'Sopralluogo', testo: 'Misuriamo dove serve un apparato e dove sarebbe soltanto un costo in più.' },
      { titolo: 'Cablaggio', testo: 'Portiamo il cavo di rete al punto scelto: un solo cavo per dati e alimentazione.' },
      { titolo: 'Configurazione', testo: 'Reti, canali e potenze impostati sulla struttura, non sui valori di fabbrica.' },
      { titolo: 'Collaudo', testo: 'Prova di camminata con misurazione continua, per verificare il passaggio tra apparati.' },
    ],
    domande: [
      {
        domanda: 'Quanti access point servono per una struttura da venti camere?',
        risposta:
          'In genere tre o quattro, ma dipende dai muri e dalla disposizione. Il sopralluogo serve proprio a non farti comprare apparati inutili.',
      },
      {
        domanda: 'Gli ospiti vedono la mia rete interna?',
        risposta: 'No. La rete ospiti è isolata: non raggiunge il gestionale, le casse né le telecamere.',
      },
    ],
  },

  'cablaggio-rete': {
    titolo: 'Cablaggio strutturato di rete',
    intro:
      'Il cavo è l’unica parte dell’impianto che resterà uguale per vent’anni: vale la pena farla bene. Realizziamo cablaggi in categoria 6 e 6A, armadi ordinati e certificazione dei punti rete.',
    interventi: [
      'Punti rete in categoria 6 e 6A, con certificazione strumentale',
      'Armadi rack organizzati, patch panel etichettati e percorsi documentati',
      'Fibra ottica per collegamenti tra edifici o piani distanti',
      'Canaline e passaggi a incasso, con ripristino delle finiture',
      'Riordino di impianti esistenti diventati ingestibili',
    ],
    fasi: [
      { titolo: 'Rilievo', testo: 'Individuiamo i punti da servire e i percorsi possibili, con il cliente sul posto.' },
      { titolo: 'Posa', testo: 'Stesura dei cavi e attestazione su patch panel e prese.' },
      { titolo: 'Certificazione', testo: 'Ogni punto viene misurato con strumento: consegniamo il report.' },
      { titolo: 'Etichettatura', testo: 'Prese e porte numerate: chi interverrà dopo di noi capirà subito lo schema.' },
    ],
    domande: [
      {
        domanda: 'Serve rompere i muri?',
        risposta:
          'Non sempre: usiamo canaline, controsoffitti e cavidotti esistenti quando ci sono. Le soluzioni possibili le valutiamo insieme durante il sopralluogo.',
      },
      {
        domanda: 'Perché certificare i punti rete?',
        risposta:
          'Perché un cavo che “sembra funzionare” può perdere pacchetti sotto carico. La certificazione dimostra che il punto regge la velocità dichiarata.',
      },
    ],
  },

  'assistenza-aziende': {
    titolo: 'Assistenza tecnica per aziende e attività',
    intro:
      'Un numero solo da chiamare quando qualcosa si ferma. Contratti di manutenzione con tempi di intervento garantiti per hotel, B&B, negozi, ristoranti, studi professionali e uffici dell’Ogliastra.',
    interventi: [
      'Intervento in sede con tempi garantiti da contratto',
      'Assistenza da remoto per i problemi che non richiedono un sopralluogo',
      'Manutenzione programmata di reti, telecamere e postazioni',
      'Sostituzione temporanea del dispositivo durante la riparazione',
      'Report periodici con interventi svolti e criticità da pianificare',
    ],
    fasi: [
      { titolo: 'Analisi', testo: 'Censimento degli apparati e dei punti critici dell’attività.' },
      { titolo: 'Contratto', testo: 'Tempi di intervento e canone definiti in base a quello che serve davvero.' },
      { titolo: 'Presidio', testo: 'Monitoraggio e manutenzione programmata durante l’anno.' },
      { titolo: 'Verifica', testo: 'Incontro periodico con il report degli interventi e delle proposte.' },
    ],
    domande: [
      {
        domanda: 'Come funziona il tempo di intervento garantito?',
        risposta:
          'Il contratto indica entro quante ore lavorative siamo sul posto per un fermo bloccante. Per i clienti in contratto la precedenza è automatica.',
      },
      {
        domanda: 'Serve un contratto per essere seguiti?',
        risposta:
          'No, interveniamo anche a chiamata. Il contratto conviene quando i dispositivi sono molti e un fermo costa più della manutenzione.',
      },
    ],
  },
}
