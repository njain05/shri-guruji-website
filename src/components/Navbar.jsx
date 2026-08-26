import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiMenu, FiX, FiHeart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import './Navbar.css'

export default function Navbar() {
  const { getCartCount } = useCart()
  const { wishlist } = useWishlist()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const cartCount = getCartCount()
  const wishlistCount = wishlist.length

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${isAdmin ? 'navbar--admin' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <img src="/images/logo.jpeg" alt="Shri Guru Ji Logo" className="navbar__logo-img" />
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">Shri Guru Ji</span>
            <span className="navbar__brand-tag">Dry Fruits</span>
          </div>
        </Link>

        <div className={`navbar__links ${isMobileOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>Home</Link>
          <Link to="/products" className={`navbar__link ${location.pathname === '/products' ? 'navbar__link--active' : ''}`}>Products</Link>
          <Link to="/cart" className={`navbar__link ${location.pathname === '/cart' ? 'navbar__link--active' : ''}`}>Cart</Link>
        </div>

        <div className="navbar__actions">
          <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist" title="Saved Items">
            <FiHeart size={20} />
            {wishlistCount > 0 && (
              <span className="navbar__icon-badge">{wishlistCount}</span>
            )}
          </Link>

          <Link to="/cart" className="navbar__cart-btn" id="cart-button">
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </Link>

          <button
            className="navbar__mobile-toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
