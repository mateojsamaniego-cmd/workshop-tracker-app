// Ventana flotante que sube desde abajo (hoja), como los paneles de la app de Notion
export default function Sheet({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-pure-white px-6 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-black/15" />
        {title && <h2 className="mb-4 text-subheading font-semibold text-black/90">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
