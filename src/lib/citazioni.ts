/**
 * Una frase al giorno nella Dashboard.
 *
 * Sono citazioni di Steve Jobs. Ognuna porta con sé da dove viene: il discorso
 * di Stanford del 2005, un'intervista, una riunione documentata. Non è
 * pignoleria — in rete girano decine di frasi attribuite a Jobs che non ha mai
 * detto, e una frase inventata in un gestionale è come una didascalia inventata
 * su un sito. Qui ci sono solo quelle di cui si conosce l'origine.
 *
 * Il testo italiano è una traduzione: l'originale è in inglese.
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
      'Non potete unire i puntini guardando avanti: potete solo unirli guardando indietro. Dovete avere fiducia che in qualche modo, nel futuro, si uniranno.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'L’unico modo di fare un lavoro eccellente è amare quello che fai. Se non l’hai ancora trovato, continua a cercare.',
    fonte: 'Discorso a Stanford, 2005',
  },
  {
    testo:
      'Il design non è solo come appare o come lo senti al tatto. Il design è come funziona.',
    fonte: 'Intervista al New York Times, 2003',
  },
  {
    testo:
      'La qualità conta più della quantità. Un fuoricampo vale molto più di due doppi.',
    fonte: 'Intervista a BusinessWeek, 2006',
  },
  {
    testo: 'Sono orgoglioso delle cose che non abbiamo fatto quanto di quelle che abbiamo fatto.',
    fonte: 'Intervista a BusinessWeek, 2004',
  },
  {
    testo:
      'La gente non sa quello che vuole finché non glielo mostri. Per questo non mi affido alle ricerche di mercato.',
    fonte: 'Intervista a BusinessWeek, 1998',
  },
  {
    testo: 'I veri artisti consegnano.',
    fonte: 'Al gruppo del primo Macintosh, 1983',
  },
  {
    testo:
      'Essere l’uomo più ricco del cimitero non mi interessa. Andare a letto la sera dicendo che abbiamo fatto qualcosa di meraviglioso, quello sì.',
    fonte: 'Intervista al Wall Street Journal, 1993',
  },
  {
    testo:
      'Innovare è dire di no a mille cose. Bisogna scegliere con cura.',
    fonte: 'Conferenza degli sviluppatori Apple, 1997',
  },
  {
    testo:
      'Assumiamo persone in gamba per dire loro cosa fare? No. Le assumiamo perché siano loro a dire a noi cosa fare.',
    fonte: 'Intervista, 1985',
  },
  {
    testo:
      'Quando fai un cassetto, il retro lo fai bene lo stesso, anche se sta contro il muro. Lo sai tu che c’è, e questo basta.',
    fonte: 'Sul lavoro del padre falegname, riportato da Walter Isaacson',
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
