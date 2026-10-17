import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { FiCreditCard, FiTruck, FiSmartphone, FiGift, FiShield, FiCheckCircle, FiRefreshCw, FiMessageCircle } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useOrders } from '../../context/OrderContext'
import { formatPrice, generateUPILink, MERCHANT_UPI_ID, UPI_CONFIGURED, generateOrderId } from '../../utils/payment'
import toast from 'react-hot-toast'
import './Checkout.css'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, getCartTotal, clearCart } = useCart()
  const { placeOrder } = useOrders()

  const [paymentMethod, setPaymentMethod] = useState(UPI_CONFIGURED ? 'upi' : 'cod')
  const [showUPIQR, setShowUPIQR] = useState(false)
  const [giftPackaging, setGiftPackaging] = useState(false)
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: ''
  })
  const [errors, setErrors] = useState({})

  // Navigate away if cart is empty — useEffect avoids side effect during render
  useEffect(() => {
    if (cart.length === 0) navigate('/cart')
  }, [cart.length, navigate])

  const subtotal = getCartTotal()
  const deliveryCharge = subtotal >= 500 ? 0 : 50
  const giftCharge = giftPackaging ? 50 : 0
  const total = subtotal + deliveryCharge + giftCharge

  // Generate UPI link only when total changes, not on every render
  const upiLink = useMemo(
    () => generateUPILink(total, generateOrderId()),
    [total]
  )

  if (cart.length === 0) return null

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  function validateForm() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = 'Enter a valid 10-digit number'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'Please select your state'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(formData.pincode.trim())) newErrors.pincode = 'Enter a valid 6-digit pincode'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handlePlaceOrder() {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }
    if (UPI_CONFIGURED && paymentMethod === 'upi') {
      setShowUPIQR(true)
      return
    }
    await submitOrder()
  }

  async function submitOrder() {
    const orderId = generateOrderId()
    const brandPhoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

    let message = `*New Order - Shri Guru Ji Dry Fruits* 🥜\n\n`
    message += `*Order ID:* ${orderId}\n\n`
    message += `*Customer Details:*\n`
    message += `Name: ${formData.name}\n`
    message += `Phone: ${formData.phone}\n`
    if (formData.email) message += `Email: ${formData.email}\n`
    message += `Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n\n`

    message += `*Order Items:*\n`
    cart.forEach(item => {
      message += `- ${item.name} (${item.weight}) × ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`
    })

    message += `\n*Billing:*\n`
    message += `Subtotal: ${formatPrice(subtotal)}\n`
    message += `Delivery: ${deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}\n`
    if (giftPackaging) message += `Gift Packaging: ${formatPrice(50)}\n`
    message += `*Total Amount: ${formatPrice(total)}*\n\n`

    message += `*Payment Method:* ${paymentMethod === 'upi' ? 'UPI / Google Pay' : 'Cash on Delivery'}\n`
    if (giftPackaging) message += `🎁 *Gift Packaging requested*\n`
    if (paymentMethod === 'upi') {
      message += `_(Note: I have completed the UPI payment)_`
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${brandPhoneNumber}?text=${encodedMessage}`

    // Build order object for confirmation page
    const order = {
      id: orderId,
      customer: formData,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight
      })),
      subtotal,
      deliveryCharge,
      giftCharge,
      total,
      paymentMethod: paymentMethod === 'upi' ? 'UPI / Google Pay' : 'Cash on Delivery',
      giftPackaging
    }

    await placeOrder(order)
    window.open(whatsappUrl, '_blank')
    clearCart()
    toast.success('Order sent via WhatsApp!')
    navigate('/order-confirmation', { state: { order } })
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-layout">
          {/* Shipping Form */}
          <div className="checkout-form">
            <div className="checkout-section card">
              <h3 className="checkout-section__title">
                <FiTruck size={20} /> Shipping Information
              </h3>

              <div className="checkout-form__grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-name">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="checkout-name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-phone">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    id="checkout-phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="checkout-email">Email (optional)</label>
                  <input
                    type="email"
                    name="email"
                    id="checkout-email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" htmlFor="checkout-address">Full Address *</label>
                  <textarea
                    name="address"
                    id="checkout-address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Flat no., Street, Locality"
                    rows="3"
                    className={errors.address ? 'input-error' : ''}
                  />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-city">City *</label>
                  <input
                    type="text"
                    name="city"
                    id="checkout-city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-state">State *</label>
                  <select
                    name="state"
                    id="checkout-state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'input-error' : ''}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-pincode">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    id="checkout-pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    className={errors.pincode ? 'input-error' : ''}
                  />
                  {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            {/* Gift Packaging */}
            <div className="checkout-section card">
              <h3 className="checkout-section__title">
                <FiGift size={20} /> Gift Options
              </h3>
              <label className="gift-option">
                <input
                  type="checkbox"
                  checked={giftPackaging}
                  onChange={(e) => setGiftPackaging(e.target.checked)}
                  className="gift-option__checkbox"
                />
                <div className="gift-option__content">
                  <span className="gift-option__label">
                    🎁 Add gift packaging
                    <span className="gift-option__price">+₹50</span>
                  </span>
                  <span className="gift-option__desc">Premium box with ribbon — perfect for festivals & celebrations</span>
                </div>
              </label>
            </div>

            {/* Payment Method */}
            <div className="checkout-section card">
              <h3 className="checkout-section__title">
                <FiCreditCard size={20} /> Payment Method
              </h3>

              <div className="payment-options">
                {UPI_CONFIGURED && (
                <label className={`payment-option ${paymentMethod === 'upi' ? 'payment-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => { setPaymentMethod('upi'); setShowUPIQR(false) }}
                  />
                  <div className="payment-option__content">
                    <FiSmartphone size={24} />
                    <div>
                      <strong>UPI / Google Pay / PhonePe</strong>
                      <span>Pay securely using any UPI app</span>
                    </div>
                  </div>
                </label>
                )}

                <label className={`payment-option ${paymentMethod === 'cod' ? 'payment-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => { setPaymentMethod('cod'); setShowUPIQR(false) }}
                  />
                  <div className="payment-option__content">
                    <FiTruck size={24} />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <span>Pay when your order arrives</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary card">
            <h3 className="checkout-section__title">Order Summary</h3>

            <div className="checkout-summary__items">
              {cart.map(item => (
                <div key={item.cartId} className="checkout-summary__item">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="checkout-summary__item-img"
                    onError={(e) => {
                      e.target.onerror = null; e.target.src = '/images/placeholder.svg'
                    }}
                  />
                  <div className="checkout-summary__item-info">
                    <span className="checkout-summary__item-name">{item.name}</span>
                    <span className="checkout-summary__item-qty">{item.weight} × {item.quantity}</span>
                  </div>
                  <span className="checkout-summary__item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-summary__totals">
              <div className="checkout-summary__row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Delivery</span>
                <span>
                  {deliveryCharge === 0
                    ? <span className="text-green">FREE</span>
                    : formatPrice(deliveryCharge)
                  }
                </span>
              </div>
              {giftPackaging && (
                <div className="checkout-summary__row">
                  <span>🎁 Gift Packaging</span>
                  <span>{formatPrice(50)}</span>
                </div>
              )}
              <div className="checkout-summary__divider"></div>
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="checkout-trust">
              <div className="checkout-trust__item"><FiShield size={14} /> Secure Payment</div>
              <div className="checkout-trust__item"><FiCheckCircle size={14} /> 100% Natural</div>
              <div className="checkout-trust__item"><FiRefreshCw size={14} /> Easy Returns</div>
              <div className="checkout-trust__item"><FiMessageCircle size={14} /> WhatsApp Support</div>
            </div>

            {!showUPIQR ? (
              <button
                className="btn btn-primary btn-lg checkout-summary__pay-btn"
                onClick={handlePlaceOrder}
                id="place-order-btn"
              >
                {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay with UPI'}
              </button>
            ) : (
              <div className="upi-payment">
                <h4 className="upi-payment__title">Scan to Pay</h4>
                <p className="upi-payment__desc">
                  Scan with Google Pay, PhonePe, Paytm, or any UPI app
                </p>
                <div className="upi-payment__qr">
                  <QRCodeSVG
                    value={upiLink}
                    size={200}
                    bgColor="#FFFFFF"
                    fgColor="#3E2518"
                    level="H"
                  />
                </div>
                <p className="upi-payment__amount">
                  Amount: <strong>{formatPrice(total)}</strong>
                </p>
                <p className="upi-payment__upi-id">
                  UPI ID: <strong>{MERCHANT_UPI_ID}</strong>
                </p>
                <a href={upiLink} className="btn btn-gold btn-lg upi-payment__open-btn">
                  Open UPI App
                </a>
                <button
                  className="btn btn-primary btn-lg upi-payment__confirm-btn"
                  onClick={submitOrder}
                >
                  I've Completed Payment ✓
                </button>
                <button
                  className="upi-payment__back"
                  onClick={() => setShowUPIQR(false)}
                >
                  ← Change payment method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
