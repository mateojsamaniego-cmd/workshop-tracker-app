import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STATUSES } from '../lib/orderStatus'
import { canvasInputClass, cardClass } from '../lib/styles'
import OrderCard from '../components/OrderCard'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadOrders() {
      // Solo las columnas que la lista necesita (no se trae el teléfono)
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('id, plate, client_name, vehicle, status, created_at')
        .order('created_at', { ascending: false })

      if (queryError) setError('No se pudieron cargar las órdenes. Intenta de nuevo.')
      else setOrders(data)
      setLoading(false)
    }
    loadOrders()
  }, [])

  const term = search.trim().toLowerCase()
  const visible = orders.filter(
    (o) =>
      (statusFilter === 'all' || o.status === statusFilter) &&
      (!term || o.plate.toLowerCase().includes(term) || o.client_name.toLowerCase().includes(term)),
  )

  // Filtro activo = Ghost CTA (azul claro); inactivo = enlace tenue. El azul sólido queda para la acción principal.
  const chipClass = (active) =>
    `h-10 shrink-0 rounded-lg px-4 text-body-sm font-medium transition-colors duration-200 ${
      active ? 'bg-sky-tint text-notion-blue' : 'text-black/[0.54] hover:text-black'
    }`

  return (
    <main className="mx-auto max-w-md p-6 pb-28">
      <h1 className="text-heading-sm font-bold">Órdenes</h1>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por placa o cliente"
        className={`mt-4 ${canvasInputClass}`}
        aria-label="Buscar órdenes"
      />

      <div className="-mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-1">
        <button type="button" className={chipClass(statusFilter === 'all')} onClick={() => setStatusFilter('all')}>
          Todas
        </button>
        {STATUSES.map((s) => (
          <button key={s.value} type="button" className={chipClass(statusFilter === s.value)} onClick={() => setStatusFilter(s.value)}>
            {s.label}
          </button>
        ))}
      </div>

      <section className="mt-4 space-y-3">
        {loading && <p className="text-center text-body-sm text-graphite">Cargando órdenes…</p>}
        {error && (
          <p role="alert" className={`${cardClass} text-center text-body-sm text-vermillion`}>
            {error}
          </p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className={`${cardClass} text-center text-body-sm text-graphite`}>Aún no hay órdenes. Crea la primera.</p>
        )}
        {!loading && !error && orders.length > 0 && visible.length === 0 && (
          <p className={`${cardClass} text-center text-body-sm text-graphite`}>Ninguna orden coincide con el filtro.</p>
        )}
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>

      {/* Botón fijo abajo: fácil de alcanzar con una mano. Es el único botón relleno de la pantalla. */}
      <div className="fixed inset-x-0 bottom-0 bg-paper-warmth p-4 shadow-[0px_-3px_9px_0px_rgb(0_0_0/0.03)]">
        <Link
          to="/orders/new"
          className="mx-auto flex h-12 max-w-md items-center justify-center rounded-lg bg-notion-blue text-body-sm font-medium text-white transition-opacity duration-200 hover:opacity-90"
        >
          Nueva orden
        </Link>
      </div>
    </main>
  )
}
