import { getStatus } from '../lib/orderStatus'

// Etiqueta de estado al estilo de las propiedades "select" de Notion
export default function StatusPill({ status }) {
  const { label, tag } = getStatus(status)
  return <span className={`inline-block whitespace-nowrap rounded-md px-2 py-0.5 text-body-sm font-medium ${tag}`}>{label}</span>
}
