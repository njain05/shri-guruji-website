import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useCart } from '../../context/CartContext'
import { useOrders } from '../../context/OrderContext'
import { formatPrice, generateUPILink, MERCHANT_UPI_ID, UPI_CONFIGURED, generateOrderId } from '../../utils/payment'
import { BRAND, deliveryFor } from '../../data/brand'
import { formatINR } from '../../data/glossary'
import toast from 'react-hot-toast'

const GIFT_CHARGE = 50

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

function Field({ id, label, error, hint, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[0.95rem] text-muted mb-1.5">{label}</label>
      {children}
      {error
        ? <p id={`${id}-error`} className="text-crimson text-[0.9rem] mt-1.5">{error}</p>
        : hint && <p className="text-faint text-[0.88rem] mt-1.5">{hint}</p>}
    </div>
  )
}

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

  useEffect(() => {
    if (cart.length === 0) navigate('/cart')
  }, [cart.length, navigate])

  const subtotal = getCartTotal()
  const deliveryCharge = deliveryFor(subtotal)
  const giftCharge = giftPackaging ? GIFT_CHARGE : 0
  const total = subtotal + deliveryCharge + giftCharge

  const upiLink = useMemo(() => generateUPILink(total, generateOrderId()), [total])

  if (cart.length === 0) return null

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  function validateForm() {
    const e = {}
    if (!formData.name.trim()) e.name = 'Enter the name to deliver to'
    if (!formData.phone.trim()) e.phone = 'Enter a mobile number'
    else if (!/^\d{10}$/.test(formData.phone.trim())) e.phone = 'Use 10 digits, without +91'
    if (!formData.address.trim()) e.address = 'Enter the delivery address'
    if (!formData.city.trim()) e.city = 'Enter the city'
    if (!formData.state) e.state = 'Choose a state'
    if (!formData.pincode.trim()) e.pincode = 'Enter the pincode'
    else if (!/^\d{6}$/.test(formData.pincode.trim())) e.pincode = 'Pincodes have 6 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handlePlaceOrder() {
    if (!validateForm()) {
      toast.error('A few details need fixing before we can send this')
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
    if (giftPackaging) message += `Gift Packaging: ${formatPrice(GIFT_CHARGE)}\n`
    message += `*Total Amount: ${formatPrice(total)}*\n\n`

    message += `*Payment Method:* ${paymentMethod === 'upi' ? 'UPI / Google Pay' : 'Cash on Delivery'}\n`
    if (giftPackaging) message += `🎁 *Gift Packaging requested*\n`
    if (paymentMethod === 'upi') message += `_(Note: I have completed the UPI payment)_`

    const whatsappUrl = `https://wa.me/${brandPhoneNumber}?text=${encodeURIComponent(message)}`

    const order = {
      id: orderId,
      customer: formData,
      items: cart.map(item => ({
        id: item.id, name: item.name, price: item.price,
        quantity: item.quantity, weight: item.weight
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
    toast.success('Order sent — we will confirm on WhatsApp')
    navigate('/order-confirmation', { state: { order } })
  }

  const inputProps = (name) => ({
    id: `checkout-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `checkout-${name}-error` : undefined,
    className: `field ${errors[name] ? '!border-crimson' : ''}`,
  })

  return (
    <div className="container-page pt-10 sm:pt-14">
      <h1 className="font-display font-normal text-[clamp(2.6rem,5vw,3.6rem)] leading-none tracking-[-0.02em]">Checkout</h1>
      <p className="text-muted text-lg mt-2">
        We'll send your order to us on WhatsApp and confirm it there.
      </p>

      <div className="mt-9 grid lg:grid-cols-[1fr_24rem] gap-8 lg:gap-12 items-start">
        <div className="space-y-6">
          <section className="rounded-[var(--radius-panel)] border hairline p-6 sm:p-7">
            <h2 className="font-display text-2xl">Where should it go?</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <Field id="checkout-name" label="Full name" error={errors.name}>
                <input type="text" autoComplete="name" placeholder="Name on the parcel" {...inputProps('name')} />
              </Field>
              <Field id="checkout-phone" label="Mobile number" error={errors.phone} hint="For the courier and our WhatsApp confirmation">
                <input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10 digits" {...inputProps('phone')} />
              </Field>
              <Field id="checkout-email" label="Email (optional)" className="sm:col-span-2">
                <input type="email" autoComplete="email" placeholder="you@example.com" {...inputProps('email')} />
              </Field>
              <Field id="checkout-address" label="Address" error={errors.address} className="sm:col-span-2">
                <textarea rows={3} autoComplete="street-address" placeholder="House or flat, street, area, landmark" {...inputProps('address')} />
              </Field>
              <Field id="checkout-city" label="City" error={errors.city}>
                <input type="text" autoComplete="address-level2" {...inputProps('city')} />
              </Field>
              <Field id="checkout-state" label="State" error={errors.state}>
                <select autoComplete="address-level1" {...inputProps('state')}>
                  <option value="">Choose a state</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field id="checkout-pincode" label="Pincode" error={errors.pincode}>
                <input type="text" inputMode="numeric" autoComplete="postal-code" placeholder="6 digits" {...inputProps('pincode')} />
              </Field>
            </div>
          </section>

          <section className="rounded-[var(--radius-panel)] border hairline p-6 sm:p-7">
            <h2 className="font-display text-2xl">Is it a gift?</h2>
            <label className={`mt-4 flex items-start gap-4 rounded-[var(--radius-field)] border p-4 cursor-pointer transition-colors ${
              giftPackaging ? 'border-olive bg-pista' : 'hairline hover:bg-well'
            }`}>
              <input type="checkbox" checked={giftPackaging} onChange={(e) => setGiftPackaging(e.target.checked)}
                className="mt-1 w-4.5 h-4.5 accent-[var(--color-olive)]" />
              <span>
                <span className="block">Pack it in a gift box <span className="text-muted tabular-nums">+{formatINR(GIFT_CHARGE)}</span></span>
                <span className="block text-muted text-[0.95rem] mt-0.5">Sealed in a box with a ribbon, for festivals and visits.</span>
              </span>
            </label>
          </section>

          <section className="rounded-[var(--radius-panel)] border hairline p-6 sm:p-7">
            <h2 className="font-display text-2xl">How will you pay?</h2>
            <div className="mt-4 space-y-3" role="radiogroup" aria-label="Payment method">
              {UPI_CONFIGURED && (
                <label className={`flex items-start gap-4 rounded-[var(--radius-field)] border p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'upi' ? 'border-olive bg-pista' : 'hairline hover:bg-well'
                }`}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'}
                    onChange={() => { setPaymentMethod('upi'); setShowUPIQR(false) }}
                    className="mt-1 accent-[var(--color-olive)]" />
                  <span>
                    <span className="block">UPI</span>
                    <span className="block text-muted text-[0.95rem]">Google Pay, PhonePe, Paytm or any UPI app</span>
                  </span>
                </label>
              )}
              <label className={`flex items-start gap-4 rounded-[var(--radius-field)] border p-4 cursor-pointer transition-colors ${
                paymentMethod === 'cod' ? 'border-olive bg-pista' : 'hairline hover:bg-well'
              }`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'}
                  onChange={() => { setPaymentMethod('cod'); setShowUPIQR(false) }}
                  className="mt-1 accent-[var(--color-olive)]" />
                <span>
                  <span className="block">Cash on delivery</span>
                  <span className="block text-muted text-[0.95rem]">Pay when the parcel reaches you</span>
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 rounded-[var(--radius-panel)] bg-well p-6">
          <h2 className="font-display text-2xl">Your order</h2>

          <ul className="mt-4 space-y-3">
            {cart.map(item => (
              <li key={item.cartId} className="flex items-center gap-3">
                <div className="w-14 h-14 shrink-0 bg-paper rounded-[var(--radius-field)] overflow-hidden">
                  <img src={item.images[0]} alt="" className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.svg' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate">{item.name}</p>
                  <p className="text-faint text-[0.9rem] tabular-nums">{item.weight} × {item.quantity}</p>
                </div>
                <span className="tabular-nums">{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 pt-4 border-t hairline space-y-2">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="tabular-nums">{deliveryCharge === 0 ? 'Free' : formatINR(deliveryCharge)}</dd></div>
            {giftPackaging && (
              <div className="flex justify-between"><dt className="text-muted">Gift box</dt><dd className="tabular-nums">{formatINR(GIFT_CHARGE)}</dd></div>
            )}
            <div className="flex justify-between border-t hairline pt-3 mt-3 text-lg">
              <dt>Total</dt><dd className="tabular-nums font-semibold">{formatINR(total)}</dd>
            </div>
          </dl>
          {deliveryCharge > 0 && (
            <p className="text-faint text-[0.9rem] mt-2">
              Add {formatINR(BRAND.delivery.freeAbove - subtotal)} more for free delivery. <Link to="/products" className="underline underline-offset-4 hover:text-ink">Keep shopping</Link>
            </p>
          )}

          {!showUPIQR ? (
            <button onClick={handlePlaceOrder} className="button-primary w-full mt-6 !py-3.5" id="place-order-btn">
              {paymentMethod === 'cod' ? 'Place order' : 'Continue to UPI'}
            </button>
          ) : (
            <div className="mt-6 rounded-[var(--radius-panel)] bg-paper p-5 text-center">
              <h3 className="font-display text-xl">Scan to pay</h3>
              <p className="text-muted text-[0.95rem] mt-1">Use any UPI app</p>
              <div className="mt-4 inline-block p-3 bg-paper border hairline rounded-[var(--radius-field)]">
                <QRCodeSVG value={upiLink} size={184} bgColor="#FFFFFF" fgColor="#23281F" level="H" />
              </div>
              <p className="mt-3 tabular-nums">{formatINR(total)} to <span className="font-medium">{MERCHANT_UPI_ID}</span></p>
              <a href={upiLink} className="button-quiet w-full mt-4">Open a UPI app</a>
              <button onClick={submitOrder} className="button-primary w-full mt-2.5">I've paid, send my order</button>
              <button onClick={() => setShowUPIQR(false)} className="mt-3 text-muted text-[0.95rem] underline underline-offset-4">
                Choose another way to pay
              </button>
            </div>
          )}

          <ul className="mt-6 space-y-1.5 text-[0.9rem] text-muted">
            <li>FSSAI licence {BRAND.fssai}</li>
            <li>Weighed and packed to order in {BRAND.city}</li>
            <li>Confirmed with you on WhatsApp</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
