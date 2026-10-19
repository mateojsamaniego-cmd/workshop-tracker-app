import { createContext } from 'react'

// Valor: { session, loading }. Se llena en AuthProvider.
export const AuthContext = createContext({ session: null, loading: true })
