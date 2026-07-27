import { useEffect, useRef } from 'react'
import { animazioniRidotte } from '../lib/hook'

/**
 * Sfondo animato della sezione principale: nodi che derivano lentamente e si
 * collegano quando sono vicini, come una rete che si forma. Disegnato su canvas
 * (niente DOM), messo in pausa quando esce dallo schermo e disattivato se
 * l'utente ha chiesto animazioni ridotte.
 */
export function CampoSegnale() {
  const rif = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const tela = rif.current
    if (!tela) return
    const ctx = tela.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let larghezza = 0
    let altezza = 0
    let nodi: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    let animazione = 0

    const dimensiona = () => {
      const r = tela.getBoundingClientRect()
      larghezza = tela.width = Math.max(1, r.width * dpr)
      altezza = tela.height = Math.max(1, r.height * dpr)
      const quanti = Math.min(58, Math.round(r.width / 26))
      nodi = Array.from({ length: quanti }, () => ({
        x: Math.random() * larghezza,
        y: Math.random() * altezza,
        vx: (Math.random() - 0.5) * 0.22 * dpr,
        vy: (Math.random() - 0.5) * 0.22 * dpr,
        r: (Math.random() * 1.6 + 0.6) * dpr,
      }))
    }

    const disegna = () => {
      ctx.clearRect(0, 0, larghezza, altezza)
      for (const n of nodi) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > larghezza) n.vx *= -1
        if (n.y < 0 || n.y > altezza) n.vy *= -1
      }
      const limite = 150 * dpr
      ctx.lineWidth = dpr * 0.7
      for (let i = 0; i < nodi.length; i++) {
        for (let j = i + 1; j < nodi.length; j++) {
          const a = nodi[i]
          const b = nodi[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d >= limite) continue
          ctx.strokeStyle = `rgba(76,141,255,${(1 - d / limite) * 0.22})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      ctx.fillStyle = 'rgba(127,178,255,.55)'
      for (const n of nodi) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      animazione = requestAnimationFrame(disegna)
    }

    dimensiona()
    window.addEventListener('resize', dimensiona)

    if (animazioniRidotte()) {
      return () => window.removeEventListener('resize', dimensiona)
    }

    const osservatore = new IntersectionObserver(([voce]) => {
      if (voce.isIntersecting) {
        if (!animazione) animazione = requestAnimationFrame(disegna)
      } else {
        cancelAnimationFrame(animazione)
        animazione = 0
      }
    })
    osservatore.observe(tela)

    return () => {
      cancelAnimationFrame(animazione)
      osservatore.disconnect()
      window.removeEventListener('resize', dimensiona)
    }
  }, [])

  return <canvas ref={rif} className="hero__canvas" aria-hidden="true" />
}
