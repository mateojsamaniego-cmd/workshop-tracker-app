// Ventana flotante que sube desde abajo (hoja), como los paneles de la app de Notion.
// Cabecera fija: acción izquierda · título · acción derecha. Así los botones no se mueven
// cuando el teclado del celular se abre o se cierra.
export default function Sheet({ open, onClose, title, left, right, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[92vh] w-full max-w-md flex-col rounded-t-3xl bg-pure-white"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-black/15" />
        <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center px-3 py-2">
          <div className="justify-self-start">{left}</div>
          <h2 className="text-body font-semibold text-black/90">{title}</h2>
          <div className="justify-self-end">{right}</div>
        </header>
        <div className="overflow-y-auto px-6 pb-[max(24px,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>
  )
}

// Botón de texto para la cabecera de la hoja. preventDefault en pointerdown evita que el
// primer toque solo cierre el teclado (causa de que "a veces no responda").
export function SheetAction({ children, onClick, primary = false, disabled = false, type = 'button', form }) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      onPointerDown={(e) => e.preventDefault()}
      disabled={disabled}
      className={`h-11 min-w-11 rounded-full px-4 text-body font-medium transition-opacity duration-200 disabled:opacity-40 ${
        primary ? 'text-notion-blue' : 'text-black/60'
      }`}
    >
      {children}
    </button>
  )
}
