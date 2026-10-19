import { Link } from 'react-router-dom'
import { FiAward, FiHome, FiPackage, FiMessageCircle } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/ProductCard'
import { BRAND, formatINR } from '../../data/brand'
import './Home.css'

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.filter(p => p.featured).slice(0, 6)

  function scrollToFeatured() {
    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-pattern"></div>
        <div className="container hero__inner">
          <div className="hero__content animate-fade-in-up">
            <p className="hero__eyebrow">From a {BRAND.city} wholesale family</p>
            <h1 className="hero__title">Premium dry fruits, delivered fresh</h1>
            <p className="hero__subtitle">
              Badam, kaju, pista, anjeer and more — the same grades we sell to shops
              in {BRAND.city}, now weighed and packed at home for you.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop now
              </Link>
              <button onClick={scrollToFeatured} className="btn btn-secondary btn-lg">
                See our picks
              </button>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">{loading ? '—' : products.length}</span>
                <span className="hero__stat-label">goods in stock</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">FSSAI</span>
                <span className="hero__stat-label">licensed food business</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">{formatINR(BRAND.delivery.freeAbove)}</span>
                <span className="hero__stat-label">and up ships free</span>
              </div>
            </div>
          </div>
          <div className="hero__image animate-fade-in">
            <div className="hero__image-circle">
              <img
                src="/hero-dry-fruits.png"
                alt="Bowls of almonds, cashews, pistachios, walnuts, raisins, dates and figs"
                className="hero__img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon"><FiAward size={28} /></div>
              <h3 className="feature-card__title">FSSAI licensed</h3>
              <p className="feature-card__desc">A registered food business. Licence {BRAND.fssai} is printed on every pouch.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon"><FiPackage size={28} /></div>
              <h3 className="feature-card__title">Wholesale grades</h3>
              <p className="feature-card__desc">The same goods and grades we supply to shops, not a separate retail line.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon"><FiHome size={28} /></div>
              <h3 className="feature-card__title">Packed at home</h3>
              <p className="feature-card__desc">Every order is weighed and packed by our family in {BRAND.city}.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon"><FiMessageCircle size={28} /></div>
              <h3 className="feature-card__title">Confirmed on WhatsApp</h3>
              <p className="feature-card__desc">We message you to confirm every order, and again when it is on its way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products section" id="featured-products">
        <div className="container">
          <h2 className="section-title">Our picks</h2>
          <p className="section-subtitle">
            A good place to start. Every good comes in 250 g, 500 g and 1 kg packs.
          </p>

          {loading ? (
            <div className="loading-grid grid-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card card">
                  <div className="skeleton skeleton--image"></div>
                  <div className="skeleton skeleton--text"></div>
                  <div className="skeleton skeleton--text-sm"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="featured-products__cta">
            <Link to="/products" className="btn btn-gold btn-lg">
              See all {loading ? '' : products.length} goods
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us section">
        <div className="container">
          <div className="why-us__inner">
            <div className="why-us__content">
              <h2 className="why-us__title">The same goods we sell to shops</h2>
              <p className="why-us__desc">
                Our family supplies dry fruits wholesale in {BRAND.city}. Shopkeepers buy their
                badam, kaju and anjeer from us in bulk.
              </p>
              <p className="why-us__desc">
                This shop is run by my mother. She was a teacher until recently, and left to start
                this from home — the same sourcing and the same grades, packed by hand and sent
                straight to you.
              </p>
            </div>
            <div className="why-us__image">
              <img
                src="/why-choose-us.png"
                alt="Bowls of dry fruits on a kitchen counter by a window"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner">
            <h2 className="cta-banner__title">Order for home, or for Diwali</h2>
            <p className="cta-banner__desc">
              Pay cash on delivery. Free delivery on orders above {formatINR(BRAND.delivery.freeAbove)}.
              Want it packed as a gift? Tick the gift box option at checkout.
            </p>
            <Link to="/products" className="btn btn-gold btn-lg">
              Shop now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
