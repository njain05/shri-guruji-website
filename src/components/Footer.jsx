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
                <span className="footer__logo-badge">
                  <img src="/images/logo-mark.png" alt="Shri Guru Ji Dry Fruits" />
                </span>
              </div>
              <p className="footer__desc">
                Dry fruits from a Ludhiana wholesale family, packed at home and sent to you.
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
                <a href="tel:+919815510684" className="footer__contact-item">
                  <FiPhone size={16} /> +91 98155 10684
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
            <p>© {new Date().getFullYear()} Shri Guruji Traders</p>
            <p>FSSAI licence 12124999000222</p>
            <p className="footer__tagline">Made with ❤️ by Nishtha Jain</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
