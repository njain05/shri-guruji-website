import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FiLock, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './Admin.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { isAdmin, loading, login, isAuthConfigured } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="admin-login">
        <div className="admin-login__card card">
          <p className="admin-login__subtitle">Checking your session…</p>
        </div>
      </div>
    )
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isAuthConfigured) {
      setError('Admin login is not configured yet. Connect Supabase first.')
      return
    }

    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)

    if (result.ok) {
      toast.success('Welcome to the Seller Portal')
      navigate('/admin/dashboard')
    } else {
      setError(result.error)
      setPassword('')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card card">
        <div className="admin-login__icon">
          <FiLock size={32} />
        </div>
        <h1 className="admin-login__title">Seller Portal</h1>
        <p className="admin-login__subtitle">
          Sign in to manage products and orders
        </p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="you@example.com"
              className={error ? 'input-error' : ''}
              id="admin-email"
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Enter password"
              className={error ? 'input-error' : ''}
              id="admin-password"
              autoComplete="current-password"
            />
            {error && <span className="form-error">{error}</span>}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg admin-login__submit"
            id="admin-login-btn"
            disabled={submitting || !isAuthConfigured}
          >
            {submitting ? 'Signing in…' : <>Login <FiArrowRight size={18} /></>}
          </button>
        </form>
        {!isAuthConfigured && (
          <p className="admin-login__hint">
            Seller sign-in is unavailable until Supabase is connected.
          </p>
        )}
      </div>
    </div>
  )
}
