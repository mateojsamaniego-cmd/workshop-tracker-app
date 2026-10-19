import { createClient } from '@supabase/supabase-js'

// Único lugar donde se crea el cliente. Solo se usa la anon key (pública por diseño);
// la seguridad real la dan las policies RLS en la base de datos.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
