import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '180px 0 120px' }}>
      <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>This page isn't here</h1>
      <p style={{ color: 'var(--color-text-light)', marginTop: '0.75rem' }}>
        The link may be old, or there may be a typo in the address.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
        <Link to="/products" className="btn btn-primary btn-lg">Go to the shop</Link>
        <Link to="/" className="btn btn-secondary btn-lg">Back to home</Link>
      </div>
    </div>
  )
}
