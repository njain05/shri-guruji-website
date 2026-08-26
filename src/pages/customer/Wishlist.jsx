import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiArrowRight } from 'react-icons/fi'
import { useWishlist } from '../../context/WishlistContext'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/payment'
import toast from 'react-hot-toast'
import './Wishlist.css'

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist()
  const { products } = useProducts()
  const { addToCart } = useCart()

  const savedProducts = products.filter(p => wishlist.includes(p.id))

  if (savedProducts.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-empty">
            <span className="wishlist-empty__icon">🤍</span>
            <h2>Your wishlist is empty</h2>
            <p>Save products you love by tapping the heart icon on any product.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Browse Products <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__header">
        <div className="container">
          <h1 className="wishlist-page__title">Saved Items</h1>
          <p className="wishlist-page__count">
            {savedProducts.length} product{savedProducts.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      <div className="container">
        <div className="grid-4">
          {savedProducts.map(product => (
            <div key={product.id} className="wishlist-card card">
              <Link to={`/products/${product.id}`} className="wishlist-card__image-wrap">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="wishlist-card__image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x300/F5F0E8/5C3D2E?text=${encodeURIComponent(product.name)}`
                  }}
                />
              </Link>
              <div className="wishlist-card__info">
                <span className="wishlist-card__category">{product.category}</span>
                <Link to={`/products/${product.id}`} className="wishlist-card__name">
                  {product.name}
                </Link>
                <p className="wishlist-card__price">From {formatPrice(product.weights[0].price)}</p>
                <div className="wishlist-card__actions">
                  <button
                    className="btn btn-primary btn-sm wishlist-card__add-btn"
                    onClick={() => {
                      addToCart(product, 1, product.weights[0])
                      toast.success(`${product.name} (${product.weights[0].size}) added to cart!`)
                    }}
                  >
                    <FiShoppingCart size={14} /> Add to Cart
                  </button>
                  <button
                    className="wishlist-card__remove"
                    onClick={() => toggleWishlist(product.id)}
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    <FiHeart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
