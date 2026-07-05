import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLock, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './Admin.css'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { isAdmin, login, isAuthConfigured } = useAuth()
  const navigate = useNavigate()

  if (isAdmin) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isAuthConfigured) {
      setError('Admin login is not configured. Set VITE_ADMIN_PASSWORD in .env.')
      return
    }

    if (login(password)) {
      toast.success('Welcome to Admin Panel!')
      navigate('/admin/dashboard')
    } else {
      setError('Incorrect password. Please try again.')
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
          Enter your admin password to manage products and orders
        </p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="Enter password"
              className={error ? 'input-error' : ''}
              id="admin-password"
              autoFocus
            />
            {error && <span className="form-error">{error}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-lg admin-login__submit" id="admin-login-btn">
            Login <FiArrowRight size={18} />
          </button>
        </form>
        {!isAuthConfigured && (
          <p className="admin-login__hint">
            Admin login is disabled until <code>VITE_ADMIN_PASSWORD</code> is configured.
          </p>
        )}
      </div>
    </div>
  )
}
