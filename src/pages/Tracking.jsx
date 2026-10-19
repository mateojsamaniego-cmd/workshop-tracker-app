import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STATUSES } from '../lib/orderStatus'
import { formatDateOnly, formatDateTime } from '../lib/format'
import { cardClass } from '../lib/styles'
import StatusPill from '../components/StatusPill'

// Nombre del taller para el encabezado público (pendiente de definir con el dueño)
const SHOP_NAME = 'Taller'

function photoUrl(path) {
  return supabase.storage.from('fotos').getPublicUrl(path).data.publicUrl
}

// Página pública: solo usa la función get_order_by_token, nunca lee tablas directamente
export default function Tracking() {
  const { token } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error: rpcError } = await supabase.rpc('get_order_by_token', { p_token: token })
      if (rpcError) setError('No se pudo consultar el estado. Intenta de nuevo en unos minutos.')
      else setOrder(data)
      setLoading(false)
    }
    load()
  }, [token])

  if (loading) return <p className="p-6 text-center text-graphite">Cargando…</p>

  if (error) {
    return (
      <main className="mx-auto max-w-md p-6">
        <p role="alert" className={`${cardClass} text-center text-vermillion`}>
          {error}
        </p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-bold tracking-tight">{SHOP_NAME}</h1>
        <p className={`mt-4 ${cardClass} text-center text-graphite`}>
          No encontramos este enlace. Revisa que esté completo o consulta con el taller.
        </p>
      </main>
    )
  }

  const currentIndex = STATUSES.findIndex((s) => s.value === order.status)

  return (
    <main className="mx-auto max-w-md space-y-4 p-6 pb-12">
      <header>
        <p className="text-sm font-medium text-graphite">{SHOP_NAME}</p>
        <h1 className="text-2xl font-bold tracking-tight">Seguimiento de tu vehículo</h1>
      </header>

      <section className={cardClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{order.vehicle}</p>
            <p className="text-sm text-graphite">Placa {order.plate_masked}</p>
          </div>
          <StatusPill status={order.status} />
        </div>
        {order.description && <p className="mt-3 text-sm">{order.description}</p>}
        {order.estimated_delivery && (
          <p className="mt-3 text-sm text-graphite">Entrega estimada: {formatDateOnly(order.estimated_delivery)}</p>
        )}
        <p className="mt-3 text-xs text-graphite">Última actualización: {formatDateTime(order.updated_at)}</p>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold">Avance</h2>
        <ol className="mt-3 space-y-3">
          {STATUSES.map((s, index) => {
            const done = index <= currentIndex
            return (
              <li key={s.value} className="flex items-center gap-3 text-sm">
                <span className={`h-3 w-3 shrink-0 rounded-full ${done ? 'bg-notion-blue' : 'bg-black/15'}`} />
                <span className={done ? 'font-medium' : 'text-graphite'}>{s.label}</span>
              </li>
            )
          })}
        </ol>
      </section>

      {order.photos.length > 0 && (
        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Fotos</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {order.photos.map((p) => (
              <a key={p.storage_path} href={photoUrl(p.storage_path)} target="_blank" rel="noreferrer">
                <img src={photoUrl(p.storage_path)} alt="Foto del trabajo" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
              </a>
            ))}
          </div>
        </section>
      )}

      {order.notes.length > 0 && (
        <section className={cardClass}>
          <h2 className="text-lg font-semibold">Novedades</h2>
          <ul className="mt-3 space-y-3">
            {[...order.notes].reverse().map((n) => (
              <li key={n.created_at} className="rounded-lg bg-paper-warmth p-3 text-sm">
                <p>{n.body}</p>
                <p className="mt-1 text-xs text-graphite">{formatDateTime(n.created_at)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
