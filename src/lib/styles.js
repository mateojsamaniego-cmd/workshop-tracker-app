// Clases compartidas, inspiradas en la app móvil de Notion + tokens de DESIGN.md

const floatShadow = 'shadow-[0_2px_14px_rgba(0,0,0,0.09)]'

// Botón azul sólido: única acción principal por pantalla
export const primaryButtonClass =
  'flex h-14 w-full items-center justify-center rounded-xl bg-notion-blue text-body font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50'

// Botón contorneado blanco (como "Google / Apple / Correo" en el login de Notion)
export const outlineButtonClass =
  'flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-black/[0.1] bg-pure-white text-body font-medium text-black/90 transition-colors duration-200 hover:bg-black/[0.03] disabled:opacity-50'

// Campo contorneado (login)
export const fieldClass =
  'h-14 w-full rounded-xl border border-black/[0.1] bg-pure-white px-4 text-body outline-none transition-colors duration-200 placeholder:text-black/35 focus:border-notion-blue'

// Campo sin borde dentro de una "página" (como las propiedades de Notion)
export const bareInputClass = 'w-full bg-transparent py-2 text-body outline-none placeholder:text-black/30'

// Barra superior: círculos grises y píldora
export const topCircleClass =
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-black/60 transition-colors duration-200 hover:bg-black/[0.08]'
export const topPillClass =
  'flex h-12 items-center gap-2 rounded-full bg-black/[0.06] px-5 text-body font-medium text-black/80'

// Barra flotante inferior: círculos blancos con sombra suave y píldora central
export const floatCircleClass = `flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pure-white text-black/80 ${floatShadow} transition-colors duration-200 hover:bg-paper-warmth`
export const floatPillClass = `flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full bg-pure-white px-5 ${floatShadow}`

// Fila de lista (sin tarjeta, como "Recientes" en Notion)
export const rowClass =
  'flex min-h-14 w-full items-center gap-4 rounded-lg px-2 py-2 text-left transition-colors duration-200 hover:bg-black/[0.04]'
