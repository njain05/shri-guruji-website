import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiPackage } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/payment'
import toast from 'react-hot-toast'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, products } = useProducts()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [weightIndex, setWeightIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    setQuantity(1)
    setWeightIndex(0)
    setImageIndex(0)
  }, [id])

  const product = getProduct(id)

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

  function handleAddToCart() {
    addToCart(product, quantity, product.weights[weightIndex])
    toast.success(`${quantity}x ${product.name} (${product.weights[weightIndex].size}) added to cart!`)
  }

  function handleBuyNow() {
    addToCart(product, quantity, product.weights[weightIndex])
    navigate('/checkout')
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
                  e.target.src = `https://via.placeholder.com/600x600/F5F0E8/5C3D2E?text=${encodeURIComponent(product.name)}`
                }}
              />
              {product.featured && (
                <span className="badge badge-gold product-detail__badge">Premium</span>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="product-detail__gallery" style={{ display: 'flex', gap: '10px' }}>
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setImageIndex(idx)}
                  style={{ 
                    cursor: 'pointer', 
                    border: imageIndex === idx ? '2px solid #C49A45' : '2px solid transparent',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    width: '60px',
                    height: '60px'
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-detail__info">
            <span className="product-detail__category">{product.category}</span>
            <h1 className="product-detail__name">{product.name}</h1>
            
            {/* Weight Selection */}
            <div className="product-detail__weights" style={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
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
                >
                  <FiMinus size={16} />
                </button>
                <span className="product-detail__qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="product-detail__qty-btn"
                >
                  <FiPlus size={16} />
                </button>
              </div>

              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} id="add-to-cart-btn">
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button className="btn btn-gold btn-lg" onClick={handleBuyNow}>
                Buy Now
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
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x300/F5F0E8/5C3D2E?text=${encodeURIComponent(p.name)}`
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
    </div>
  )
}
