import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STATUSES, getStatus } from '../lib/orderStatus'
import { formatDateOnly, formatDateTime } from '../lib/format'
import { cardClass } from '../lib/styles'

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

  if (loading) return <p className="p-6 text-center text-body-sm text-graphite">Cargando…</p>

  if (error) {
    return (
      <main className="mx-auto max-w-md p-6">
        <p role="alert" className={`${cardClass} text-center text-body-sm text-vermillion`}>
          {error}
        </p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-heading-sm font-bold">{SHOP_NAME}</h1>
        <p className={`mt-4 ${cardClass} text-center text-body-sm text-graphite`}>
          No encontramos este enlace. Revisa que esté completo o consulta con el taller.
        </p>
      </main>
    )
  }

  const status = getStatus(order.status)
  const currentIndex = STATUSES.findIndex((s) => s.value === order.status)

  return (
    <main className="mx-auto max-w-md space-y-4 p-6 pb-12">
      <header>
        <p className="text-body-sm font-medium text-graphite">{SHOP_NAME}</p>
        <h1 className="mt-1 text-heading-sm font-bold">Seguimiento de tu vehículo</h1>
      </header>

      {/* Accent Feature Card: el color del panel cambia según el estado */}
      <section className={`rounded-xl p-6 ${status.accent}`}>
        <p className="text-body-sm font-medium opacity-60">Estado actual</p>
        <p className="mt-1 text-heading-sm font-bold">{status.label}</p>
        <p className="mt-4 text-body font-medium">{order.vehicle}</p>
        <p className="text-body-sm opacity-60">Placa {order.plate_masked}</p>
        {order.estimated_delivery && (
          <p className="mt-3 text-body-sm">Entrega estimada: {formatDateOnly(order.estimated_delivery)}</p>
        )}
        <p className="mt-3 text-caption opacity-60">Última actualización: {formatDateTime(order.updated_at)}</p>
      </section>

      {order.description && (
        <section className={cardClass}>
          <h2 className="text-subheading font-semibold">Trabajo a realizar</h2>
          <p className="mt-2 text-body-sm text-graphite">{order.description}</p>
        </section>
      )}

      <section className={cardClass}>
        <h2 className="text-subheading font-semibold">Avance</h2>
        <ol className="mt-3 space-y-3">
          {STATUSES.map((s, index) => {
            const done = index <= currentIndex
            return (
              <li key={s.value} className="flex items-center gap-3 text-body-sm">
                <span className={`h-3 w-3 shrink-0 rounded-full ${done ? 'bg-ink-black' : 'bg-black/15'}`} />
                <span className={done ? 'font-medium' : 'text-black/[0.4]'}>{s.label}</span>
              </li>
            )
          })}
        </ol>
      </section>

      {order.photos.length > 0 && (
        <section className={cardClass}>
          <h2 className="text-subheading font-semibold">Fotos</h2>
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
          <h2 className="text-subheading font-semibold">Novedades</h2>
          <ul className="mt-3 space-y-3">
            {[...order.notes].reverse().map((n) => (
              <li key={n.created_at} className="rounded-lg border border-black/[0.08] bg-paper-warmth px-3 py-2 text-body-sm">
                <p>{n.body}</p>
                <p className="mt-1 text-caption text-graphite">{formatDateTime(n.created_at)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
