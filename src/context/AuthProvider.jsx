import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authContext'

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sesión guardada por Supabase en el navegador (si el personal ya había entrado)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Se actualiza al iniciar/cerrar sesión o cuando el token se renueva
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>
}
