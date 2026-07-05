import { Link } from 'react-router-dom'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/payment'
import './Cart.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const subtotal = getCartTotal()
  const deliveryCharge = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryCharge

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <span className="cart-empty__icon">🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items yet. Explore our premium dry fruits collection!</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <FiShoppingBag size={18} /> Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <p className="cart-page__count">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.cartId} className="cart-item card">
                <Link to={`/products/${item.id}`} className="cart-item__image-wrap">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="cart-item__image"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/120x120/F5F0E8/5C3D2E?text=${encodeURIComponent(item.name)}`
                    }}
                  />
                </Link>
                <div className="cart-item__info">
                  <div className="cart-item__top">
                    <div>
                      <Link to={`/products/${item.id}`} className="cart-item__name">{item.name}</Link>
                      <span className="cart-item__weight">{item.weight}</span>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.cartId)}
                      title="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="cart-item__bottom">
                    <div className="cart-item__qty">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="cart-item__qty-btn"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="cart-item__qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="cart-item__qty-btn"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <span className="cart-item__price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}

            <button className="btn btn-sm" onClick={clearCart} style={{ color: 'var(--color-danger)', background: 'none', padding: '0.5rem' }}>
              <FiTrash2 size={14} /> Clear Cart
            </button>
          </div>

          <div className="cart-summary card">
            <h3 className="cart-summary__title">Order Summary</h3>
            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? <span className="text-green">FREE</span> : formatPrice(deliveryCharge)}</span>
              </div>
              {deliveryCharge > 0 && (
                <p className="cart-summary__note">Free delivery on orders above ₹500</p>
              )}
              <div className="cart-summary__divider"></div>
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg cart-summary__checkout" id="checkout-btn">
              Proceed to Checkout <FiArrowRight size={18} />
            </Link>
            <Link to="/products" className="cart-summary__continue">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
