import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

// Frontend-only gate; real security requires backend auth.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || ''

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('guruji_admin') === 'true'
  })

  function login(password) {
    if (!ADMIN_PASSWORD) {
      return false
    }

    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      sessionStorage.setItem('guruji_admin', 'true')
      return true
    }
    return false
  }

  function logout() {
    setIsAdmin(false)
    sessionStorage.removeItem('guruji_admin')
  }

  const value = { isAdmin, login, logout, isAuthConfigured: Boolean(ADMIN_PASSWORD) }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
