/**
 * Illustrazioni del sito: scene vettoriali coerenti con l'identità del marchio,
 * usate in galleria, schede servizio e copertine degli articoli.
 * Sono disegnate a mano in SVG: nessun file da scaricare, nitide a ogni densità.
 */

const SCENE: Record<string, string> = {
  bench: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="300" cy="70" r="120" fill="url(#gGlow)" opacity=".55"/>
      <rect x="52" y="230" width="296" height="12" rx="4" fill="#0a1120"/>
      <rect x="70" y="86" width="120" height="146" rx="14" fill="#0d1626" stroke="#2a3f63"/>
      <rect x="80" y="100" width="100" height="118" rx="8" fill="url(#gA)" opacity=".5"/>
      <path d="M92 196h76M92 176h56" stroke="#bcd6ff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
      <rect x="214" y="120" width="128" height="98" rx="10" fill="#0d1626" stroke="#2a3f63"/>
      <path d="M232 190l22-30 18 22 16-26 24 34z" fill="#4c8dff" opacity=".5"/>
      <circle cx="252" cy="146" r="9" fill="#7fb2ff" opacity=".8"/>
      <path d="M150 60l38-38" stroke="#4c8dff" stroke-width="7" stroke-linecap="round"/>
      <circle cx="196" cy="16" r="12" fill="none" stroke="#7fb2ff" stroke-width="7"/>`,
  phone: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="120" cy="120" r="130" fill="url(#gGlow)" opacity=".4"/>
      <g transform="rotate(-9 200 150)">
      <rect x="140" y="34" width="120" height="232" rx="22" fill="#0b1524" stroke="#33507f" stroke-width="2"/>
      <rect x="150" y="52" width="100" height="184" rx="10" fill="url(#gA)" opacity=".75"/>
      <rect x="182" y="40" width="36" height="7" rx="3.5" fill="#101c2e"/>
      <circle cx="200" cy="250" r="7" fill="#101c2e"/>
      <path d="M162 210h76M162 190h50" stroke="#e8f1ff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>
      </g>
      <path d="M286 96l30-30" stroke="#7fb2ff" stroke-width="9" stroke-linecap="round"/>
      <circle cx="322" cy="60" r="14" fill="none" stroke="#7fb2ff" stroke-width="9"/>
      <circle cx="86" cy="214" r="26" fill="none" stroke="#4c8dff" stroke-width="4" opacity=".6"/>
      <path d="M104 232l22 22" stroke="#4c8dff" stroke-width="7" stroke-linecap="round" opacity=".6"/>`,
  tablet: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="290" cy="200" r="120" fill="url(#gGlow)" opacity=".35"/>
      <rect x="96" y="40" width="208" height="220" rx="16" fill="#0b1524" stroke="#33507f" stroke-width="2"/>
      <rect x="110" y="58" width="180" height="184" rx="8" fill="url(#gA)" opacity=".6"/>
      <g stroke="#dce9ff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round">
      <path d="M130 200h140M130 176h96M130 152h116"/>
      </g>
      <rect x="130" y="78" width="140" height="52" rx="8" fill="#08111e" opacity=".55"/>
      <path d="M154 104h92" stroke="#7fb2ff" stroke-width="5" stroke-linecap="round"/>`,
  laptop: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="200" cy="110" r="140" fill="url(#gGlow)" opacity=".35"/>
      <path d="M96 68h208v132H96z" fill="#0b1524" stroke="#33507f" stroke-width="2" rx="8"/>
      <rect x="108" y="80" width="184" height="108" rx="5" fill="url(#gA)" opacity=".65"/>
      <path d="M60 208h280l22 30H38z" fill="#101d31" stroke="#33507f"/>
      <path d="M168 220h64" stroke="#4c8dff" stroke-width="6" stroke-linecap="round"/>
      <g stroke="#dbe9ff" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"><path d="M126 168h100M126 150h64M126 132h84"/></g>
      <circle cx="286" cy="104" r="10" fill="#7fb2ff" opacity=".85"/>`,
  data: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="200" cy="150" r="130" fill="url(#gGlow)" opacity=".4"/>
      <g fill="#0d1a2c" stroke="#33507f" opacity="1">
      <ellipse cx="200" cy="86" rx="86" ry="30" fill="#12213a" stroke="#33507f"/>
      </g>
      <ellipse cx="200" cy="86" rx="86" ry="30" fill="#12213a" stroke="#33507f"/>
      <path d="M114 86v128c0 16 38 30 86 30s86-14 86-30V86" fill="#0e1a2e" stroke="#33507f"/>
      <ellipse cx="200" cy="86" rx="86" ry="30" fill="url(#gA)" opacity=".55"/>
      <path d="M114 150c0 16 38 30 86 30s86-14 86-30" fill="none" stroke="#4c8dff" stroke-opacity=".6"/>
      <circle cx="250" cy="122" r="6" fill="#2dd4a7"/><circle cx="250" cy="186" r="6" fill="#2dd4a7"/>
      <path d="M148 214l24-26 22 18 20-30" fill="none" stroke="#7fb2ff" stroke-width="5" stroke-linecap="round"/>`,
  cam: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="270" cy="90" r="140" fill="url(#gGlow)" opacity=".4"/>
      <path d="M120 60h96v18h-96z" fill="#1b2c48"/>
      <rect x="86" y="52" width="150" height="16" rx="8" fill="#1b2c48"/>
      <path d="M160 68v22" stroke="#1b2c48" stroke-width="10"/>
      <g transform="rotate(14 200 150)">
      <rect x="118" y="96" width="150" height="66" rx="16" fill="#101f36" stroke="#33507f" stroke-width="2"/>
      <circle cx="258" cy="129" r="30" fill="#0a1424" stroke="#4c8dff" stroke-width="3"/>
      <circle cx="258" cy="129" r="15" fill="url(#gA)"/>
      <circle cx="252" cy="122" r="5" fill="#cfe2ff" opacity=".8"/>
      <rect x="134" y="112" width="26" height="10" rx="5" fill="#2dd4a7" opacity=".85"/>
      </g>
      <path d="M296 150l70 74M296 210l70-60" stroke="#4c8dff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="8 8"/>
      <path d="M60 250h280" stroke="#22334f" stroke-width="3"/>`,
  net: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="200" cy="150" r="140" fill="url(#gGlow)" opacity=".35"/>
      <g stroke="#4c8dff" stroke-opacity=".55" stroke-width="2.5" fill="none">
      <path d="M200 118V72M200 118l-84 62M200 118l84 62M116 180v42M284 180v42"/>
      </g>
      <rect x="146" y="118" width="108" height="40" rx="10" fill="#12203a" stroke="#33507f"/>
      <rect x="146" y="118" width="108" height="40" rx="10" fill="#12203a" stroke="#33507f"/>
      <g fill="#2dd4a7"><circle cx="166" cy="138" r="4"/><circle cx="182" cy="138" r="4"/></g>
      <circle cx="214" cy="138" r="4" fill="#f5b544"/><circle cx="230" cy="138" r="4" fill="#7fb2ff"/>
      <g fill="#101d31" stroke="#33507f">
      <rect x="80" y="180" width="72" height="46" rx="9"/><rect x="248" y="180" width="72" height="46" rx="9"/>
      <rect x="164" y="40" width="72" height="34" rx="9"/>
      </g>
      <path d="M100 202h32M268 202h32M186 58h28" stroke="#4c8dff" stroke-width="4" stroke-linecap="round"/>`,
  wifi: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="200" cy="230" r="150" fill="url(#gGlow)" opacity=".3"/>
      <g fill="none" stroke="#4c8dff" stroke-linecap="round" stroke-width="12" opacity=".9">
      <path d="M118 176a116 116 0 0 1 164 0" stroke-opacity=".3"/>
      <path d="M148 208a74 74 0 0 1 104 0" stroke-opacity=".55"/>
      <path d="M176 238a34 34 0 0 1 48 0" stroke-opacity=".9"/>
      </g>
      <circle cx="200" cy="266" r="11" fill="#7fb2ff"/>
      <rect x="150" y="52" width="100" height="34" rx="10" fill="#12203a" stroke="#33507f"/>
      <circle cx="200" cy="69" r="7" fill="#2dd4a7"/>
      <path d="M200 86v22" stroke="#33507f" stroke-width="4"/>`,
  cable: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="120" cy="180" r="130" fill="url(#gGlow)" opacity=".3"/>
      <rect x="90" y="60" width="220" height="180" rx="14" fill="#0e1a2e" stroke="#33507f" stroke-width="2"/>
      <g fill="#12213a" stroke="#33507f"><rect x="110" y="84" width="180" height="40" rx="7"/></g>
      <rect x="110" y="84" width="180" height="40" rx="7" fill="#12213a" stroke="#33507f"/>
      <rect x="110" y="140" width="180" height="40" rx="7" fill="#12213a" stroke="#33507f"/>
      <g fill="#4c8dff" opacity=".85">
      <rect x="122" y="96" width="14" height="16" rx="3"/><rect x="146" y="96" width="14" height="16" rx="3"/>
      <rect x="170" y="96" width="14" height="16" rx="3"/><rect x="194" y="96" width="14" height="16" rx="3"/>
      <rect x="218" y="96" width="14" height="16" rx="3"/><rect x="242" y="96" width="14" height="16" rx="3"/>
      </g>
      <g fill="#2dd4a7" opacity=".8">
      <rect x="122" y="152" width="14" height="16" rx="3"/><rect x="146" y="152" width="14" height="16" rx="3"/>
      <rect x="170" y="152" width="14" height="16" rx="3"/>
      </g>
      <path d="M132 180c0 40 40 30 40 60M180 180c0 46 60 34 60 60" fill="none" stroke="#4c8dff" stroke-width="5" stroke-opacity=".7" stroke-linecap="round"/>`,
  shop: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="200" cy="60" r="150" fill="url(#gGlow)" opacity=".3"/>
      <path d="M70 110h260l-16-46H86z" fill="#12213a" stroke="#33507f"/>
      <rect x="70" y="110" width="260" height="140" rx="8" fill="#0e1a2e" stroke="#33507f"/>
      <rect x="96" y="142" width="86" height="76" rx="7" fill="url(#gA)" opacity=".5"/>
      <rect x="212" y="142" width="92" height="108" rx="7" fill="#101d31" stroke="#33507f"/>
      <path d="M232 250v-88h52v88" fill="none" stroke="#4c8dff" stroke-width="3"/>
      <circle cx="272" cy="204" r="4" fill="#7fb2ff"/>
      <path d="M86 64h228" stroke="#4c8dff" stroke-width="4"/>
      <circle cx="140" cy="94" r="7" fill="#2dd4a7"/>`,
  team: `<rect width="400" height="300" fill="url(#gB)"/><rect width="400" height="300" fill="url(#pGrid)"/>
      <circle cx="200" cy="120" r="150" fill="url(#gGlow)" opacity=".32"/>
      <rect x="40" y="196" width="320" height="14" rx="7" fill="#101d31"/>
      <g fill="#12213a" stroke="#33507f">
      <circle cx="130" cy="112" r="30"/><circle cx="200" cy="96" r="34"/><circle cx="270" cy="112" r="30"/>
      </g>
      <path d="M92 196c0-24 17-42 38-42s38 18 38 42M156 196c0-28 20-48 44-48s44 20 44 48M232 196c0-24 17-42 38-42s38 18 38 42" fill="url(#gA)" opacity=".55"/>
      <path d="M186 112h28M192 84h16" stroke="#7fb2ff" stroke-width="4" stroke-linecap="round"/>`,
}

