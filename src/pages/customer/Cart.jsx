import { Link } from 'react-router-dom'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { BRAND, deliveryFor } from '../../data/brand'
import { hindiFor, formatINR } from '../../data/glossary'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const subtotal = getCartTotal()
  const delivery = deliveryFor(subtotal)
  const total = subtotal + delivery
  const threshold = BRAND.delivery.freeAbove
  const remaining = threshold - subtotal
  const progress = Math.min((subtotal / threshold) * 100, 100)
  const units = cart.reduce((n, i) => n + i.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="container-page py-28 text-center">
        <h1 className="font-display font-normal text-[2.6rem]">Your basket is empty</h1>
        <p className="text-muted text-lg mt-2">Pick a few goods and they'll wait for you here.</p>
        <Link to="/products" className="button-primary mt-8">Go to the shop</Link>
      </div>
    )
  }

  return (
    <div className="container-page pt-10 sm:pt-14">
      <h1 className="font-display font-normal text-[clamp(2.6rem,5vw,3.6rem)] leading-none tracking-[-0.02em]">Your basket</h1>
      <p className="text-muted text-lg mt-2">{units} {units === 1 ? 'pack' : 'packs'}</p>

      <div className="mt-9 grid lg:grid-cols-[1fr_22rem] gap-8 lg:gap-12 items-start">
        <div>
          <div className="rounded-[var(--radius-panel)] bg-pista px-5 py-4 mb-6" aria-live="polite">
            {delivery > 0 ? (
              <>
                <p>Add <strong className="font-semibold">{formatINR(remaining)}</strong> more for free delivery.</p>
                <div className="mt-2.5 h-1.5 rounded-full bg-paper/80 overflow-hidden">
                  <div className="h-full bg-olive rounded-full transition-[width] duration-500" style={{ width: `${progress}%` }} />
                </div>
              </>
            ) : (
              <p>Delivery is free on this order.</p>
            )}
          </div>

          <ul className="divide-y hairline border-y hairline">
            {cart.map(item => {
              const hindi = hindiFor(item)
              return (
                <li key={item.cartId} className="py-5 grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr_auto] gap-4 sm:gap-6 items-center">
                  <Link to={`/products/${item.id}`} className="block bg-well rounded-[var(--radius-media)] aspect-square overflow-hidden">
                    <img src={item.images[0]} alt={item.name}
                      className="photo-blend w-full h-full object-contain p-2"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.svg' }} />
                  </Link>

                  <div className="min-w-0">
                    <Link to={`/products/${item.id}`} className="font-display text-xl hover:text-olive">{item.name}</Link>
                    <p className="text-faint text-[0.95rem]">
                      {hindi && <span lang="hi" className="mr-2">{hindi}</span>}
                      <span className="tabular-nums">{item.weight}, {formatINR(item.price)} each</span>
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center rounded-[var(--radius-field)] border hairline">
                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          aria-label={`One less ${item.name} ${item.weight}`} className="grid place-items-center w-9 h-9">
                          <FiMinus size={14} />
                        </button>
                        <span className="w-7 text-center tabular-nums">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          aria-label={`One more ${item.name} ${item.weight}`} className="grid place-items-center w-9 h-9">
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)}
                        className="text-[0.95rem] text-muted underline underline-offset-4 hover:text-crimson">
                        Remove
                      </button>
                      <span className="sm:hidden ml-auto tabular-nums font-medium">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  </div>

                  <span className="hidden sm:block tabular-nums text-lg">{formatINR(item.price * item.quantity)}</span>
                </li>
              )
            })}
          </ul>

          <button onClick={clearCart} className="mt-4 text-[0.95rem] text-muted underline underline-offset-4 hover:text-crimson">
            Empty the basket
          </button>
        </div>

        <aside className="lg:sticky lg:top-28 rounded-[var(--radius-panel)] bg-well p-6">
          <h2 className="font-display text-2xl">Summary</h2>
          <dl className="mt-4 space-y-2.5">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="tabular-nums">{delivery === 0 ? 'Free' : formatINR(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t hairline pt-3 mt-3 text-lg">
              <dt>Total</dt><dd className="tabular-nums font-semibold">{formatINR(total)}</dd>
            </div>
          </dl>
          {delivery > 0 && (
            <p className="text-faint text-[0.92rem] mt-3">Free delivery on orders above {formatINR(threshold)}.</p>
          )}
          <Link to="/checkout" className="button-primary w-full mt-6" id="checkout-btn">Go to checkout</Link>
          <Link to="/products" className="block text-center text-muted mt-4 hover:text-ink">Keep shopping</Link>
        </aside>
      </div>
    </div>
  )
}
