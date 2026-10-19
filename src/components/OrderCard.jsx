import { Link } from 'react-router-dom'
import StatusPill from './StatusPill'
import { IconCar } from './icons'
import { rowClass } from '../lib/styles'

// Fila de la lista de órdenes (sin tarjeta, como "Recientes" en Notion)
export default function OrderCard({ order }) {
  return (
    <Link to={`/orders/${order.id}`} className={rowClass}>
      <span className="text-black/45">
        <IconCar />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-medium text-black/90">{order.plate}</span>
        <span className="block truncate text-body-sm text-black/45">
          {order.vehicle} · {order.client_name}
        </span>
      </span>
      <StatusPill status={order.status} />
    </Link>
  )
}
