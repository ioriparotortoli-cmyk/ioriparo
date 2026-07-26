'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Composizione vettoriale di smartphone, computer e tablet: nessuna immagine
 * da scaricare, nitida su ogni schermo e animata in modo leggero.
 */
export function IllustrazioneDispositivi() {
  const movimentoRidotto = useReducedMotion()
  const fluttua = (ritardo: number) =>
    movimentoRidotto
      ? {}
      : {
          animate: { y: [0, -10, 0] },
          transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay: ritardo },
        }

  return (
    <div className="relative mx-auto w-full max-w-xl select-none">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-elettrico-600/30 blur-[90px]" />

      <svg
        viewBox="0 0 520 420"
        className="relative w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
        role="img"
        aria-label="Smartphone, computer portatile e tablet riparati da Io Riparo"
      >
        <defs>
          <linearGradient id="scocca" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#122238" />
            <stop offset="100%" stopColor="#050c18" />
          </linearGradient>
          <linearGradient id="schermo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1792d1" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#0f7fc2" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0a1526" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="riflesso" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Portatile */}
        <motion.g
          initial={movimentoRidotto ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.g {...fluttua(0)}>
            <rect x="132" y="96" width="268" height="176" rx="14" fill="url(#scocca)" stroke="#1792d1" strokeOpacity="0.35" />
            <rect x="144" y="108" width="244" height="152" rx="8" fill="url(#schermo)" />
            <rect x="144" y="108" width="244" height="152" rx="8" fill="url(#riflesso)" />
            <g stroke="#ffffff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round">
              <path d="M168 232h84" />
              <path d="M168 214h140" />
              <path d="M168 196h112" />
            </g>
            <circle cx="330" cy="150" r="26" fill="#ffffff" fillOpacity="0.12" />
            <path
              d="M320 150l7 7 14-15"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M112 272h308l16 22H96z" fill="url(#scocca)" stroke="#1792d1" strokeOpacity="0.3" />
            <rect x="232" y="278" width="68" height="6" rx="3" fill="#1792d1" fillOpacity="0.5" />
          </motion.g>
        </motion.g>

        {/* Tablet */}
        <motion.g
          initial={movimentoRidotto ? false : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.g {...fluttua(1.2)}>
            <rect x="376" y="152" width="126" height="172" rx="16" fill="url(#scocca)" stroke="#1792d1" strokeOpacity="0.4" />
            <rect x="386" y="164" width="106" height="148" rx="9" fill="url(#schermo)" />
            <rect x="386" y="164" width="106" height="148" rx="9" fill="url(#riflesso)" />
            <g fill="#ffffff" fillOpacity="0.5">
              <rect x="400" y="182" width="34" height="34" rx="9" />
              <rect x="444" y="182" width="34" height="34" rx="9" />
              <rect x="400" y="226" width="34" height="34" rx="9" />
              <rect x="444" y="226" width="34" height="34" rx="9" />
            </g>
            <rect x="416" y="288" width="46" height="6" rx="3" fill="#ffffff" fillOpacity="0.35" />
          </motion.g>
        </motion.g>

        {/* Smartphone */}
        <motion.g
          initial={movimentoRidotto ? false : { opacity: 0, x: -30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.g {...fluttua(0.6)}>
            <rect x="26" y="140" width="104" height="196" rx="22" fill="url(#scocca)" stroke="#1792d1" strokeOpacity="0.45" />
            <rect x="35" y="150" width="86" height="176" rx="15" fill="url(#schermo)" />
            <rect x="35" y="150" width="86" height="176" rx="15" fill="url(#riflesso)" />
            <rect x="62" y="156" width="32" height="7" rx="3.5" fill="#04070f" fillOpacity="0.85" />
            <g stroke="#ffffff" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round">
              <path d="M50 196h56" />
              <path d="M50 212h38" />
              <path d="M50 262h56" />
              <path d="M50 278h44" />
            </g>
            <circle cx="78" cy="236" r="14" fill="#ffffff" fillOpacity="0.16" />
            <path d="M72 236l5 5 10-11" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
          </motion.g>
        </motion.g>

        {/* Scintille tecniche */}
        {!movimentoRidotto &&
          [
            { cx: 120, cy: 96, r: 4, d: 0 },
            { cx: 468, cy: 118, r: 5, d: 0.8 },
            { cx: 60, cy: 366, r: 3.5, d: 1.4 },
            { cx: 400, cy: 358, r: 4.5, d: 2 },
          ].map((punto) => (
            <motion.circle
              key={`${punto.cx}-${punto.cy}`}
              cx={punto.cx}
              cy={punto.cy}
              r={punto.r}
              fill="#29a8e0"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.35, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: punto.d }}
            />
          ))}
      </svg>
    </div>
  )
}
