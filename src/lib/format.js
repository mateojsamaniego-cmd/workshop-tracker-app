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

export function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
}

// Encabezado de día para la línea de tiempo, ej. "lunes, 19 de octubre"
export function formatDayHeader(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Fecha de hoy en formato YYYY-MM-DD según la hora local (no UTC), para inputs tipo date
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
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
