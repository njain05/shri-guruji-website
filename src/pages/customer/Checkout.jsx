import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { FiCreditCard, FiTruck, FiSmartphone } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
// import { useOrders } from '../../context/OrderContext'
import { formatPrice, generateUPILink, MERCHANT_UPI_ID, generateOrderId } from '../../utils/payment'
import toast from 'react-hot-toast'
import './Checkout.css'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, getCartTotal, clearCart } = useCart()
  // const { placeOrder } = useOrders()

  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [showUPIQR, setShowUPIQR] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [errors, setErrors] = useState({})

  const subtotal = getCartTotal()
  const deliveryCharge = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryCharge

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

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
    else if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = 'Enter valid 10-digit phone number'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(formData.pincode.trim())) newErrors.pincode = 'Enter valid 6-digit pincode'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handlePlaceOrder() {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    if (paymentMethod === 'upi') {
      setShowUPIQR(true)
      return
    }

    // Cash on Delivery
    await submitOrder()
  }

  async function submitOrder() {
    /* 
    const orderId = generateOrderId()
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
      total,
      paymentMethod: paymentMethod === 'upi' ? 'UPI / Google Pay' : 'Cash on Delivery'
    }

    await placeOrder(order)
    clearCart()
    toast.success('Order placed successfully!')
    navigate('/order-confirmation', { state: { order } })
    */

    // New WhatsApp Flow
    const brandPhoneNumber = '919999999999' // Dummy Indian Number
    
    let message = `*New Order - Shri Guru Ji Dry Fruits* 🥜\n\n`
    message += `*Customer Details:*\n`
    message += `Name: ${formData.name}\n`
    message += `Phone: ${formData.phone}\n`
    if (formData.email) message += `Email: ${formData.email}\n`
    message += `Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\n\n`
    
    message += `*Order Items:*\n`
    cart.forEach(item => {
      message += `- ${item.name} (${item.weight}) x ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`
    })
    
    message += `\n*Billing:*\n`
    message += `Subtotal: ${formatPrice(subtotal)}\n`
    message += `Delivery: ${deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}\n`
    message += `*Total Amount: ${formatPrice(total)}*\n\n`
    
    message += `*Payment Method:* ${paymentMethod === 'upi' ? 'UPI / Google Pay' : 'Cash on Delivery'}\n`
    if (paymentMethod === 'upi') {
      message += `_(Note: I have completed the UPI payment)_`
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${brandPhoneNumber}?text=${encodedMessage}`

    clearCart()
    toast.success('Redirecting to WhatsApp to complete your order!')
    window.open(whatsappUrl, '_blank')
    navigate('/')
  }

  const upiLink = generateUPILink(total, 'GURUJI-' + Date.now())

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
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'input-error' : ''}
                    id="checkout-name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={errors.phone ? 'input-error' : ''}
                    id="checkout-phone"
                  />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Email (optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    id="checkout-email"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Full Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Flat no., Street, Locality"
                    rows="3"
                    className={errors.address ? 'input-error' : ''}
                    id="checkout-address"
                  />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={errors.city ? 'input-error' : ''}
                    id="checkout-city"
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={errors.state ? 'input-error' : ''}
                    id="checkout-state"
                  />
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    className={errors.pincode ? 'input-error' : ''}
                    id="checkout-pincode"
                  />
                  {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section card">
              <h3 className="checkout-section__title">
                <FiCreditCard size={20} /> Payment Method
              </h3>

              <div className="payment-options">
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
                <div key={item.id} className="checkout-summary__item">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="checkout-summary__item-img"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/60x60/F5F0E8/5C3D2E?text=${encodeURIComponent(item.name)}`
                    }}
                  />
                  <div className="checkout-summary__item-info">
                    <span className="checkout-summary__item-name">{item.name}</span>
                    <span className="checkout-summary__item-qty">Qty: {item.quantity}</span>
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
                <span>{deliveryCharge === 0 ? <span className="text-green">FREE</span> : formatPrice(deliveryCharge)}</span>
              </div>
              <div className="checkout-summary__divider"></div>
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
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
                  Scan this QR code with Google Pay, PhonePe, Paytm, or any UPI app
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
