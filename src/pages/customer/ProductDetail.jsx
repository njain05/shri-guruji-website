import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiMinus, FiPlus, FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import ProductCard from '../../components/ProductCard'
import { hindiFor, glossFor, formatINR, perKilo } from '../../data/glossary'
import { BRAND } from '../../data/brand'

function getRecentlyViewed(currentId) {
  try {
    const ids = JSON.parse(localStorage.getItem('guruji_recent') || '[]')
    return ids.filter(id => id !== currentId).slice(0, 4)
  } catch { return [] }
}

function addToRecentlyViewed(id) {
  try {
    const ids = JSON.parse(localStorage.getItem('guruji_recent') || '[]')
    localStorage.setItem('guruji_recent', JSON.stringify([id, ...ids.filter(i => i !== id)].slice(0, 10)))
  } catch { /* storage unavailable — recently viewed is a convenience only */ }
}

const NUTRITION = [
  ['calories', 'Energy'],
  ['protein', 'Protein'],
  ['fat', 'Fat'],
  ['fiber', 'Fibre'],
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, products, loading } = useProducts()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [weightIndex, setWeightIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)

  const product = getProduct(id)

  useEffect(() => { setQuantity(1); setWeightIndex(0); setImageIndex(0) }, [id])
  useEffect(() => { if (product) addToRecentlyViewed(id) }, [id, product])

  // Products load asynchronously; without this the page flashed "not found"
  // on every direct visit or refresh before the catalogue arrived.
  if (loading) {
    return <div className="container-page py-32 text-center text-muted">Fetching this good…</div>
  }

  if (!product) {
    return (
      <div className="container-page py-28 text-center">
        <h1 className="font-display text-3xl">We couldn't find that one</h1>
        <p className="text-muted mt-2">It may have been renamed or taken off the shelf.</p>
        <Link to="/products" className="button-primary mt-7">Back to the shop</Link>
      </div>
    )
  }

  const available = product.inStock !== false
  const weight = product.weights[weightIndex]
  const kilo = perKilo(weight)
  const saved = isInWishlist(product.id)
  const hindi = hindiFor(product)

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const recent = getRecentlyViewed(id).map(rid => products.find(p => p.id === rid)).filter(Boolean).slice(0, 4)

  function handleAdd() {
    if (!available) return
    addToCart(product, quantity, weight)
    toast.success(`${quantity} × ${product.name} ${weight.size} added`)
  }

  function handleBuyNow() {
    if (!available) return
    addToCart(product, quantity, weight)
    navigate('/checkout')
  }

  function handleSave() {
    toggleWishlist(product.id)
    toast.success(saved ? 'Removed from saved' : 'Saved for later')
  }

  return (
    <div className="container-page pt-6 pb-28 lg:pb-0">
      <nav aria-label="Breadcrumb" className="text-[0.95rem] text-faint">
        <Link to="/products" className="hover:text-ink">Shop</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">{product.category}</Link>
      </nav>

      <div className="mt-5 grid lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative bg-well rounded-[var(--radius-panel)] aspect-square overflow-hidden">
            <img
              src={product.images[imageIndex]}
              alt={product.name}
              className="photo-blend absolute inset-0 w-full h-full object-contain p-10"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.svg' }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3" role="group" aria-label="Photos">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImageIndex(i)}
                  aria-label={`Photo ${i + 1} of ${product.images.length}`}
                  aria-pressed={i === imageIndex}
                  className={`w-20 h-20 bg-well rounded-[var(--radius-media)] overflow-hidden border-2 transition-colors ${
                    i === imageIndex ? 'border-olive' : 'border-transparent hover:border-well-deep'
                  }`}
                >
                  <img src={img} alt="" className="photo-blend w-full h-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buying */}
        <div className="lg:pt-2">
          <h1 className="font-display font-normal text-[clamp(2.5rem,4.6vw,3.6rem)] leading-none tracking-[-0.02em]">
            {product.name}
          </h1>
          <p className="text-muted text-lg mt-2">
            {hindi && <span lang="hi" className="mr-3">{hindi}</span>}
            <span className="text-faint">{glossFor(product)}</span>
          </p>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-display text-[2.4rem] leading-none tabular-nums">{formatINR(weight.price)}</span>
            {kilo && <span className="text-faint tabular-nums">{formatINR(kilo)} per kilo</span>}
          </div>

          <fieldset className="mt-7">
            <legend className="text-[0.95rem] text-muted mb-2.5">Pack size</legend>
            <div className="flex flex-wrap gap-2">
              {product.weights.map((w, i) => {
                const on = i === weightIndex
                return (
                  <button
                    key={w.size}
                    onClick={() => setWeightIndex(i)}
                    aria-pressed={on}
                    className={`min-w-[6.5rem] rounded-[var(--radius-field)] border px-4 py-2.5 text-left transition-colors ${
                      on ? 'border-olive bg-pista' : 'hairline hover:bg-well'
                    }`}
                  >
                    <span className="block tabular-nums">{w.size}</span>
                    <span className="block text-[0.9rem] text-muted tabular-nums">{formatINR(w.price)}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-[var(--radius-field)] border hairline">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}
                aria-label="Decrease quantity" className="grid place-items-center w-11 h-12 disabled:text-faint">
                <FiMinus size={16} />
              </button>
              <span className="w-8 text-center tabular-nums" aria-live="polite">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} aria-label="Increase quantity"
                className="grid place-items-center w-11 h-12">
                <FiPlus size={16} />
              </button>
            </div>

            <button onClick={handleAdd} disabled={!available} className="button-primary flex-1 sm:flex-none" id="add-to-cart-btn">
              Add to basket
            </button>
            <button onClick={handleBuyNow} disabled={!available} className="button-quiet disabled:opacity-50 disabled:cursor-not-allowed">
              Buy now
            </button>
            <button
              onClick={handleSave}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from saved' : 'Save for later'}
              className={`grid place-items-center w-12 h-12 rounded-[var(--radius-field)] border transition-colors ${
                saved ? 'bg-crimson border-crimson text-paper' : 'hairline hover:bg-well'
              }`}
            >
              <FiHeart size={18} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-[0.98rem]">
            <span className={`w-2 h-2 rounded-full ${available ? 'bg-olive' : 'bg-crimson'}`} aria-hidden="true" />
            {available
              ? <span>In stock, packed to order in {BRAND.city}</span>
              : <span>Out of stock for now</span>}
          </p>

          <p className="text-muted text-lg leading-relaxed mt-8 max-w-[58ch]">{product.description}</p>

          {product.nutrition && (
            <div className="mt-8 rounded-[var(--radius-panel)] bg-well p-5">
              <h2 className="font-display text-lg">Nutrition <span className="text-faint text-base font-sans">per 100 g</span></h2>
              <dl className="mt-3 grid grid-cols-4 gap-3">
                {NUTRITION.map(([key, label]) => (
                  <div key={key}>
                    <dt className="text-faint text-[0.9rem]">{label}</dt>
                    <dd className="tabular-nums text-lg">{product.nutrition[key] || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display font-normal text-[2rem] mb-6">More {product.category.toLowerCase()}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display font-normal text-[2rem] mb-6">You looked at</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {recent.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Mobile: keep the buy button reachable */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-paper/95 backdrop-blur border-t hairline">
        <div className="container-page flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="font-display truncate">{product.name} <span className="text-faint font-sans">{weight.size}</span></p>
            <p className="tabular-nums">{formatINR(weight.price * quantity)}</p>
          </div>
          <button onClick={handleAdd} disabled={!available} className="button-primary !py-3">Add to basket</button>
        </div>
      </div>
    </div>
  )
}
