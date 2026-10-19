import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { bareInputClass } from '../lib/styles'
import { todayISO } from '../lib/format'
import { PageTopBar, PropertyRow } from '../components/PageUI'
import { IconCalendar, IconCar, IconPage, IconPhone, IconUser } from '../components/icons'

const EMPTY_FORM = {
  plate: '',
  client_name: '',
  client_phone: '',
  vehicle: '',
  description: '',
  estimated_delivery: '',
}

// La nueva orden se llena como una página de Notion: título grande + propiedades sin bordes
export default function NewOrder() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const today = todayISO()

  function setField(name, transform = (v) => v) {
    return (event) => setForm((prev) => ({ ...prev, [name]: transform(event.target.value) }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const plate = form.plate.trim().toUpperCase()
    const clientName = form.client_name.trim().toUpperCase()
    const vehicle = form.vehicle.trim()
    const phone = form.client_phone.trim()

    if (!plate || !clientName || !vehicle) {
      setError('La placa, el cliente y el vehículo son obligatorios.')
      return
    }
    if (phone && !/^\d{10}$/.test(phone)) {
      setError('El celular debe tener exactamente 10 dígitos (ej. 0991234567).')
      return
    }
    // Las fechas YYYY-MM-DD se pueden comparar como texto
    if (form.estimated_delivery && form.estimated_delivery < today) {
      setError('La fecha de entrega no puede ser anterior a hoy.')
      return
    }

    setSubmitting(true)
    const { data, error: insertError } = await supabase
      .from('orders')
      .insert({
        plate,
        client_name: clientName,
        client_phone: phone || null,
        vehicle,
        description: form.description.trim() || null,
        estimated_delivery: form.estimated_delivery || null,
      })
      .select('id')
      .single()
    setSubmitting(false)

    if (insertError) {
      setError('No se pudo crear la orden. Intenta de nuevo.')
      return
    }
    navigate(`/orders/${data.id}`, { replace: true })
  }

  return (
    <div className="min-h-screen bg-pure-white">
      <PageTopBar
        backTo="/orders"
        center={
          <span className="flex h-10 items-center gap-2 rounded-full bg-black/[0.05] px-4 text-body-sm font-medium text-black/70">
            <IconPage size={18} />
            Nueva orden
          </span>
        }
        right={
          <button
            type="submit"
            form="new-order"
            disabled={submitting}
            className="h-10 rounded-full bg-notion-blue px-5 text-body-sm font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Creando…' : 'Crear'}
          </button>
        }
      />

      <form id="new-order" onSubmit={handleSubmit} className="mx-auto max-w-md px-6 pt-4 pb-16" noValidate>
        <input
          value={form.plate}
          onChange={setField('plate')}
          placeholder="Placa"
          aria-label="Placa"
          autoCapitalize="characters"
          className="w-full bg-transparent text-[30px] leading-tight font-bold tracking-[-0.02em] text-black/90 uppercase outline-none placeholder:normal-case placeholder:text-black/20"
        />

        <div className="mt-4">
          <PropertyRow icon={<IconUser size={18} />} label="Cliente">
            <input
              value={form.client_name}
              onChange={setField('client_name', (v) => v.toUpperCase())}
              placeholder="Vacío"
              aria-label="Nombre del cliente"
              autoCapitalize="characters"
              className={bareInputClass}
            />
          </PropertyRow>
          <PropertyRow icon={<IconPhone size={18} />} label="Celular">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.client_phone}
              onChange={setField('client_phone', (v) => v.replace(/\D/g, '').slice(0, 10))}
              placeholder="0991234567"
              aria-label="Celular (10 dígitos)"
              className={bareInputClass}
            />
          </PropertyRow>
          <PropertyRow icon={<IconCar size={18} />} label="Vehículo">
            <input value={form.vehicle} onChange={setField('vehicle')} placeholder="Chevrolet Sail 2018" aria-label="Vehículo" className={bareInputClass} />
          </PropertyRow>
          <PropertyRow icon={<IconCalendar size={18} />} label="Entrega">
            <input type="date" min={today} value={form.estimated_delivery} onChange={setField('estimated_delivery')} aria-label="Fecha estimada de entrega" className={bareInputClass} />
          </PropertyRow>
        </div>

        <hr className="my-4 border-black/[0.08]" />

        <textarea
          rows={5}
          value={form.description}
          onChange={setField('description')}
          placeholder="Describe el trabajo a realizar…"
          aria-label="Trabajo a realizar"
          className="w-full resize-none bg-transparent text-body leading-relaxed outline-none placeholder:text-black/30"
        />

        {error && (
          <p role="alert" className="mt-2 text-body-sm text-vermillion">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
