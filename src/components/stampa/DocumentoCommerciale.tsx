import { Campo, PiedeDocumento, Sezione, TestataDocumento } from './parti'
import { imponibile, scorporoIva, totaleRighe } from '@/lib/calcoli'
import { formatData, formatEuro } from '@/lib/format'
import type { Azienda, Cliente, Fattura, Preventivo } from '@/types'

const METODI: Record<string, string> = {
  contanti: 'Contanti',
  carta: 'Carta',
  bonifico: 'Bonifico',
  satispay: 'Satispay',
  altro: 'Altro',
}

/** Preventivo e fattura condividono struttura: cambiano titolo, meta e note. */
export function DocumentoCommerciale({
  azienda,
  cliente,
  documento,
  tipo,
  statoLabel,
}: {
  azienda: Azienda
  cliente?: Cliente
  documento: Preventivo | Fattura
  tipo: 'preventivo' | 'fattura'
  statoLabel: string
}) {
  const totale = totaleRighe(documento.righe)
  const fattura = tipo === 'fattura' ? (documento as Fattura) : undefined
  const preventivo = tipo === 'preventivo' ? (documento as Preventivo) : undefined

  return (
    <article className="doc">
      <TestataDocumento azienda={azienda} />

      <h1 className="doc-titolo">
        {tipo === 'fattura' ? 'Fattura' : 'Preventivo'} n. {documento.numero}
      </h1>
      <p className="doc-sottotitolo">
        {tipo === 'fattura'
          ? 'Documento fiscale — copia di cortesia'
          : 'Proposta di intervento non vincolante'}
      </p>

      <dl className="doc-meta">
        <div>
          <dt>Data</dt>
          <dd>{formatData(documento.data)}</dd>
        </div>
        {preventivo?.validoFino && (
          <div>
            <dt>Valido fino al</dt>
            <dd>{formatData(preventivo.validoFino)}</dd>
          </div>
        )}
        {fattura?.scadenza && (
          <div>
            <dt>Scadenza</dt>
            <dd>{formatData(fattura.scadenza)}</dd>
          </div>
        )}
        <div>
          <dt>Stato</dt>
          <dd>{statoLabel}</dd>
        </div>
        {fattura?.metodoPagamento && (
          <div>
            <dt>Pagamento</dt>
            <dd>{METODI[fattura.metodoPagamento] ?? fattura.metodoPagamento}</dd>
          </div>
        )}
      </dl>

      <div className="doc-griglia">
        <Sezione titolo="Intestatario">
          <div className="doc-campi">
            <Campo etichetta="Nome" valore={cliente?.nome} />
            <Campo etichetta="Telefono" valore={cliente?.telefono} />
            <Campo etichetta="Email" valore={cliente?.email} />
            <Campo
              etichetta="Indirizzo"
              valore={
                cliente?.indirizzo
                  ? `${cliente.indirizzo}, ${cliente.cap ?? ''} ${cliente.citta ?? ''}`.trim()
                  : cliente?.citta
              }
            />
            <Campo
              etichetta={cliente?.tipo === 'azienda' ? 'P. IVA' : 'Codice fiscale'}
              valore={cliente?.tipo === 'azienda' ? cliente.partitaIva : cliente?.codiceFiscale}
            />
          </div>
        </Sezione>

        <Sezione titolo="Riepilogo">
          <div className="doc-campi">
            <Campo etichetta="Righe" valore={String(documento.righe.length)} />
            <Campo etichetta="Imponibile" valore={formatEuro(imponibile(totale, documento.iva))} />
            <Campo
              etichetta={`IVA ${documento.iva}%`}
              valore={formatEuro(scorporoIva(totale, documento.iva))}
            />
            <Campo etichetta="Totale documento" valore={formatEuro(totale)} />
            {fattura?.dataPagamento && (
              <Campo etichetta="Incassata il" valore={formatData(fattura.dataPagamento)} />
            )}
          </div>
        </Sezione>
      </div>

      <table className="doc-tabella">
        <thead>
          <tr>
            <th>Descrizione</th>
            <th className="cen">Q.tà</th>
            <th className="num">Prezzo</th>
            <th className="num">Totale</th>
          </tr>
        </thead>
        <tbody>
          {documento.righe.map((riga) => (
            <tr key={riga.id}>
              <td>{riga.descrizione}</td>
              <td className="cen">{riga.quantita}</td>
              <td className="num">{formatEuro(riga.prezzoUnitario)}</td>
              <td className="num">{formatEuro(riga.quantita * riga.prezzoUnitario)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="doc-totali">
        <div>
          <span>Imponibile</span>
          <span className="num">{formatEuro(imponibile(totale, documento.iva))}</span>
        </div>
        <div>
          <span>IVA {documento.iva}%</span>
          <span className="num">{formatEuro(scorporoIva(totale, documento.iva))}</span>
        </div>
        <div className="totale">
          <span>Totale</span>
          <span className="num">{formatEuro(totale)}</span>
        </div>
      </div>

      {preventivo?.note && <div className="doc-testo">{preventivo.note}</div>}

      <div className="doc-condizioni">
        {tipo === 'preventivo' ? (
          <>
            <h2>Note</h2>
            <p style={{ margin: 0 }}>
              I prezzi indicati sono comprensivi di IVA e si intendono validi fino alla data
              riportata. La lavorazione inizia dopo l’accettazione del preventivo da parte del
              cliente. Eventuali guasti ulteriori riscontrati durante l’intervento saranno
              comunicati prima di procedere.
            </p>
          </>
        ) : (
          <>
            <h2>Note</h2>
            <p style={{ margin: 0 }}>
              Importi comprensivi di IVA {documento.iva}%. Documento privo di valore fiscale se non
              accompagnato dalla fattura elettronica trasmessa al Sistema di Interscambio.
            </p>
          </>
        )}
      </div>

      <PiedeDocumento azienda={azienda} />
    </article>
  )
}
