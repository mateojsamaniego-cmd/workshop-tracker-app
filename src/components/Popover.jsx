// Menú flotante redondeado (como el menú "Anotador / Conversa / Página" de Notion).
// Se posiciona con className respecto al contenedor "relative" más cercano.
export default function Popover({ open, onClose, className = '', children }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden="true" />
      <div role="menu" className={`absolute z-40 min-w-60 rounded-3xl bg-pure-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${className}`}>
        {children}
      </div>
    </>
  )
}

export function MenuItem({ icon, children, onClick, href, active = false }) {
  const cls = 'flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-body text-black/90 transition-colors duration-200 hover:bg-black/[0.04]'
  const content = (
    <>
      <span className="flex w-6 justify-center text-black/70">{icon}</span>
      <span className="flex-1">{children}</span>
      {active && <span className="text-notion-blue">✓</span>}
    </>
  )
  if (href) {
    return (
      <a role="menuitem" href={href} target="_blank" rel="noreferrer" onClick={onClick} className={cls}>
        {content}
      </a>
    )
  }
  return (
    <button role="menuitem" type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  )
}
