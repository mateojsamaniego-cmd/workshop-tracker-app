// Estados de una orden. El orden del arreglo es el orden del proceso.
// Los valores deben coincidir con el check de db/migrations/001_orders.sql.
//   tag = etiqueta suave (como las "select" de Notion)
//   dot = punto de color para menús y avance
export const STATUSES = [
  { value: 'received', label: 'Recibido', tag: 'bg-sky-tint text-notion-blue', dot: 'bg-sky-wash' },
  { value: 'in_progress', label: 'En proceso', tag: 'bg-marigold/25 text-black/80', dot: 'bg-marigold' },
  { value: 'waiting_parts', label: 'Esperando repuestos', tag: 'bg-coral/15 text-vermillion', dot: 'bg-coral' },
  { value: 'ready', label: 'Listo para retirar', tag: 'bg-sky-wash/30 text-black/80', dot: 'bg-notion-blue' },
  { value: 'delivered', label: 'Entregado', tag: 'bg-black/[0.06] text-black/60', dot: 'bg-black/30' },
]

export function getStatus(value) {
  return STATUSES.find((s) => s.value === value) ?? { value, label: value, tag: 'bg-black/[0.06] text-black/60', dot: 'bg-black/30' }
}
