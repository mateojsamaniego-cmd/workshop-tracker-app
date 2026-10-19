import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STATUSES } from '../lib/orderStatus'
import { formatDateOnly, formatDateTime } from '../lib/format'
import StatusPill from '../components/StatusPill'
import { PageTitle, PropertyRow, SectionLabel } from '../components/PageUI'
import { IconCalendar, IconCar, IconCheck, IconClock, IconStatus } from '../components/icons'

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

  const shell = (children) => (
    <div className="min-h-screen bg-pure-white">
      <main className="mx-auto max-w-md px-6 pt-8 pb-16">
        <p className="flex items-center gap-2 text-body-sm font-medium text-black/45">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-black/80 text-caption font-bold text-black/80">T</span>
          {SHOP_NAME}
        </p>
        {children}
      </main>
    </div>
  )

  if (loading) return shell(<p className="mt-6 text-body-sm text-black/45">Cargando…</p>)
  if (error) return shell(<p role="alert" className="mt-6 text-body-sm text-vermillion">{error}</p>)
  if (!order) {
    return shell(
      <p className="mt-6 text-body text-black/60">No encontramos este enlace. Revisa que esté completo o consulta con el taller.</p>,
    )
  }

  const currentIndex = STATUSES.findIndex((s) => s.value === order.status)

  return shell(
    <>
      <div className="mt-6">
        <PageTitle>{order.vehicle}</PageTitle>
      </div>

      <div className="mt-4">
        <PropertyRow icon={<IconStatus size={18} />} label="Estado">
          <StatusPill status={order.status} />
        </PropertyRow>
        <PropertyRow icon={<IconCar size={18} />} label="Placa">
          {order.plate_masked}
        </PropertyRow>
        <PropertyRow icon={<IconCalendar size={18} />} label="Entrega">
          {order.estimated_delivery ? formatDateOnly(order.estimated_delivery) : <span className="text-black/30">Por definir</span>}
        </PropertyRow>
        <PropertyRow icon={<IconClock size={18} />} label="Actualizado">
          {formatDateTime(order.updated_at)}
        </PropertyRow>
      </div>

      {order.description && (
        <>
          <hr className="my-4 border-black/[0.08]" />
          <p className="text-body leading-relaxed text-black/90">{order.description}</p>
        </>
      )}

      <div className="mt-8">
        <SectionLabel>Avance</SectionLabel>
        <ol>
          {STATUSES.map((s, index) => {
            const done = index <= currentIndex
            return (
              <li key={s.value} className="flex min-h-12 items-center gap-4">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    done ? 'bg-black/85 text-white' : 'border-[1.5px] border-black/20'
                  }`}
                >
                  {done && <IconCheck size={14} strokeWidth={2.5} />}
                </span>
                <span className={`text-body ${done ? 'text-black/90' : 'text-black/35'} ${index === currentIndex ? 'font-semibold' : ''}`}>
                  {s.label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {order.photos.length > 0 && (
        <div className="mt-8">
          <SectionLabel>Fotos</SectionLabel>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {order.photos.map((p) => (
              <a key={p.storage_path} href={photoUrl(p.storage_path)} target="_blank" rel="noreferrer">
                <img src={photoUrl(p.storage_path)} alt="Foto del trabajo" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      {order.notes.length > 0 && (
        <div className="mt-8">
          <SectionLabel>Novedades</SectionLabel>
          <ul>
            {[...order.notes].reverse().map((n) => (
              <li key={n.created_at} className="py-3">
                <p className="text-body text-black/90">{n.body}</p>
                <p className="mt-0.5 text-caption text-black/40">{formatDateTime(n.created_at)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>,
  )
}
