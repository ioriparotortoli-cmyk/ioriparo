import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { FormRiparazione, datiDaRiparazione, type DatiForm } from './FormRiparazione'
import { riparazioneDaForm } from './NuovaRiparazione'
import { useIntestazione } from '@/components/layout/intestazione'
import { useGestionale } from '@/data/store'
import { oggiISO } from '@/lib/format'

export function ModificaRiparazione() {
  const { id = '' } = useParams()
  const { db, aggiornaRiparazione, aggiornaCliente, clientePerId } = useGestionale()
  const navigate = useNavigate()

  const riparazione = db.riparazioni.find((r) => r.id === id)

  useIntestazione({
    titolo: riparazione ? `Modifica ${riparazione.codice}` : 'Riparazione non trovata',
    briciole: [
      { label: 'Home', to: '/' },
      { label: 'Dispositivi', to: '/gestionale/riparazioni' },
      { label: riparazione?.codice ?? '—', to: riparazione ? `/gestionale/riparazioni/${id}` : '/gestionale/riparazioni' },
      { label: 'Modifica' },
    ],
  })

  if (!riparazione) return <Navigate to="/gestionale/riparazioni" replace />

  const cliente = clientePerId(riparazione.clienteId)

  function salva(dati: DatiForm, stampa: boolean) {
    if (!riparazione) return

    // I dati anagrafici modificati nel modulo aggiornano anche la scheda cliente.
    if (dati.clienteId) {
      aggiornaCliente(dati.clienteId, {
        nome: dati.nomeCliente.trim(),
        telefono: dati.telefono.trim(),
        email: dati.email.trim() || undefined,
        indirizzo: dati.indirizzo.trim() || undefined,
        citta: dati.citta.trim() || undefined,
        cap: dati.cap.trim() || undefined,
      })
    }

    const modifiche = riparazioneDaForm(dati, dati.clienteId ?? riparazione.clienteId)

    aggiornaRiparazione(riparazione.id, {
      ...modifiche,
      interventi: dati.interventi.filter((r) => r.descrizione.trim() || r.prezzoUnitario > 0),
      dataConsegna:
        dati.stato === 'consegnato' ? (riparazione.dataConsegna ?? oggiISO()) : undefined,
    })

    navigate(`/gestionale/riparazioni/${riparazione.id}${stampa ? '?stampa=1' : ''}`)
  }

  return (
    <FormRiparazione
      iniziali={datiDaRiparazione(riparazione, cliente)}
      etichettaSalva="Salva e Stampa"
      onSalva={salva}
    />
  )
}
