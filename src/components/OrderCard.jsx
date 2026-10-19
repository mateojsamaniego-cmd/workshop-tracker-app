import { Link } from 'react-router-dom'
import StatusPill from './StatusPill'
import { formatDate } from '../lib/format'

export default function OrderCard({ order }) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block rounded-xl border border-black/[0.08] bg-pure-white p-4 transition-colors duration-200 hover:border-black/20"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-bold tracking-tight">{order.plate}</p>
        <StatusPill status={order.status} />
      </div>
      <p className="mt-1 text-sm">{order.vehicle}</p>
      <p className="mt-1 text-sm text-graphite">
        {order.client_name} · {formatDate(order.created_at)}
      </p>
    </Link>
  )
}
