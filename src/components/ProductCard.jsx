import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice } from '../utils/payment'
import toast from 'react-hot-toast'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef(null)
  const inWishlist = isInWishlist(product.id)

  // Close picker on outside click
  useEffect(() => {
    if (!showPicker) return
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPicker])

  function handleCartClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (product.weights.length === 1) {
      addToCart(product, 1, product.weights[0])
      toast.success(`${product.name} (${product.weights[0].size}) added!`)
      return
    }
    setShowPicker(prev => !prev)
  }

  function handlePickSize(e, variant) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1, variant)
    toast.success(`${product.name} (${variant.size}) added to cart!`)
    setShowPicker(false)
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist!')
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card card" id={`product-${product.id}`}>
      <div className="product-card__image-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x400/F5F0E8/5C3D2E?text=${encodeURIComponent(product.name)}`
          }}
        />
        {product.featured && (
          <span className="product-card__badge badge badge-gold">Premium</span>
        )}

        {/* Wishlist button */}
        <button
          className={`product-card__wish-btn ${inWishlist ? 'product-card__wish-btn--active' : ''}`}
          onClick={handleWishlist}
          title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <FiHeart size={16} />
        </button>

        {/* Cart button + size picker */}
        <div ref={pickerRef} className="product-card__cart-wrap">
          {showPicker && (
            <div className="product-card__size-picker">
              {product.weights.map(w => (
                <button
                  key={w.size}
                  className="product-card__size-opt"
                  onClick={(e) => handlePickSize(e, w)}
                >
                  <span className="product-card__size-opt-label">{w.size}</span>
                  <span className="product-card__size-opt-price">{formatPrice(w.price)}</span>
                </button>
              ))}
            </div>
          )}
          <button className="product-card__cart-btn" onClick={handleCartClick} title="Add to Cart">
            <FiShoppingCart size={18} />
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__bottom">
          <span className="product-card__price">From {formatPrice(product.weights[0].price)}</span>
        </div>
      </div>
    </Link>
  )
}
