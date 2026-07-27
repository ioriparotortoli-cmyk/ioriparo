/**
 * Set di icone del sito: un unico sprite SVG montato una sola volta
 * e richiamato con `<Icona nome="…" />`. Nessuna libreria esterna, nessun
 * download aggiuntivo, tratto uniforme su tutte le icone.
 */

const TRATTI: Record<string, string> = {
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18.5h2"/>',
  tablet: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M11 17.5h2"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 19h20"/>',
  desktop: '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M9 20h6M12 16.5V20"/>',
  data: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  cam: '<path d="M3 8.5 15 5v10L3 11.5z"/><path d="M15 8h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4M6 15v4"/>',
  wifi: '<path d="M2 8.8a16 16 0 0 1 20 0M5.5 12.6a11 11 0 0 1 13 0M9 16.4a6 6 0 0 1 6 0"/><circle cx="12" cy="20" r=".6" fill="currentColor"/>',
  net: '<rect x="9" y="2.5" width="6" height="6" rx="1.5"/><rect x="2" y="15.5" width="6" height="6" rx="1.5"/><rect x="16" y="15.5" width="6" height="6" rx="1.5"/><path d="M12 8.5v4M5 15.5v-3h14v3"/>',
  ap: '<circle cx="12" cy="16" r="3"/><path d="M7.5 11.5a6.4 6.4 0 0 1 9 0M4.2 8.2a11 11 0 0 1 15.6 0"/>',
  cable: '<path d="M7 3v5H5v5a3 3 0 0 0 3 3h1v5"/><path d="M17 21v-5h2v-5a3 3 0 0 0-3-3h-1V3"/>',
  tool: '<path d="M14.5 5.5a4.5 4.5 0 0 0 5.8 5.8l-8.4 8.4a2.6 2.6 0 0 1-3.7-3.7z"/><path d="M14.5 5.5 17 3"/>',
  shield: '<path d="M12 2.5 4.5 6v6c0 4.6 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
  star: '<path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z"/>',
  check: '<path d="m4.5 12.5 5 5 10-11"/>',
  euro: '<path d="M18 6.5A7 7 0 0 0 7.5 12 7 7 0 0 0 18 17.5M4 10.5h8M4 13.5h8"/>',
  pin: '<path d="M12 21.5s7-6.2 7-11.5a7 7 0 1 0-14 0c0 5.3 7 11.5 7 11.5z"/><circle cx="12" cy="10" r="2.6"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  call: '<path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.7 7.1L4 20.5l1.4-5.3A8 8 0 1 1 21 12z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  doc: '<path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z"/><path d="M13.5 3v5.5H19M8.5 13h7M8.5 17h5"/>',
  box: '<path d="m12 2.8 8.5 4.4v9.6L12 21.2 3.5 16.8V7.2z"/><path d="M3.5 7.2 12 11.6l8.5-4.4M12 11.6v9.6"/>',
  chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12.5 16V8M17 16v-6"/>',
  wa: '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.4.7-.4h.5c.2 0 .4-.1.7.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.1-.2.3-.1.5.1.2.6 1.2 1.4 1.9 1 .9 1.8 1.2 2 1.3.2.1.4.1.5-.1l.8-.9c.2-.2.3-.2.5-.1l2 1c.3.1.4.2.5.3.1.2.1.6-.1 1.5z" fill="currentColor" stroke="none"/>',
  fb: '<path d="M14.5 8.5V6.8c0-.8.2-1.3 1.5-1.3H17.5V2.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v1.8H8.5v3h2.5V21h3.5v-9.5h2.6l.4-3z"/>',
  ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.1" fill="currentColor"/>',
  lock: '<rect x="4.5" y="10" width="15" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z"/><path d="M10 18a2 2 0 0 0 4 0"/>',
}

export type NomeIcona = keyof typeof TRATTI

/** Sprite da montare una sola volta nel layout. */
export function SpriteIcone() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      {Object.entries(TRATTI).map(([nome, tratti]) => (
        <symbol key={nome} id={`i-${nome}`} viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: tratti }} />
      ))}
    </svg>
  )
}

export function Icona({
  nome,
  dimensione = 18,
  className,
  pieno,
}: {
  nome: NomeIcona
  dimensione?: number
  className?: string
  /** Icone piene (stelle, WhatsApp) invece del tratto */
  pieno?: boolean
}) {
  return (
    <svg
      className={className}
      width={dimensione}
      height={dimensione}
      aria-hidden="true"
      focusable="false"
      style={{
        stroke: pieno ? 'none' : 'currentColor',
        fill: pieno ? 'currentColor' : 'none',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        flex: 'none',
      }}
    >
      <use href={`#i-${nome}`} />
    </svg>
  )
}
