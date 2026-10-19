import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../components/LoadingScreen'
import { fieldClass, primaryButtonClass } from '../lib/styles'

export default function Login() {
  const { session, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <LoadingScreen />
  if (session) return <Navigate to="/orders" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña.')
      return
    }

    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setSubmitting(false)

    // Mensaje genérico a propósito: no revela si el correo existe
    if (signInError) setError('Correo o contraseña incorrectos.')
  }

  return (
    <main className="flex min-h-screen flex-col bg-pure-white px-6">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
        {/* Marca: cuadrado con borde grueso, como el logo de Notion */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border-[2.5px] border-black/90 text-heading-sm font-bold">
          T
        </div>

        <h1 className="mt-6 text-center text-heading-sm font-semibold text-black/90">
          Tu taller, al día.
          <span className="block text-black/40">Inicia sesión con tu cuenta del taller</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3" noValidate>
          <input
            type="email"
            autoComplete="email"
            placeholder="Correo electrónico"
            aria-label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            aria-label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />

          {error && (
            <p role="alert" className="text-center text-body-sm text-vermillion">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className={primaryButtonClass}>
            {submitting ? 'Ingresando…' : 'Continuar'}
          </button>
        </form>

        <p className="mt-10 text-center text-body-sm text-black/40">
          Las cuentas las crea el administrador del taller.
        </p>
      </div>
    </main>
  )
}
