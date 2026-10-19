import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { STATUSES } from '../lib/orderStatus'
import { formatDateOnly, formatDateTime } from '../lib/format'
import { buildWhatsappUrl } from '../lib/whatsapp'
import { compressImage } from '../lib/imageCompress'
import { cardClass, ghostButtonClass, inputClass, primaryButtonClass, textareaClass } from '../lib/styles'
import StatusPill from '../components/StatusPill'

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

  const [actionError, setActionError] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [noteBody, setNoteBody] = useState('')
  const [noteVisible, setNoteVisible] = useState(true)
  const [savingNote, setSavingNote] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState(false)

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

  async function changeStatus(event) {
    const status = event.target.value
    setActionError('')
    setSavingStatus(true)
    const { error: updateError } = await supabase.from('orders').update({ status }).eq('id', id)
    setSavingStatus(false)
    if (updateError) setActionError('No se pudo cambiar el estado.')
    else setOrder((prev) => ({ ...prev, status }))
  }

  async function addNote(event) {
    event.preventDefault()
    const body = noteBody.trim()
    if (!body) return
    setActionError('')
    setSavingNote(true)
    const { data, error: insertError } = await supabase
      .from('order_notes')
      .insert({ order_id: id, body, visible_to_client: noteVisible })
      .select()
      .single()
    setSavingNote(false)
    if (insertError) {
      setActionError('No se pudo guardar la nota.')
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

    setActionError('')
    setUploading(true)
    try {
      const blob = await compressImage(file)
      // Nombre aleatorio: la URL de la foto no se puede adivinar
      const path = `${id}/${crypto.randomUUID()}.jpg`
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
      setActionError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <p className="p-6 text-center text-graphite">Cargando orden…</p>

  if (error || !order) {
    return (
      <main className="mx-auto max-w-md p-6">
        <Link to="/orders" className="text-sm font-medium text-notion-blue">
          ← Órdenes
        </Link>
        <p role="alert" className={`mt-4 ${cardClass} text-center ${error ? 'text-vermillion' : 'text-graphite'}`}>
          {error || 'La orden no existe.'}
        </p>
      </main>
    )
  }

  const trackingUrl = `${window.location.origin}/t/${order.public_token}`
  const shareMessage = `Hola ${order.client_name}, puedes ver el avance de tu vehículo aquí: ${trackingUrl}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setActionError('No se pudo copiar. Mantén presionado el enlace para copiarlo.')
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-4 p-6 pb-12">
      <Link to="/orders" className="text-sm font-medium text-notion-blue">
        ← Órdenes
      </Link>

      <section className={cardClass}>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{order.plate}</h1>
          <StatusPill status={order.status} />
        </div>
        <p className="mt-1">{order.vehicle}</p>
        <p className="mt-3 text-sm text-graphite">
          Cliente: {order.client_name}
          {order.client_phone && ` · ${order.client_phone}`}
        </p>
        {order.description && <p className="mt-3 text-sm">{order.description}</p>}
        {order.estimated_delivery && (
          <p className="mt-3 text-sm text-graphite">Entrega estimada: {formatDateOnly(order.estimated_delivery)}</p>
        )}

        <label className="mt-4 block text-sm font-medium" htmlFor="status">
          Estado
          <select id="status" value={order.status} onChange={changeStatus} disabled={savingStatus} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {actionError && (
        <p role="alert" className="text-sm text-vermillion">
          {actionError}
        </p>
      )}

      <section className={cardClass}>
        <h2 className="text-lg font-semibold">Enlace para el cliente</h2>
        <p className="mt-1 break-all text-sm text-graphite">{trackingUrl}</p>
        <a
          href={buildWhatsappUrl(order.client_phone, shareMessage)}
          target="_blank"
          rel="noreferrer"
          className={`mt-4 flex items-center justify-center ${primaryButtonClass}`}
        >
          Compartir por WhatsApp
        </a>
        <button type="button" onClick={copyLink} className={`mt-2 ${ghostButtonClass}`}>
          {copied ? 'Enlace copiado' : 'Copiar enlace'}
        </button>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold">Fotos</h2>
        {photos.length === 0 ? (
          <p className="mt-2 text-sm text-graphite">Aún no hay fotos.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {photos.map((p) => (
              <a key={p.id} href={photoUrl(p.storage_path)} target="_blank" rel="noreferrer">
                <img src={photoUrl(p.storage_path)} alt="Foto de la orden" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
              </a>
            ))}
          </div>
        )}

        <label className={`mt-4 flex cursor-pointer items-center justify-center ${ghostButtonClass} ${uploading ? 'opacity-60' : ''}`}>
          {uploading ? 'Subiendo…' : 'Subir foto'}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} disabled={uploading} className="sr-only" />
        </label>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold">Notas</h2>
        <form onSubmit={addNote} className="mt-3">
          <textarea
            rows={3}
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Escribe una nota…"
            aria-label="Nueva nota"
            className={textareaClass}
          />
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noteVisible} onChange={(e) => setNoteVisible(e.target.checked)} className="h-5 w-5" />
            Visible para el cliente
          </label>
          <button type="submit" disabled={savingNote || !noteBody.trim()} className={`mt-3 ${primaryButtonClass}`}>
            {savingNote ? 'Guardando…' : 'Agregar nota'}
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="mt-4 text-sm text-graphite">Aún no hay notas.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-lg bg-paper-warmth p-3 text-sm">
                <p>{n.body}</p>
                <p className="mt-1 text-xs text-graphite">
                  {formatDateTime(n.created_at)} · {n.visible_to_client ? 'Visible al cliente' : 'Solo interna'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
