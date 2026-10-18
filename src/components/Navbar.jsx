import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { BRAND } from '../data/brand'

const LINKS = [
  { to: '/products', label: 'Shop' },
  { to: '/gifting', label: 'Gifting' },
  { to: '/story', label: 'Our story' },
]

export default function Navbar() {
  const { getCartCount } = useCart()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const count = getCartCount()

  useEffect(() => { setOpen(false) }, [location])

  return (
    <header className="sticky top-0 z-50 bg-linen/95 backdrop-blur-sm border-b rule">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-6 py-3.5">
          <Link to="/" className="shrink-0" aria-label={`${BRAND.name} ${BRAND.trade}, home`}>
            <img
              src="/images/logo-mark.png"
              alt={`${BRAND.name} ${BRAND.trade}`}
              className="h-14 sm:h-16 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-baseline gap-8 text-[0.95rem]">
            {LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `pb-0.5 border-b transition-colors ${
                    isActive
                      ? 'border-brand text-espresso'
                      : 'border-transparent text-ink-60 hover:text-espresso'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/cart" className="text-ink-60 hover:text-espresso">
              Basket{count > 0 && <span className="text-espresso"> ({count})</span>}
            </Link>
          </nav>

          <button
            className="md:hidden text-[0.95rem] text-ink-60"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="nav-menu"
          >
            {open ? 'Close' : `Menu${count > 0 ? ` (${count})` : ''}`}
          </button>
        </div>

        {open && (
          <nav id="nav-menu" className="md:hidden pb-4 flex flex-col gap-3 text-lg">
            {LINKS.map(l => (
              <Link key={l.to} to={l.to} className="text-ink-60">{l.label}</Link>
            ))}
            <Link to="/cart" className="text-ink-60">
              Basket{count > 0 && ` (${count})`}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
