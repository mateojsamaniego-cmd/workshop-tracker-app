import { getStatus } from '../lib/orderStatus'

// Pill Tag de DESIGN.md: relleno de color, radio 9999px, padding 4px 12px
export default function StatusPill({ status }) {
  const { label, pill } = getStatus(status)
  return <span className={`inline-block rounded-full px-3 py-1 text-caption font-medium ${pill}`}>{label}</span>
}
