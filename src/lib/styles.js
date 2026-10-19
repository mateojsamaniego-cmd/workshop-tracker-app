// Clases compartidas, tomadas de los componentes de DESIGN.md

// Primary CTA: único botón relleno de color en cada pantalla (fondo #0075de, texto blanco 14px/500, radio 8px)
export const primaryButtonClass =
  'h-12 w-full rounded-lg bg-notion-blue text-body-sm font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50'

// Ghost CTA: acción secundaria (fondo sky tint, texto azul)
export const ghostButtonClass =
  'h-12 w-full rounded-lg bg-sky-tint text-body-sm font-medium text-notion-blue transition-opacity duration-200 hover:opacity-80 disabled:opacity-50'

// White Feature Card: fondo blanco, borde de 1px a 8 % de negro, sin sombra, radio 12px, padding 24px
export const cardClass = 'rounded-xl border border-black/[0.08] bg-pure-white p-6'

// Campos dentro de una tarjeta blanca: relleno cálido para distinguirlos sin usar sombras
export const inputClass =
  'mt-1 h-12 w-full rounded-lg border border-black/[0.08] bg-paper-warmth px-3 text-body outline-none transition-colors duration-200 focus:border-notion-blue'

export const textareaClass =
  'mt-1 w-full rounded-lg border border-black/[0.08] bg-paper-warmth px-3 py-2 text-body outline-none transition-colors duration-200 focus:border-notion-blue'

// Campo suelto sobre el lienzo cálido (ej. búsqueda): relleno blanco
export const canvasInputClass =
  'h-12 w-full rounded-lg border border-black/[0.08] bg-pure-white px-3 text-body outline-none transition-colors duration-200 focus:border-notion-blue'
