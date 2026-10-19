import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STATUSES, getStatus } from '../lib/orderStatus'
import { formatDate, formatDateOnly, formatDateTime } from '../lib/format'
import { buildWhatsappUrl } from '../lib/whatsapp'
import { compressImage } from '../lib/imageCompress'
import { randomId } from '../lib/randomId'
import { floatCircleClass, floatPillClass } from '../lib/styles'
import StatusPill from '../components/StatusPill'
import Popover, { MenuItem } from '../components/Popover'
import { PageTitle, PageTopBar, PropertyRow, SectionLabel } from '../components/PageUI'
import {
  IconCalendar,
  IconCamera,
  IconCar,
  IconChat,
  IconChevronDown,
  IconClock,
  IconCopy,
  IconExternal,
  IconEye,
  IconLock,
  IconPhone,
  IconSend,
  IconShare,
  IconStatus,
  IconUser,
} from '../components/icons'

function photoUrl(path) {
  return supabase.storage.from('fotos').getPublicUrl(path).data.publicUrl
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [notes, setNotes] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [menu, setMenu] = useState(null) // 'status' | 'share' | null
  const [message, setMessage] = useState('') // aviso breve (error o confirmación)
  const [noteBody, setNoteBody] = useState('')
  const [noteVisible, setNoteVisible] = useState(true)
  const [savingNote, setSavingNote] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function load() {
      const [orderRes, notesRes, photosRes] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).maybeSingle(),
        supabase.from('order_notes').select('*').eq('order_id', id).order('created_at', { ascending: false }),
        supabase.from('order_photos').select('*').eq('order_id', id).order('created_at', { ascending: true }),
      ])

      if (orderRes.error || notesRes.error || photosRes.error) {
        setError('No se pudo cargar la orden. Intenta de nuevo.')
      } else {
        setOrder(orderRes.data)
        setNotes(notesRes.data)
        setPhotos(photosRes.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  function flash(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  async function changeStatus(status) {
    setMenu(null)
    if (status === order.status) return
    const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', id)
    if (updateError) flash('No se pudo cambiar el estado.')
    else setOrder((prev) => ({ ...prev, status }))
  }

  async function addNote(event) {
    event.preventDefault()
    const body = noteBody.trim()
    if (!body) return
    setSavingNote(true)
    const { data, error: insertError } = await supabase
      .from('order_notes')
      .insert({ order_id: id, body, visible_to_client: noteVisible })
      .select()
      .single()
    setSavingNote(false)
    if (insertError) {
      flash('No se pudo guardar la nota.')
      return
    }
    setNotes((prev) => [data, ...prev])
    setNoteBody('')
    setNoteVisible(true)
  }

  async function uploadPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      const blob = await compressImage(file)
      // Nombre aleatorio: la URL de la foto no se puede adivinar
      const path = `${id}/${randomId()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(path, blob, { contentType: 'image/jpeg' })
      if (uploadError) throw new Error('No se pudo subir la foto.')

      const { data, error: insertError } = await supabase
        .from('order_photos')
        .insert({ order_id: id, storage_path: path })
        .select()
        .single()
      if (insertError) throw new Error('La foto se subió pero no se pudo registrar.')
      setPhotos((prev) => [...prev, data])
    } catch (err) {
      flash(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <p className="p-6 text-center text-body-sm text-black/45">Cargando orden…</p>

  if (error || !order) {
    return (
      <div className="min-h-screen bg-pure-white">
        <PageTopBar backTo="/orders" />
        <p role="alert" className={`px-6 pt-6 text-body-sm ${error ? 'text-vermillion' : 'text-black/45'}`}>
          {error || 'La orden no existe.'}
        </p>
      </div>
    )
  }

  const status = getStatus(order.status)
  const trackingUrl = `${window.location.origin}/t/${order.public_token}`
  const shareMessage = `Hola ${order.client_name}, puedes ver el avance de tu vehículo aquí: ${trackingUrl}`

  async function copyLink() {
    setMenu(null)
    try {
      await navigator.clipboard.writeText(trackingUrl)
      flash('Enlace copiado')
    } catch {
      flash('No se pudo copiar el enlace.')
    }
  }

  return (
    <div className="min-h-screen bg-pure-white pb-40">
      <PageTopBar
        backTo="/orders"
        center={
          // Píldora central = estado; al tocarla se cambia (como "Privada ›" en Notion)
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu('status')}
              className="flex h-10 items-center gap-2 rounded-full bg-black/[0.05] px-4 text-body-sm font-medium text-black/80"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
              {status.label}
              <IconChevronDown size={16} />
            </button>
            <Popover open={menu === 'status'} onClose={() => setMenu(null)} className="top-12 left-1/2 -translate-x-1/2">
              {STATUSES.map((s) => (
                <MenuItem
                  key={s.value}
                  icon={<span className={`block h-2.5 w-2.5 rounded-full ${s.dot}`} />}
                  onClick={() => changeStatus(s.value)}
                  active={order.status === s.value}
                >
                  {s.label}
                </MenuItem>
              ))}
            </Popover>
          </div>
        }
        right={
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu('share')}
              aria-label="Compartir con el cliente"
              className="flex h-12 w-12 items-center justify-center rounded-full text-black/70 hover:bg-black/[0.04]"
            >
              <IconShare />
            </button>
            <Popover open={menu === 'share'} onClose={() => setMenu(null)} className="top-14 right-0">
              <MenuItem icon={<IconChat size={20} />} href={buildWhatsappUrl(order.client_phone, shareMessage)} onClick={() => setMenu(null)}>
                Enviar por WhatsApp
              </MenuItem>
              <MenuItem icon={<IconCopy size={20} />} onClick={copyLink}>
                Copiar enlace
              </MenuItem>
              <MenuItem icon={<IconExternal size={20} />} href={trackingUrl} onClick={() => setMenu(null)}>
                Ver página del cliente
              </MenuItem>
            </Popover>
          </div>
        }
      />

      <main className="mx-auto max-w-md px-6 pt-4">
        <PageTitle>{order.plate}</PageTitle>

        <div className="mt-4">
          <PropertyRow icon={<IconStatus size={18} />} label="Estado">
            <StatusPill status={order.status} />
          </PropertyRow>
          <PropertyRow icon={<IconCar size={18} />} label="Vehículo">
            {order.vehicle}
          </PropertyRow>
          <PropertyRow icon={<IconUser size={18} />} label="Cliente">
            {order.client_name}
          </PropertyRow>
          <PropertyRow icon={<IconPhone size={18} />} label="Teléfono">
            {order.client_phone ? (
              <a href={`tel:${order.client_phone}`} className="underline decoration-black/20 underline-offset-4">
                {order.client_phone}
              </a>
            ) : (
              <span className="text-black/30">Vacío</span>
            )}
          </PropertyRow>
          <PropertyRow icon={<IconCalendar size={18} />} label="Entrega">
            {order.estimated_delivery ? formatDateOnly(order.estimated_delivery) : <span className="text-black/30">Vacío</span>}
          </PropertyRow>
          <PropertyRow icon={<IconClock size={18} />} label="Creada">
            {formatDate(order.created_at)}
          </PropertyRow>
        </div>

        <hr className="my-4 border-black/[0.08]" />

        {order.description ? (
          <p className="text-body leading-relaxed text-black/90">{order.description}</p>
        ) : (
          <p className="text-body text-black/30">Sin descripción del trabajo.</p>
        )}

        <div className="mt-8">
          <SectionLabel>Fotos</SectionLabel>
          {photos.length === 0 ? (
            <p className="py-2 text-body-sm text-black/40">Aún no hay fotos. Usa la cámara de abajo.</p>
          ) : (
            <div className="mt-1 grid grid-cols-3 gap-1.5">
              {photos.map((p) => (
                <a key={p.id} href={photoUrl(p.storage_path)} target="_blank" rel="noreferrer">
                  <img src={photoUrl(p.storage_path)} alt="Foto de la orden" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <SectionLabel>Notas</SectionLabel>
          {notes.length === 0 ? (
            <p className="py-2 text-body-sm text-black/40">Aún no hay notas.</p>
          ) : (
            <ul>
              {notes.map((n) => (
                <li key={n.id} className="flex gap-4 py-3">
                  <span className="pt-0.5 text-black/40">{n.visible_to_client ? <IconChat size={20} /> : <IconLock size={20} />}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body text-black/90">{n.body}</p>
                    <p className="mt-0.5 text-caption text-black/40">
                      {formatDateTime(n.created_at)} · {n.visible_to_client ? 'Visible al cliente' : 'Solo interna'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Barra flotante: foto · nueva nota · enviar */}
      <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md">
          {message && (
            <p role="status" className="mx-auto mb-3 w-fit rounded-full bg-black/85 px-4 py-2 text-body-sm text-white">
              {message}
            </p>
          )}

          {noteBody.trim() && (
            <button
              type="button"
              onClick={() => setNoteVisible((v) => !v)}
              className="mb-3 flex h-9 items-center gap-2 rounded-full bg-pure-white px-4 text-body-sm font-medium text-black/70 shadow-[0_2px_14px_rgba(0,0,0,0.09)]"
            >
              {noteVisible ? <IconEye size={18} /> : <IconLock size={18} />}
              {noteVisible ? 'Visible para el cliente' : 'Solo interna'}
            </button>
          )}

          <form onSubmit={addNote} className="flex items-center gap-3">
            <label className={`${floatCircleClass} cursor-pointer ${uploading ? 'animate-pulse' : ''}`} aria-label="Subir foto">
              <IconCamera />
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} disabled={uploading} className="sr-only" />
            </label>
            <label className={floatPillClass}>
              <input
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Agregar nota…"
                aria-label="Nueva nota"
                className="min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-black/40"
              />
            </label>
            <button
              type="submit"
              disabled={savingNote || !noteBody.trim()}
              aria-label="Guardar nota"
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                noteBody.trim() ? 'bg-notion-blue text-white' : 'bg-pure-white text-black/25 shadow-[0_2px_14px_rgba(0,0,0,0.09)]'
              }`}
            >
              <IconSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
