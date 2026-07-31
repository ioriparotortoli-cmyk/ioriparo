/**
 * Una frase al giorno: in cima alla Dashboard del gestionale e nell'apertura
 * del sito.
 *
 * Sono citazioni di Steve Jobs. Ognuna porta con sé da dove viene: il discorso
 * di Stanford del 2005, un'intervista, una riunione documentata. Non è
 * pignoleria — in rete girano decine di frasi attribuite a Jobs che non ha mai
 * detto, e una frase inventata in un gestionale è come una didascalia inventata
 * su un sito. Qui ci sono solo quelle di cui si conosce l'origine.
 *
 * Il testo italiano è una traduzione: l'originale è in inglese.
 *
 * L'ordine non è casuale: le fonti sono mescolate apposta, così non capitano
 * sette giorni di fila con lo stesso discorso di Stanford.
 */

export interface Citazione {
  testo: string
  fonte: string
}

const CITAZIONI: Citazione[] = [
  {
    testo: 'Il vostro tempo è limitato: non sprecatelo vivendo la vita di qualcun altro.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'Semplice può essere più difficile di complicato: devi lavorare sodo per rendere pulito il tuo pensiero, per farlo semplice.',
    fonte: 'Intervista a BusinessWeek, 1998',
  },
  {
    testo:
      'Se vuoi vivere la tua vita in modo creativo, non devi guardarti troppo indietro. Devi essere disposto a prendere quello che hai fatto e quello che eri, e buttarlo via.',
    fonte: 'Intervista a Playboy, 1985',
  },
  {
    testo:
      'Il design non è solo come appare o come lo senti al tatto. Il design è come funziona.',
    fonte: 'Intervista al New York Times, 2003',
  },
  {
    testo:
      'Non potete unire i puntini guardando avanti: potete solo unirli guardando indietro. Dovete avere fiducia che in qualche modo, nel futuro, si uniranno.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo: 'I veri artisti consegnano.',
    fonte: 'Al gruppo del primo Macintosh, 1983',
  },
  {
    testo:
      'La creatività è solo collegare le cose. Quando chiedi a una persona creativa come ha fatto qualcosa, si sente quasi in colpa: non l’ha fatto davvero, ha solo visto qualcosa.',
    fonte: 'Intervista a Wired, 1996',
  },
  {
    testo:
      'La qualità conta più della quantità. Un fuoricampo vale molto più di due doppi.',
    fonte: 'Intervista a BusinessWeek, 2006',
  },
  {
    testo: 'Siate affamati. Siate folli.',
    fonte: 'Discorso a Stanford, 2005, citando il Whole Earth Catalog',
  },
  {
    testo:
      'Bisogna partire dall’esperienza di chi userà la cosa e tornare indietro fino alla tecnologia, non il contrario.',
    fonte: 'Conferenza degli sviluppatori Apple, 1997',
  },
  {
    testo:
      'Quando fai un cassetto, il retro lo fai bene lo stesso, anche se sta contro il muro. Lo sai tu che c’è, e questo basta.',
    fonte: 'Sul lavoro del padre falegname, riportato da Walter Isaacson',
  },
  {
    testo:
      'Tutto quello che ti circonda e che chiami vita è stato costruito da persone non più intelligenti di te. E tu puoi cambiarlo.',
    fonte: 'Intervista alla Santa Clara Valley Historical Association, 1994',
  },
  {
    testo: 'Sono orgoglioso delle cose che non abbiamo fatto quanto di quelle che abbiamo fatto.',
    fonte: 'Intervista a BusinessWeek, 2004',
  },
  {
    testo:
      'Il computer è lo strumento più straordinario che ci sia mai venuto in mente: è come una bicicletta per la nostra mente.',
    fonte: 'Intervista per il documentario Memory & Imagination, 1990',
  },
  {
    testo:
      'L’unico modo di fare un lavoro eccellente è amare quello che fai. Se non l’hai ancora trovato, continua a cercare.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'L’innovazione non ha niente a che vedere con quanti soldi metti nella ricerca. Quando facemmo il Mac, IBM ci spendeva almeno cento volte tanto. Non sono i soldi: sono le persone che hai e quanto ci capisci.',
    fonte: 'Intervista a Fortune, 1998',
  },
  {
    testo:
      'Il Macintosh non l’abbiamo costruito per qualcun altro: l’abbiamo costruito per noi. Eravamo noi il gruppo che doveva giudicare se era bello.',
    fonte: 'Intervista a Playboy, 1985',
  },
  {
    testo:
      'La morte è probabilmente la migliore invenzione della vita: è quella che porta il cambiamento.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo: 'Innovare è dire di no a mille cose. Bisogna scegliere con cura.',
    fonte: 'Conferenza degli sviluppatori Apple, 1997',
  },
  {
    testo:
      'I grandi artisti — Dylan, Picasso, Newton — hanno rischiato di fallire. Se vuoi fare qualcosa di grande, a un certo punto devi rischiare anche tu.',
    fonte: 'Intervista per la Smithsonian Institution, 1995',
  },
  {
    testo:
      'La gente non sa quello che vuole finché non glielo mostri. Per questo non mi affido alle ricerche di mercato.',
    fonte: 'Intervista a BusinessWeek, 1998',
  },
  {
    testo:
      'Non fatevi intrappolare dal dogma, che vuol dire vivere seguendo i risultati del pensiero di altri.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'Il design è l’anima di una cosa fatta dall’uomo, e finisce per venir fuori strato dopo strato fino al prodotto finito.',
    fonte: 'Intervista a Fortune, 2000',
  },
  {
    testo:
      'Non ho mai trovato nessuno che non volesse aiutarmi, quando gliel’ho chiesto. È questo che separa chi le cose le fa da chi si limita a sognarle.',
    fonte: 'Intervista alla Santa Clara Valley Historical Association, 1994',
  },
  {
    testo:
      'Essere l’uomo più ricco del cimitero non mi interessa. Andare a letto la sera dicendo che abbiamo fatto qualcosa di meraviglioso, quello sì.',
    fonte: 'Intervista al Wall Street Journal, 1993',
  },
  {
    testo: 'È più divertente fare il pirata che entrare in marina.',
    fonte: 'Al gruppo del primo Macintosh, 1983',
  },
  {
    testo:
      'Essere licenziato da Apple è stata la cosa migliore che potesse capitarmi: il peso del successo è stato sostituito dalla leggerezza di essere di nuovo un principiante.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'La tecnologia da sola non basta: è la tecnologia sposata con le arti, con le materie umanistiche, che dà il risultato che fa cantare il cuore.',
    fonte: 'Presentazione dell’iPad 2, 2011',
  },
  {
    testo:
      'Assumiamo persone in gamba per dire loro cosa fare? No. Le assumiamo perché siano loro a dire a noi cosa fare.',
    fonte: 'Intervista, 1985',
  },
  {
    testo:
      'Il problema di chi apre un’attività non è che siano in troppi a cominciare: è che sono in troppi a non tenere duro.',
    fonte: 'Intervista a Wired, 1996',
  },
  {
    testo:
      'Abbiate il coraggio di seguire il vostro cuore e la vostra intuizione: in qualche modo sanno già cosa volete davvero diventare.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'Un gruppo di persone in gamba è come i sassi dentro a un tamburo che gira: si scontrano, fanno rumore, e alla fine escono levigati.',
    fonte: 'Intervista, 1995',
  },
  {
    testo: 'Siamo qui per lasciare un segno nell’universo. Altrimenti perché essere qui?',
    fonte: 'Riportato da Walter Isaacson',
  },
  {
    testo:
      'Qualche errore lo faremo lungo la strada. Ed è un bene: vuol dire che qualche decisione la stiamo prendendo.',
    fonte: 'Conferenza degli sviluppatori Apple, 1997',
  },
  {
    testo:
      'Ricordare che presto sarò morto è lo strumento più importante che abbia mai incontrato per aiutarmi a prendere le decisioni grandi della vita.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'Il mondo è complicato e rumoroso, e non avremo la possibilità di far ricordare alla gente granché di noi. Per questo bisogna essere chiari su cosa vogliamo che sappiano.',
    fonte: 'Presentazione della campagna «Think Different», 1997',
  },
]

/**
 * La frase di oggi. Cambia a mezzanotte e resta la stessa per tutta la
 * giornata: si sceglie dal giorno del calendario, non a caso, così riaprendo
 * il gestionale non ne compare una diversa ogni volta.
 */
export function citazioneDelGiorno(adesso = new Date()): Citazione {
  const giorno = Math.floor(
    Date.UTC(adesso.getFullYear(), adesso.getMonth(), adesso.getDate()) / 86_400_000,
  )
  return CITAZIONI[((giorno % CITAZIONI.length) + CITAZIONI.length) % CITAZIONI.length]
}
