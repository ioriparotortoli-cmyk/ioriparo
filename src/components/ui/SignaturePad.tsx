import { useEffect, useRef, useState } from 'react'
import { Eraser } from 'lucide-react'

/**
 * Riquadro per la firma del cliente all'accettazione.
 * Disegna su canvas (mouse o touch) ed esporta un PNG in data URL.
 */
export function SignaturePad({
  valore,
  onChange,
  altezza = 150,
}: {
  valore?: string
  onChange: (dataUrl: string | undefined) => void
  altezza?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const disegnando = useRef(false)
  const [vuota, setVuota] = useState(!valore)

  // Il canvas viene dimensionato sul contenitore tenendo conto del devicePixelRatio.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const adatta = () => {
      const rapporto = window.devicePixelRatio || 1
      const larghezza = canvas.parentElement?.clientWidth ?? 300
      canvas.width = larghezza * rapporto
      canvas.height = altezza * rapporto
      canvas.style.width = `${larghezza}px`
      canvas.style.height = `${altezza}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(rapporto, rapporto)
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#e8edf5'

      // Ridisegna la firma già acquisita dopo un ridimensionamento.
      if (valore) {
        const immagine = new Image()
        immagine.onload = () => ctx.drawImage(immagine, 0, 0, larghezza, altezza)
        immagine.src = valore
      }
    }

    adatta()
    window.addEventListener('resize', adatta)
    return () => window.removeEventListener('resize', adatta)
  }, [altezza, valore])

  function posizione(evento: React.PointerEvent<HTMLCanvasElement>) {
    const rettangolo = evento.currentTarget.getBoundingClientRect()
    return { x: evento.clientX - rettangolo.left, y: evento.clientY - rettangolo.top }
  }

  function inizia(evento: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    evento.currentTarget.setPointerCapture(evento.pointerId)
    disegnando.current = true
    const { x, y } = posizione(evento)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function muovi(evento: React.PointerEvent<HTMLCanvasElement>) {
    if (!disegnando.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = posizione(evento)
    ctx.lineTo(x, y)
    ctx.stroke()
    if (vuota) setVuota(false)
  }

  function termina() {
    if (!disegnando.current) return
    disegnando.current = false
    const canvas = canvasRef.current
    if (canvas) onChange(canvas.toDataURL('image/png'))
  }

  function pulisci() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setVuota(true)
    onChange(undefined)
  }

  return (
    <div className="relative rounded-lg border border-line-soft bg-surface-2">
      <canvas
        ref={canvasRef}
        onPointerDown={inizia}
        onPointerMove={muovi}
        onPointerUp={termina}
        onPointerLeave={termina}
        className="block w-full touch-none rounded-lg"
        style={{ height: altezza }}
        aria-label="Riquadro per la firma del cliente"
      />

      {vuota && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-ink-faint">
          Firma qui con il dito o con il mouse
        </p>
      )}

      <button
        type="button"
        onClick={pulisci}
        className="absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-md border border-line-soft bg-surface px-2 py-1 text-[11px] text-ink-muted transition-colors hover:text-ink"
      >
        <Eraser size={12} />
        Pulisci
      </button>
    </div>
  )
}
