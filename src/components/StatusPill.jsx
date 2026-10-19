import { getStatus } from '../lib/orderStatus'

export default function StatusPill({ status }) {
  const { label, className } = getStatus(status)
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${className}`}>{label}</span>
  )
}
