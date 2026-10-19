// Estados de una orden. El orden del arreglo es el orden del proceso.
// Los valores deben coincidir con el check de db/migrations/001_orders.sql.
//   pill   = etiqueta pequeña (Pill Tag de DESIGN.md: texto negro o blanco)
//   accent = panel de color (Accent Feature Card) que se usa en la página pública
export const STATUSES = [
  { value: 'received', label: 'Recibido', pill: 'bg-sky-tint text-black', accent: 'bg-sky-tint text-black' },
  { value: 'in_progress', label: 'En proceso', pill: 'bg-marigold text-black', accent: 'bg-marigold text-black' },
  { value: 'waiting_parts', label: 'Esperando repuestos', pill: 'bg-coral text-white', accent: 'bg-coral text-white' },
  { value: 'ready', label: 'Listo para retirar', pill: 'bg-sky-wash text-black', accent: 'bg-sky-wash text-black' },
  { value: 'delivered', label: 'Entregado', pill: 'bg-black/10 text-black', accent: 'bg-midnight-ink text-white' },
]

export function getStatus(value) {
  return (
    STATUSES.find((s) => s.value === value) ?? {
      value,
      label: value,
      pill: 'bg-black/10 text-black',
      accent: 'bg-black/10 text-black',
    }
  )
}
