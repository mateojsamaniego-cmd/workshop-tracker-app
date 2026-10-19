// Estados de una orden. El orden del arreglo es el orden del proceso.
// Los valores deben coincidir con el check de db/migrations/001_orders.sql.
export const STATUSES = [
  { value: 'received', label: 'Recibido', className: 'bg-sky-tint text-black' },
  { value: 'in_progress', label: 'En proceso', className: 'bg-marigold text-black' },
  { value: 'waiting_parts', label: 'Esperando repuestos', className: 'bg-coral text-white' },
  { value: 'ready', label: 'Listo para retirar', className: 'bg-notion-blue text-white' },
  { value: 'delivered', label: 'Entregado', className: 'bg-black/10 text-black' },
]

export function getStatus(value) {
  return STATUSES.find((s) => s.value === value) ?? { value, label: value, className: 'bg-black/10 text-black' }
}
