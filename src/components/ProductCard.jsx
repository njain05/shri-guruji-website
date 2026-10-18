import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { hindiFor, lowestPrice, formatINR } from '../data/glossary'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef(null)
  const saved = isInWishlist(product.id)
  const available = product.inStock !== false
  const hindi = hindiFor(product)

  useEffect(() => {
    if (!showPicker) return
    function onDown(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false)
    }
    function onKey(e) { if (e.key === 'Escape') setShowPicker(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [showPicker])

  function stop(e) { e.preventDefault(); e.stopPropagation() }

  function handleAdd(e) {
    stop(e)
    if (!available) return
    if (product.weights.length === 1) {
      addToCart(product, 1, product.weights[0])
      toast.success(`${product.name} ${product.weights[0].size} added`)
      return
    }
    setShowPicker(v => !v)
  }

  function pick(e, w) {
    stop(e)
    addToCart(product, 1, w)
    toast.success(`${product.name} ${w.size} added`)
    setShowPicker(false)
  }

  function handleSave(e) {
    stop(e)
    toggleWishlist(product.id)
    toast.success(saved ? 'Removed from saved' : 'Saved for later')
  }

  return (
    <Link to={`/products/${product.id}`} className="group block" id={`product-${product.id}`}>
      <div className="relative bg-well rounded-[var(--radius-media)] aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="photo-blend absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.svg' }}
        />
        {!available && (
          <span className="absolute top-3 left-3 rounded-[var(--radius-field)] bg-ink px-2.5 py-1 text-[0.8rem] text-paper">
            Out of stock
          </span>
        )}
        <button
          onClick={handleSave}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={saved}
          className={`absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-[var(--radius-field)] transition-colors ${
            saved ? 'bg-crimson text-paper' : 'bg-paper/85 text-ink hover:bg-paper'
          }`}
        >
          <FiHeart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-[1.2rem] leading-snug">{product.name}</h3>
          {hindi && <p className="text-faint text-[0.95rem] leading-tight mt-0.5" lang="hi">{hindi}</p>}
          <p className="text-muted text-[0.95rem] mt-1.5 tabular-nums">
            from <span className="text-ink font-medium">{formatINR(lowestPrice(product))}</span>
          </p>
        </div>

        <div ref={pickerRef} className="relative shrink-0">
          <button
            onClick={handleAdd}
            disabled={!available}
            aria-haspopup={product.weights.length > 1 ? 'menu' : undefined}
            aria-expanded={showPicker}
            aria-label={`Add ${product.name} to basket`}
            className="grid place-items-center w-10 h-10 rounded-[var(--radius-field)] bg-olive text-paper hover:bg-olive-deep transition-colors disabled:bg-well-deep disabled:text-faint disabled:cursor-not-allowed"
          >
            <FiPlus size={18} />
          </button>

          {showPicker && (
            <div
              role="menu"
              className="absolute right-0 bottom-12 z-20 w-48 rounded-[var(--radius-panel)] bg-paper border hairline shadow-[0_14px_34px_-14px_rgba(35,40,31,0.35)] p-1.5"
              onClick={stop}
            >
              <p className="px-3 pt-1.5 pb-1 text-[0.85rem] text-faint">Choose a pack</p>
              {product.weights.map(w => (
                <button
                  key={w.size}
                  role="menuitem"
                  onClick={(e) => pick(e, w)}
                  className="w-full flex items-center justify-between rounded-[var(--radius-field)] px-3 py-2 hover:bg-pista transition-colors"
                >
                  <span className="tabular-nums">{w.size}</span>
                  <span className="tabular-nums font-medium">{formatINR(w.price)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
