import { Link } from 'react-router-dom'
import { FiTruck, FiShield, FiStar, FiArrowRight, FiHeart, FiAward, FiPackage } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/ProductCard'
import './Home.css'

export default function Home() {
  const { products, loading } = useProducts()
  const featured = products.filter(p => p.featured).slice(0, 6)

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-pattern"></div>
        <div className="container hero__inner">
          <div className="hero__content animate-fade-in-up">
            <span className="hero__badge badge badge-gold">
              <FiAward size={14} /> Premium Quality Since Generations
            </span>
            <h1 className="hero__title">
              Premium <span className="hero__title-accent">Dry Fruits</span>
              <br />Delivered Fresh
            </h1>
            <p className="hero__subtitle">
              Handpicked, farm-fresh dry fruits & seeds from the finest orchards. 
              Experience the authentic taste of nature with Shri Guru Ji.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now <FiArrowRight size={20} />
              </Link>
              <Link to="/products" className="btn btn-secondary btn-lg">
                Explore Collection
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">16+</span>
                <span className="hero__stat-label">Products</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">100%</span>
                <span className="hero__stat-label">Natural</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <span className="hero__stat-number">Pan</span>
                <span className="hero__stat-label">India Delivery</span>
              </div>
            </div>
          </div>
          <div className="hero__image animate-fade-in">
            <div className="hero__image-circle">
              <img
                src="/hero-dry-fruits.png"
                alt="Premium dry fruits assortment"
                className="hero__img"
              />
            </div>
            <div className="hero__float hero__float--1">🌰</div>
            <div className="hero__float hero__float--2">🥜</div>
            <div className="hero__float hero__float--3">🫐</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features section">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon">
                <FiShield size={28} />
              </div>
              <h3 className="feature-card__title">100% Natural</h3>
              <p className="feature-card__desc">No preservatives, no artificial colors. Pure, natural goodness in every bite.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">
                <FiTruck size={28} />
              </div>
              <h3 className="feature-card__title">Fast Delivery</h3>
              <p className="feature-card__desc">Quick and reliable delivery across India. Fresh from our store to your door.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">
                <FiStar size={28} />
              </div>
              <h3 className="feature-card__title">Premium Quality</h3>
              <p className="feature-card__desc">Handpicked from the finest farms. Every product passes strict quality checks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">
                <FiHeart size={28} />
              </div>
              <h3 className="feature-card__title">Health First</h3>
              <p className="feature-card__desc">Nutrient-rich superfoods that boost your immunity and overall wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products section">
        <div className="container">
          <h2 className="section-title">Our Bestsellers</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">
            Discover our most loved products, handpicked for their exceptional quality and taste
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
              View All Products <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us section">
        <div className="container">
          <div className="why-us__inner">
            <div className="why-us__content">
              <h2 className="why-us__title">Why Choose<br /><span className="text-gold">Shri Guru Ji?</span></h2>
              <div className="section-divider" style={{ margin: '1rem 0 1.5rem' }}></div>
              <p className="why-us__desc">
                For generations, the Shri Guru Ji family has been dedicated to sourcing and delivering 
                the finest dry fruits and seeds. Our commitment to quality, freshness, and customer 
                satisfaction sets us apart.
              </p>
              <ul className="why-us__list">
                <li className="why-us__list-item">
                  <FiPackage className="why-us__list-icon" />
                  <div>
                    <strong>Direct from Farms</strong>
                    <p>We source directly from trusted farmers, cutting out middlemen for the freshest products.</p>
                  </div>
                </li>
                <li className="why-us__list-item">
                  <FiShield className="why-us__list-icon" />
                  <div>
                    <strong>Quality Guaranteed</strong>
                    <p>Every batch is quality tested. We stand behind the purity and freshness of our products.</p>
                  </div>
                </li>
                <li className="why-us__list-item">
                  <FiTruck className="why-us__list-icon" />
                  <div>
                    <strong>Safe & Secure Packaging</strong>
                    <p>Vacuum-sealed packaging ensures your dry fruits reach you in perfect condition.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="why-us__image">
              <img
                src="/why-choose-us.png"
                alt="Various dry fruits in wooden bowls"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Real reviews from our happy customers across India</p>

          <div className="grid-3">
            <div className="testimonial-card card">
              <div className="testimonial-card__stars">★★★★★</div>
              <p className="testimonial-card__text">
                "The quality of almonds and pistachios is exceptional! Fresh, crunchy, 
                and so much better than what you get in stores. Will definitely order again."
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">R</div>
                <div>
                  <strong>Rajesh Kumar</strong>
                  <span>Delhi</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card card">
              <div className="testimonial-card__stars">★★★★★</div>
              <p className="testimonial-card__text">
                "I ordered the mix seeds combo and it's amazing! Perfect for my morning 
                smoothie bowls. The packaging is also very premium and hygienic."
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">P</div>
                <div>
                  <strong>Priya Sharma</strong>
                  <span>Mumbai</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card card">
              <div className="testimonial-card__stars">★★★★★</div>
              <p className="testimonial-card__text">
                "Best dried fruits I've ever had! The anjeer is so soft and sweet. 
                Great value for money and fast delivery. Highly recommended!"
              </p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">A</div>
                <div>
                  <strong>Amit Patel</strong>
                  <span>Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner">
            <h2 className="cta-banner__title">Ready to Order Fresh Dry Fruits?</h2>
            <p className="cta-banner__desc">
              Browse our collection and get premium dry fruits delivered to your doorstep.
              Safe payments via Google Pay, PhonePe, or Cash on Delivery.
            </p>
            <Link to="/products" className="btn btn-gold btn-lg">
              Order Now <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
