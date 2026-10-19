import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiPackage, FiHeart } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice } from '../../utils/payment'
import toast from 'react-hot-toast'
import './ProductDetail.css'

function getRecentlyViewed(currentId) {
  try {
    const ids = JSON.parse(localStorage.getItem('guruji_recent') || '[]')
    return ids.filter(id => id !== currentId).slice(0, 4)
  } catch {
    return []
  }
}

function addToRecentlyViewed(id) {
  try {
    const ids = JSON.parse(localStorage.getItem('guruji_recent') || '[]')
    const updated = [id, ...ids.filter(i => i !== id)].slice(0, 10)
    localStorage.setItem('guruji_recent', JSON.stringify(updated))
  } catch {}
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, products, loading } = useProducts()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [weightIndex, setWeightIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)

  const product = getProduct(id)
  const inWishlist = product ? isInWishlist(product.id) : false

  useEffect(() => {
    setQuantity(1)
    setWeightIndex(0)
    setImageIndex(0)
  }, [id])

  useEffect(() => {
    if (product) addToRecentlyViewed(id)
  }, [id, product])

  // Products arrive asynchronously; without this the page showed "not found"
  // for a moment on every direct visit or refresh.
  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '200px' }}>
          <p>Loading…</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container" style={{ textAlign: 'center', paddingTop: '200px' }}>
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const recentIds = getRecentlyViewed(id)
  const recentProducts = recentIds
    .map(rid => products.find(p => p.id === rid))
    .filter(Boolean)
    .slice(0, 4)

  const available = product.inStock !== false

  function handleAddToCart() {
    if (!available) return
    addToCart(product, quantity, product.weights[weightIndex])
    toast.success(`${quantity}× ${product.name} (${product.weights[weightIndex].size}) added to cart!`)
  }

  function handleBuyNow() {
    if (!available) return
    addToCart(product, quantity, product.weights[weightIndex])
    navigate('/checkout')
  }

  function handleWishlist() {
    toggleWishlist(product.id)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist!')
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="product-detail__back">
          <FiArrowLeft size={18} /> Back
        </button>

        <div className="product-detail">
          <div className="product-detail__image-section">
            <div className="product-detail__image-wrap" style={{ marginBottom: '15px' }}>
              <img
                src={product.images[imageIndex]}
                alt={product.name}
                className="product-detail__image"
                onError={(e) => {
                  e.target.onerror = null; e.target.src = '/images/placeholder.svg'
                }}
              />
              {product.featured && (
                <span className="badge badge-gold product-detail__badge">Premium</span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="product-detail__gallery" style={{ display: 'flex', gap: '10px' }}>
                {product.images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    aria-label={`Show photo ${idx + 1} of ${product.images.length}`}
                    aria-pressed={imageIndex === idx}
                    style={{
                      cursor: 'pointer',
                      border: imageIndex === idx ? '2px solid #C49A45' : '2px solid transparent',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      width: '60px',
                      height: '60px',
                      flexShrink: 0,
                      padding: 0,
                      background: 'none'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail__info">
            <span className="product-detail__category">{product.category}</span>
            <h1 className="product-detail__name">{product.name}</h1>

            {/* Weight Selection */}
            <div className="product-detail__weights" style={{ margin: '15px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.weights.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => setWeightIndex(idx)}
                  className={`btn ${weightIndex === idx ? 'btn-gold' : 'btn-outline'}`}
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  {w.size}
                </button>
              ))}
            </div>

            <div className="product-detail__price-row">
              <span className="product-detail__price">{formatPrice(product.weights[weightIndex].price)}</span>
            </div>

            <p className="product-detail__desc">{product.description}</p>

            {product.nutrition && (
              <div className="product-detail__nutrition">
                <h4 className="product-detail__nutrition-title">
                  <FiPackage size={16} /> Nutrition Facts <span>(per 100g)</span>
                </h4>
                <div className="product-detail__nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-item__value">{product.nutrition.calories}</span>
                    <span className="nutrition-item__label">Calories</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-item__value">{product.nutrition.protein}</span>
                    <span className="nutrition-item__label">Protein</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-item__value">{product.nutrition.fat}</span>
                    <span className="nutrition-item__label">Fat</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-item__value">{product.nutrition.fiber}</span>
                    <span className="nutrition-item__label">Fiber</span>
                  </div>
                </div>
              </div>
            )}

            <div className="product-detail__actions">
              <div className="product-detail__qty">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="product-detail__qty-btn"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={16} />
                </button>
                <span className="product-detail__qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="product-detail__qty-btn"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={16} />
                </button>
              </div>

              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} id="add-to-cart-btn" disabled={!available}>
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button className="btn btn-gold btn-lg" onClick={handleBuyNow} disabled={!available}>
                Buy Now
              </button>
              <button
                className={`product-detail__wish-btn ${inWishlist ? 'product-detail__wish-btn--active' : ''}`}
                onClick={handleWishlist}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <FiHeart size={20} />
              </button>
            </div>

            <div className="product-detail__stock">
              {product.inStock ? (
                <span className="badge badge-green">✓ In Stock</span>
              ) : (
                <span className="badge badge-danger">Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="product-detail__related">
            <h3>You May Also Like</h3>
            <div className="section-divider" style={{ margin: '0.5rem 0 1.5rem' }}></div>
            <div className="grid-4">
              {relatedProducts.map(p => (
                <Link to={`/products/${p.id}`} key={p.id} className="related-card card">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="related-card__img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null; e.target.src = '/images/placeholder.svg'
                    }}
                  />
                  <div className="related-card__info">
                    <h4>{p.name}</h4>
                    <span>From {formatPrice(p.weights[0].price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <div className="product-detail__related">
            <h3>Recently Viewed</h3>
            <div className="section-divider" style={{ margin: '0.5rem 0 1.5rem' }}></div>
            <div className="grid-4">
              {recentProducts.map(p => (
                <Link to={`/products/${p.id}`} key={p.id} className="related-card card">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="related-card__img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null; e.target.src = '/images/placeholder.svg'
                    }}
                  />
                  <div className="related-card__info">
                    <h4>{p.name}</h4>
                    <span>From {formatPrice(p.weights[0].price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add-to-Cart bar (mobile only) */}
      <div className="product-sticky-bar">
        <div className="product-sticky-bar__info">
          <span className="product-sticky-bar__name">{product.name}</span>
          <span className="product-sticky-bar__price">{formatPrice(product.weights[weightIndex].price)}</span>
        </div>
        <button className="btn btn-primary" onClick={handleAddToCart} disabled={!available}>
          <FiShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  )
}
