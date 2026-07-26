'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Direzione = 'su' | 'giu' | 'sinistra' | 'destra' | 'zoom'

const spostamenti: Record<Direzione, { x?: number; y?: number; scale?: number }> = {
  su: { y: 28 },
  giu: { y: -28 },
  sinistra: { x: 32 },
  destra: { x: -32 },
  zoom: { scale: 0.94 },
}

/**
 * Animazione di comparsa allo scroll, disattivata automaticamente quando il
 * sistema chiede movimento ridotto.
 */
export function Rivela({
  children,
  direzione = 'su',
  ritardo = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  direzione?: Direzione
  ritardo?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'span'
}) {
  const movimentoRidotto = useReducedMotion()
  const Componente = motion[as]

  if (movimentoRidotto) {
    const Statico = as
    return <Statico className={className}>{children}</Statico>
  }

  return (
    <Componente
      className={className}
      initial={{ opacity: 0, ...spostamenti[direzione] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: ritardo, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Componente>
  )
}
