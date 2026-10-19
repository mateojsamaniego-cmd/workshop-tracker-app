import { Link } from 'react-router-dom'
import { IconChevronDown, IconChevronLeft } from './icons'

// Barra superior de una "página": atrás · píldora central · acciones (como una página de Notion)
export function PageTopBar({ backTo, center, right }) {
  return (
    <header className="sticky top-0 z-20 bg-pure-white/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-md items-center justify-between px-3">
        {backTo ? (
          <Link to={backTo} aria-label="Volver" className="flex h-12 w-12 items-center justify-center rounded-full text-black/70 hover:bg-black/[0.04]">
            <IconChevronLeft size={26} />
          </Link>
        ) : (
          <span className="w-12" />
        )}
        <div className="absolute left-1/2 -translate-x-1/2">{center}</div>
        <div className="flex items-center gap-1">{right}</div>
      </div>
    </header>
  )
}

// Título grande de página
export function PageTitle({ children }) {
  return <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em] text-black/90">{children}</h1>
}

// Propiedad de una "página" (ícono + etiqueta gris + valor), como en las bases de datos de Notion
export function PropertyRow({ icon, label, children }) {
  return (
    <div className="flex min-h-11 items-center gap-3 text-body">
      <span className="flex w-32 shrink-0 items-center gap-2 text-black/45">
        {icon}
        <span className="text-body-sm">{label}</span>
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

// Encabezado de sección gris con flecha ("Recientes ⌄")
export function SectionLabel({ children, onClick }) {
  const cls = 'flex items-center gap-1 py-2 text-body-sm font-medium text-black/45'
  if (!onClick) return <p className={cls}>{children}</p>
  return (
    <button type="button" onClick={onClick} className={`${cls} hover:text-black/70`}>
      {children}
      <IconChevronDown size={16} />
    </button>
  )
}
