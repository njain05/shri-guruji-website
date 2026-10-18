import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { BRAND } from '../data/brand'
import { formatINR } from '../data/glossary'

const LINKS = [
  { to: '/products', label: 'Shop' },
  { to: '/gifting', label: 'Diwali gifting' },
  { to: '/story', label: 'Our story' },
]

const link = ({ isActive }) =>
  `relative py-2 transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'} ` +
  `after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full ` +
  (isActive ? 'after:bg-olive' : 'after:bg-transparent')

export default function Navbar() {
  const { getCartCount } = useCart()
  const { wishlist } = useWishlist()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const count = getCartCount()

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      <p className="bg-pista text-ink/80 text-center text-[0.92rem] py-2 px-4">
        Free delivery on orders above {formatINR(BRAND.delivery.freeAbove)}
      </p>

      <header className="sticky top-0 z-50 bg-paper/92 backdrop-blur-md border-b hairline">
        <div className="container-page flex items-center justify-between gap-4 py-2.5">
          <Link to="/" className="shrink-0" aria-label={`${BRAND.name} ${BRAND.trade}, home`}>
            <img src="/images/logo-mark.png" alt={`${BRAND.name} ${BRAND.trade}`} className="h-14 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-[1.02rem]" aria-label="Main">
            {LINKS.map(l => <NavLink key={l.to} to={l.to} className={link}>{l.label}</NavLink>)}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/wishlist"
              aria-label={`Saved items${wishlist.length ? `, ${wishlist.length}` : ''}`}
              className="relative grid place-items-center w-11 h-11 rounded-[var(--radius-field)] text-ink hover:bg-well transition-colors"
            >
              <FiHeart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-crimson text-paper text-[0.65rem] leading-4 text-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" id="cart-button" className="button-primary !py-2.5 !px-4">
              <FiShoppingBag size={18} />
              <span>Basket</span>
              {count > 0 && (
                <span className="grid place-items-center min-w-6 h-6 px-1.5 rounded-[4px] bg-paper text-olive text-[0.8rem] font-semibold tabular-nums">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="md:hidden grid place-items-center w-11 h-11 rounded-[var(--radius-field)] hover:bg-well"
              onClick={() => setOpen(v => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-nav" className="md:hidden container-page pb-4" aria-label="Main">
            <div className="rounded-[var(--radius-panel)] bg-well p-2 flex flex-col">
              {LINKS.map(l => (
                <NavLink key={l.to} to={l.to}
                  className={({ isActive }) => `rounded-[var(--radius-field)] px-4 py-3 text-lg ${isActive ? 'bg-paper' : ''}`}>
                  {l.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
