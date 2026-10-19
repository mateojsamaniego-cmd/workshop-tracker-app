import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STATUSES } from '../lib/orderStatus'
import { cardClass, inputClass } from '../lib/styles'
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

  const chipClass = (active) =>
    `h-9 shrink-0 rounded-lg px-3 text-sm font-medium transition-colors duration-200 ${
      active ? 'bg-notion-blue text-white' : 'bg-pure-white text-black/70 border border-black/[0.08]'
    }`

  return (
    <main className="mx-auto max-w-md p-6 pb-28">
      <h1 className="text-2xl font-bold tracking-tight">Órdenes</h1>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por placa o cliente"
        className={inputClass}
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
        {loading && <p className="text-center text-graphite">Cargando órdenes…</p>}
        {error && (
          <p role="alert" className={`${cardClass} text-center text-vermillion`}>
            {error}
          </p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className={`${cardClass} text-center text-graphite`}>Aún no hay órdenes. Crea la primera.</p>
        )}
        {!loading && !error && orders.length > 0 && visible.length === 0 && (
          <p className={`${cardClass} text-center text-graphite`}>Ninguna orden coincide con el filtro.</p>
        )}
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>

      {/* Botón fijo abajo: fácil de alcanzar con una mano */}
      <div className="fixed inset-x-0 bottom-0 border-t border-black/[0.08] bg-paper-warmth p-4">
        <Link
          to="/orders/new"
          className="mx-auto flex h-12 max-w-md items-center justify-center rounded-lg bg-notion-blue text-base font-medium text-white transition-colors duration-200 hover:bg-signal-blue"
        >
          Nueva orden
        </Link>
      </div>
    </main>
  )
}