export type NomeScena = keyof typeof SCENE

/** Definizioni condivise (gradienti e trama) montate una sola volta. */
export function SpriteIllustrazioni() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e40af" />
          <stop offset=".55" stopColor="#2563eb" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="gB" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0b1220" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id="gGlow">
          <stop offset="0" stopColor="#4c8dff" stopOpacity=".75" />
          <stop offset="1" stopColor="#4c8dff" stopOpacity="0" />
        </radialGradient>
        <pattern id="pGrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0v26" fill="none" stroke="#4c8dff" strokeOpacity=".16" />
        </pattern>
      </defs>
      {Object.entries(SCENE).map(([nome, contenuto]) => (
        <symbol key={nome} id={`s-${nome}`} viewBox="0 0 400 300" dangerouslySetInnerHTML={{ __html: contenuto }} />
      ))}
    </svg>
  )
}

export function Illustrazione({
  scena,
  className,
  ritaglia,
  style,
}: {
  scena: NomeScena
  className?: string
  /** Riempie il riquadro mantenendo le proporzioni (come `object-fit: cover`) */
  ritaglia?: boolean
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      style={style}
      preserveAspectRatio={ritaglia ? 'xMidYMid slice' : 'xMidYMid meet'}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`#s-${scena}`} />
    </svg>
  )
}
