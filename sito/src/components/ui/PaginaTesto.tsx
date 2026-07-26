export function PaginaTesto({
  titolo,
  aggiornamento,
  children,
}: {
  titolo: string
  aggiornamento: string
  children: React.ReactNode
}) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40">
      <div className="pointer-events-none absolute inset-0 griglia-tecnica" aria-hidden="true" />
      <div className="contenitore relative max-w-3xl">
        <h1 className="bilancia-testo text-3xl font-extrabold tracking-tight sm:text-4xl">{titolo}</h1>
        <p className="mt-3 text-sm testo-tenue">Ultimo aggiornamento: {aggiornamento}</p>

        <div
          className="mt-10 space-y-6 text-[0.95rem] leading-relaxed [&_a]:font-semibold [&_a]:text-elettrico-400 [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_li]:mt-1.5 [&_p]:testo-tenue [&_td]:py-2 [&_th]:py-2 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:testo-tenue"
        >
          {children}
        </div>
      </div>
    </section>
  )
}
