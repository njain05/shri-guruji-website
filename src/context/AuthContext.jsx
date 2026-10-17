import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase.js'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Admin auth, backed by Supabase Auth.
 *
 * There is deliberately no password in this file. Anything referenced through
 * import.meta.env is inlined into the public JS bundle at build time, so a
 * client-side password check is readable by every visitor.
 *
 * `isAdmin` here only decides what the UI shows. The real enforcement lives in
 * the row level security policies in supabase-schema.sql, which is why a user
 * who fakes this flag still cannot read a single order.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(Boolean(supabase))

  const checkAdmin = useCallback(async (activeSession) => {
    if (!supabase || !activeSession?.user) return false
    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', activeSession.user.id)
      .maybeSingle()
    if (error) {
      console.error('Could not verify admin membership:', error.message)
      return false
    }
    return Boolean(data)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function apply(activeSession) {
      const admin = await checkAdmin(activeSession)
      if (cancelled) return
      setSession(activeSession)
      setIsAdmin(admin)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => apply(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      setLoading(true)
      apply(activeSession)
    })

    return () => {
      cancelled = true
      listener?.subscription?.unsubscribe()
    }
  }, [checkAdmin])

  async function login(email, password) {
    if (!supabase) {
      return { ok: false, error: 'Admin login is not configured yet.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })
    if (error) {
      return { ok: false, error: 'Incorrect email or password.' }
    }

    const admin = await checkAdmin(data.session)
    if (!admin) {
      // Signed in, but not on the admin list — don't leave a usable session behind.
      await supabase.auth.signOut()
      return { ok: false, error: 'This account does not have seller access.' }
    }

    return { ok: true }
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  const value = {
    session,
    isAdmin,
    loading,
    login,
    logout,
    isAuthConfigured: Boolean(supabase)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
