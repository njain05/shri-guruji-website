import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="footer__content">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__logo">
                <img src="/images/logo.jpeg" alt="Shri Guru Ji Logo" className="footer__logo-img" />
                <div>
                  <h3 className="footer__brand-name">Shri Guru Ji</h3>
                  <span className="footer__brand-tag">Dry Fruits</span>
                </div>
              </div>
              <p className="footer__desc">
                Premium quality dry fruits sourced directly from the finest farms.
                We deliver freshness and nutrition right to your doorstep.
              </p>
            </div>

            <div className="footer__section">
              <h4 className="footer__heading">Quick Links</h4>
              <div className="footer__links">
                <Link to="/" className="footer__link">Home</Link>
                <Link to="/products" className="footer__link">Products</Link>
                <Link to="/wishlist" className="footer__link">Saved Items</Link>
                <Link to="/cart" className="footer__link">Cart</Link>
                <Link to="/admin" className="footer__link">Seller Portal</Link>
              </div>
            </div>

            <div className="footer__section">
              <h4 className="footer__heading">Categories</h4>
              <div className="footer__links">
                <Link to="/products?category=Nuts" className="footer__link">Nuts</Link>
                <Link to="/products?category=Dried Fruits" className="footer__link">Dried Fruits</Link>
                <Link to="/products?category=Seeds" className="footer__link">Seeds</Link>
                <Link to="/products?category=Sweets" className="footer__link">Sweets</Link>
              </div>
            </div>

            <div className="footer__section">
              <h4 className="footer__heading">Contact Us</h4>
              <div className="footer__contact">
                <a href="tel:+919876543210" className="footer__contact-item">
                  <FiPhone size={16} /> +91 98765 43210
                </a>
                <a href="mailto:info@shriguruji.com" className="footer__contact-item">
                  <FiMail size={16} /> info@shriguruji.com
                </a>
                <span className="footer__contact-item">
                  <FiMapPin size={16} /> Ludhiana, Punjab, India
                </span>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p>© {new Date().getFullYear()} Shri Guru Ji Dry Fruits. All rights reserved.</p>
            <p className="footer__tagline">Made with ❤️ by Nishtha Jain</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
