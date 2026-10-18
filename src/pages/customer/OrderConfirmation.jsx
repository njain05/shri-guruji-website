import { useLocation, Link, Navigate } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import { formatINR } from '../../data/glossary'
import { BRAND } from '../../data/brand'

export default function OrderConfirmation() {
  const order = useLocation().state?.order
  if (!order) return <Navigate to="/" replace />

  return (
    <div className="container-page pt-12 sm:pt-16 max-w-3xl">
      <div className="grid place-items-center w-14 h-14 rounded-full bg-pista text-olive">
        <FiCheck size={28} />
      </div>
      <h1 className="font-display font-normal text-[clamp(2.4rem,5vw,3.4rem)] leading-none tracking-[-0.02em] mt-6">
        Thank you, {order.customer.name.split(' ')[0]}
      </h1>
      <p className="text-muted text-lg mt-3 max-w-[56ch]">
        Your order has reached us. We'll confirm it on WhatsApp at {order.customer.phone},
        and message you again when it leaves {BRAND.city}.
      </p>

      <div className="mt-8 rounded-[var(--radius-panel)] bg-pista px-5 py-4 flex flex-wrap justify-between gap-2">
        <span className="text-muted">Order number</span>
        <span className="font-medium tabular-nums tracking-wide">{order.id}</span>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <section className="rounded-[var(--radius-panel)] border hairline p-6 sm:col-span-2">
          <h2 className="font-display text-xl">What you ordered</h2>
          <ul className="mt-3 divide-y hairline">
            {order.items.map((item, i) => (
              <li key={`${item.id}-${item.weight}-${i}`} className="py-2.5 flex justify-between gap-4">
                <span>{item.name} <span className="text-faint tabular-nums">{item.weight} × {item.quantity}</span></span>
                <span className="tabular-nums">{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 pt-3 border-t hairline space-y-1.5">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatINR(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="tabular-nums">{order.deliveryCharge === 0 ? 'Free' : formatINR(order.deliveryCharge)}</dd></div>
            {order.giftPackaging && (
              <div className="flex justify-between"><dt className="text-muted">Gift box</dt><dd className="tabular-nums">{formatINR(order.giftCharge || 0)}</dd></div>
            )}
            <div className="flex justify-between text-lg pt-1"><dt>Total</dt><dd className="tabular-nums font-semibold">{formatINR(order.total)}</dd></div>
          </dl>
        </section>

        <section className="rounded-[var(--radius-panel)] border hairline p-6">
          <h2 className="font-display text-xl">Delivering to</h2>
          <address className="not-italic text-muted mt-2 leading-relaxed">
            <span className="text-ink">{order.customer.name}</span><br />
            {order.customer.address}<br />
            {order.customer.city}, {order.customer.state} {order.customer.pincode}
          </address>
        </section>

        <section className="rounded-[var(--radius-panel)] border hairline p-6">
          <h2 className="font-display text-xl">Payment</h2>
          <p className="text-muted mt-2">{order.paymentMethod}</p>
          <p className="text-faint text-[0.95rem] mt-1">
            {order.paymentMethod === 'Cash on Delivery' ? 'Pay the courier when it arrives.' : 'We will check the payment before packing.'}
          </p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/products" className="button-primary">Keep shopping</Link>
        <Link to="/" className="button-quiet">Back to home</Link>
      </div>
    </div>
  )
}
