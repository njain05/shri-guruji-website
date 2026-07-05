import { Link } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/payment'
import toast from 'react-hot-toast'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    const defaultVariant = product.weights[0]
    addToCart(product, 1, defaultVariant)
    toast.success(`${product.name} (${defaultVariant.size}) added to cart!`)
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
        <button className="product-card__cart-btn" onClick={handleAddToCart} title="Add to Cart">
          <FiShoppingCart size={18} />
        </button>
      </div>
      <div className="product-card__info">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__bottom">
          <span className="product-card__price">From {formatPrice(product.weights[0].price)}</span>
          <span className="product-card__weight"></span>
        </div>
      </div>
    </Link>
  )
}
