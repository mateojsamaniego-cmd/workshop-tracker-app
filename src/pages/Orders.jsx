import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { STATUSES, getStatus } from '../lib/orderStatus'
import { floatCircleClass, floatPillClass, topPillClass } from '../lib/styles'
import OrderCard from '../components/OrderCard'
import Popover, { MenuItem } from '../components/Popover'
import { SectionLabel } from '../components/PageUI'
import { IconCompose, IconFilter, IconHome, IconLogout, IconSearch } from '../components/icons'

export default function Orders() {
  const { session } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [menu, setMenu] = useState(null) // 'account' | 'filter' | null

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

  const email = session?.user?.email ?? ''
  const filterLabel = statusFilter === 'all' ? 'Todas las órdenes' : getStatus(statusFilter).label

  function chooseFilter(value) {
    setStatusFilter(value)
    setMenu(null)
  }

  const filterMenu = (
    <>
      <MenuItem icon={<IconFilter size={20} />} onClick={() => chooseFilter('all')} active={statusFilter === 'all'}>
        Todas
      </MenuItem>
      {STATUSES.map((s) => (
        <MenuItem
          key={s.value}
          icon={<span className={`block h-2.5 w-2.5 rounded-full ${s.dot}`} />}
          onClick={() => chooseFilter(s.value)}
          active={statusFilter === s.value}
        >
          {s.label}
        </MenuItem>
      ))}
    </>
  )

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-32">
      {/* Barra superior: avatar + píldora activa, como "N · Inicio" en Notion */}
      <header className="relative flex items-center gap-2 pt-4 pb-2">
        <button
          type="button"
          onClick={() => setMenu('account')}
          aria-label="Cuenta"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-pure-white bg-black/[0.05] text-subheading font-medium text-black/50 uppercase shadow-[0_1px_6px_rgba(0,0,0,0.08)]"
        >
          {email.charAt(0) || '?'}
        </button>
        <span className={topPillClass}>
          <IconHome size={20} />
          Órdenes
        </span>

        <Popover open={menu === 'account'} onClose={() => setMenu(null)} className="top-16 left-0">
          <p className="truncate px-4 py-2 text-body-sm text-black/45">{email}</p>
          <MenuItem icon={<IconLogout size={20} />} onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </MenuItem>
        </Popover>
      </header>

      <div className="relative mt-2">
        <SectionLabel onClick={() => setMenu('filter-top')}>{filterLabel}</SectionLabel>
        <Popover open={menu === 'filter-top'} onClose={() => setMenu(null)} className="top-10 left-0">
          {filterMenu}
        </Popover>
      </div>

      <section className="mt-1">
        {loading && <p className="px-2 py-3 text-body-sm text-black/45">Cargando órdenes…</p>}
        {error && (
          <p role="alert" className="px-2 py-3 text-body-sm text-vermillion">
            {error}
          </p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className="px-2 py-3 text-body-sm text-black/45">Aún no hay órdenes. Toca el lápiz para crear la primera.</p>
        )}
        {!loading && !error && orders.length > 0 && visible.length === 0 && (
          <p className="px-2 py-3 text-body-sm text-black/45">Ninguna orden coincide con la búsqueda.</p>
        )}
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>

      {/* Barra flotante: filtro · búsqueda · nueva orden (como búsqueda · IA · redactar en Notion) */}
      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="relative mx-auto flex max-w-md items-center gap-3">
          <button type="button" onClick={() => setMenu('filter')} aria-label="Filtrar por estado" className={floatCircleClass}>
            <IconFilter />
          </button>
          <label className={floatPillClass}>
            <span className="text-black/45">
              <IconSearch size={20} />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar placa o cliente"
              aria-label="Buscar órdenes"
              className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-black/40"
            />
          </label>
          {/* Única acción principal de la pantalla: en azul */}
          <Link
            to="/orders/new"
            aria-label="Nueva orden"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-notion-blue text-white shadow-[0_2px_14px_rgba(0,117,222,0.35)] transition-opacity duration-200 hover:opacity-90"
          >
            <IconCompose />
          </Link>

          <Popover open={menu === 'filter'} onClose={() => setMenu(null)} className="bottom-16 left-0">
            {filterMenu}
          </Popover>
        </div>
      </div>
    </main>
  )
}
