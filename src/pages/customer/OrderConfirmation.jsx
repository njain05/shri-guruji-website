import { useLocation, Link, Navigate } from 'react-router-dom'
import { FiCheckCircle, FiPackage, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { formatPrice } from '../../utils/payment'
import './OrderConfirmation.css'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card card">
          <div className="confirmation-card__header">
            <div className="confirmation-card__icon">
              <FiCheckCircle size={48} />
            </div>
            <h1 className="confirmation-card__title">Order Placed Successfully!</h1>
            <p className="confirmation-card__subtitle">
              Thank you for ordering from Shri Guru Ji Dry Fruits
            </p>
          </div>

          <div className="confirmation-card__order-id">
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>

          <div className="confirmation-card__sections">
            <div className="confirmation-section">
              <h3><FiPackage size={18} /> Order Details</h3>
              <div className="confirmation-items">
                {order.items.map((item, i) => (
                  <div key={`${item.id}-${item.weight}-${i}`} className="confirmation-item">
                    <div className="confirmation-item__info">
                      <span className="confirmation-item__name">{item.name}</span>
                      <span className="confirmation-item__meta">{item.weight} × {item.quantity}</span>
                    </div>
                    <span className="confirmation-item__price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="confirmation-totals">
                <div className="confirmation-totals__row">
                  <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="confirmation-totals__row">
                  <span>Delivery</span>
                  <span>{order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}</span>
                </div>
                <div className="confirmation-totals__divider"></div>
                <div className="confirmation-totals__row confirmation-totals__row--total">
                  <span>Total</span><span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-section">
              <h3><FiMapPin size={18} /> Shipping Address</h3>
              <div className="confirmation-address">
                <strong>{order.customer.name}</strong>
                <p>{order.customer.address}</p>
                <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                <p>Phone: {order.customer.phone}</p>
              </div>
            </div>

            <div className="confirmation-section">
              <h3>Payment Method</h3>
              <div className="confirmation-payment">
                <span className="badge badge-gold">{order.paymentMethod}</span>
                <span className="badge badge-green">{order.paymentMethod === 'Cash on Delivery' ? 'Pay on delivery' : 'Payment initiated'}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-card__actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Continue Shopping <FiArrowRight size={18} />
            </Link>
            <Link to="/" className="btn btn-secondary btn-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
