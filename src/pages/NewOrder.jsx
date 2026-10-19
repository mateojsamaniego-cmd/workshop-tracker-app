import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { cardClass, inputClass, primaryButtonClass, textareaClass } from '../lib/styles'

const EMPTY_FORM = {
  plate: '',
  client_name: '',
  client_phone: '',
  vehicle: '',
  description: '',
  estimated_delivery: '',
}

export default function NewOrder() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function setField(name) {
    return (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const plate = form.plate.trim().toUpperCase()
    const clientName = form.client_name.trim()
    const vehicle = form.vehicle.trim()
    const phone = form.client_phone.trim()

    if (!plate || !clientName || !vehicle) {
      setError('La placa, el nombre del cliente y el vehículo son obligatorios.')
      return
    }
    if (phone && !/^[0-9+\s-]{7,15}$/.test(phone)) {
      setError('El teléfono solo puede tener números, espacios, + o guiones.')
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
    navigate(`/orders/${data.id}`)
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <Link to="/orders" className="text-sm font-medium text-notion-blue">
        ← Órdenes
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Nueva orden</h1>

      <form onSubmit={handleSubmit} className={`mt-4 ${cardClass}`} noValidate>
        <label className="block text-sm font-medium" htmlFor="plate">
          Placa *
          <input id="plate" value={form.plate} onChange={setField('plate')} className={`${inputClass} uppercase`} autoCapitalize="characters" />
        </label>

        <label className="mt-4 block text-sm font-medium" htmlFor="client_name">
          Nombre del cliente *
          <input id="client_name" value={form.client_name} onChange={setField('client_name')} className={inputClass} autoComplete="off" />
        </label>

        <label className="mt-4 block text-sm font-medium" htmlFor="client_phone">
          Teléfono (para WhatsApp)
          <input id="client_phone" type="tel" inputMode="tel" value={form.client_phone} onChange={setField('client_phone')} className={inputClass} placeholder="0991234567" />
        </label>

        <label className="mt-4 block text-sm font-medium" htmlFor="vehicle">
          Vehículo *
          <input id="vehicle" value={form.vehicle} onChange={setField('vehicle')} className={inputClass} placeholder="Chevrolet Sail 2018" />
        </label>

        <label className="mt-4 block text-sm font-medium" htmlFor="description">
          Trabajo a realizar
          <textarea id="description" rows={3} value={form.description} onChange={setField('description')} className={textareaClass} />
        </label>

        <label className="mt-4 block text-sm font-medium" htmlFor="estimated_delivery">
          Fecha estimada de entrega
          <input id="estimated_delivery" type="date" value={form.estimated_delivery} onChange={setField('estimated_delivery')} className={inputClass} />
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm text-vermillion">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`mt-6 ${primaryButtonClass}`}>
          {submitting ? 'Guardando…' : 'Crear orden'}
        </button>
      </form>
    </main>
  )
}
