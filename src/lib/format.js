// Fecha corta a partir de un timestamp ISO (ej. created_at)
export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('es-EC', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Las columnas tipo date llegan como "2026-10-25"; se fuerza hora local para que no se corra un día
export function formatDateOnly(value) {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
