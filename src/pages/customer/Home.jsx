import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { BRAND } from '../../data/brand'
import { glossFor, lowestPrice, formatINR, perKilo } from '../../data/glossary'

function HeroGood({ product }) {
  const { addToCart } = useCart()
  const [idx, setIdx] = useState(product.weights.length > 1 ? 1 : 0)
  const weight = product.weights[idx]
  const kilo = perKilo(weight)

  return (
    <section className="border-b rule">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-ink-60 text-[0.95rem]">{BRAND.masthead}</p>

          <h1 className="font-display text-good leading-[0.92] tracking-[-0.02em] mt-5">
            {product.name}
          </h1>
          <p className="font-display italic text-2xl sm:text-3xl text-ink-40 mt-2">
            {glossFor(product)}
          </p>

          <p className="text-ink-60 leading-relaxed max-w-[52ch] mt-6">
            {product.description}
          </p>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {product.weights.map((w, i) => (
                <button
                  key={w.size}
                  onClick={() => setIdx(i)}
                  aria-pressed={i === idx}
                  className={`px-4 py-2.5 border transition-colors ${
                    i === idx
                      ? 'bg-espresso text-linen border-espresso'
                      : 'bg-transparent text-ink-60 border-espresso/15 hover:border-espresso/40'
                  }`}
                >
                  <span className="tabular-nums">{w.size}</span>
                  <span className="ml-3 tabular-nums">{formatINR(w.price)}</span>
                </button>
              ))}
            </div>

            {kilo && (
              <p className="text-ink-40 text-sm mt-3 tabular-nums">
                {formatINR(kilo)} per kilo
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              onClick={() => {
                addToCart(product, 1, weight)
                toast.success(`${product.name} ${weight.size} added`)
              }}
              className="bg-marigold text-white px-7 py-3.5 font-medium hover:bg-marigold-deep transition-colors"
            >
              Add to basket
            </button>
            <Link to={`/products/${product.id}`} className="text-ink-60 underline underline-offset-4 hover:text-espresso">
              See details
            </Link>
          </div>
        </div>

        <div className="order-first lg:order-last">
          <div className="bg-white border rule aspect-[4/5] flex items-center justify-center p-6">
            <img
              src={product.images[0]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.svg' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function GoodRow({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group grid grid-cols-[64px_1fr_auto] sm:grid-cols-[72px_1fr_auto] gap-4 sm:gap-6 items-center py-5 border-b rule hover:bg-almond/60 transition-colors px-2 -mx-2"
    >
      <div className="w-16 h-16 bg-white border rule flex items-center justify-center p-1.5">
        <img
          src={product.images[0]}
          alt=""
          loading="lazy"
          className="max-w-full max-h-full object-contain"
          onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.svg' }}
        />
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-xl sm:text-2xl leading-tight">{product.name}</h3>
        <p className="font-display italic text-ink-40 text-base">{glossFor(product)}</p>
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm mt-2">
          {product.weights.map(w => (
            <div key={w.size} className="flex gap-1.5">
              <dt className="text-ink-40">{w.size}</dt>
              <dd className="text-ink-60 tabular-nums">{formatINR(w.price)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="text-right shrink-0">
        <span className="block text-ink-40 text-sm">from</span>
        <span className="block text-lg tabular-nums group-hover:text-marigold transition-colors">
          {formatINR(lowestPrice(product))}
        </span>
      </div>
    </Link>
  )
}

export default function Home() {
  const { products, loading } = useProducts()
  const hero = products.find(p => p.featured) || products[0]

  if (loading || !hero) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <p className="text-ink-40">Loading the day's rates…</p>
      </div>
    )
  }

  return (
    <>
      <HeroGood product={hero} />

      {/* Rate list — the native document of this trade */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
        <div className="flex items-baseline justify-between border-b-2 border-espresso pb-3 mb-2">
          <h2 className="font-display text-3xl sm:text-4xl">Everything we stock</h2>
          <span className="text-ink-40 text-sm tabular-nums">{products.length} goods</span>
        </div>

        <div>
          {products.map(p => <GoodRow key={p.id} product={p} />)}
        </div>

        <p className="text-ink-40 text-sm mt-6">
          Rates include packing. Free delivery above {formatINR(BRAND.delivery.freeAbove)}.
        </p>
      </section>

      {/* Gifting — the only place maroon appears */}
      <section className="bg-maroon text-linen">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]">
              Boxes for Diwali
            </h2>
            <p className="text-linen/80 leading-relaxed max-w-[50ch] mt-4">
              Choose the goods, the weights and the box. We pack it, seal it and send it
              with your note inside — one for the family, or two hundred for an office.
            </p>
            <Link
              to="/gifting"
              className="inline-block mt-7 bg-linen text-maroon px-7 py-3.5 font-medium hover:bg-almond transition-colors"
            >
              Build a box
            </Link>
          </div>
          <p className="font-display italic text-2xl text-linen/60 leading-relaxed">
            For offices ordering in bulk, tell us your budget per box and we will
            put the combinations together.
          </p>
        </div>
      </section>

      {/* The house behind the goods */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]">
            {BRAND.story.heading}
          </h2>
        </div>
        <div className="space-y-5 text-ink-60 leading-relaxed max-w-[62ch]">
          {BRAND.story.body.map((para, i) => (
            <p key={i} className={i === 0 ? 'text-espresso text-lg' : undefined}>{para}</p>
          ))}
          <Link to="/story" className="inline-block text-espresso underline underline-offset-4">
            More about the family
          </Link>
        </div>
      </section>

      {/* Three checkable claims */}
      <section className="border-t rule">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid sm:grid-cols-3">
          {BRAND.assurances.map((a, i) => (
            <div key={a.title} className={`py-5 sm:py-0 sm:px-8 ${i === 0 ? 'sm:pl-0' : ''} ${i < 2 ? 'border-b sm:border-b-0 sm:border-r rule' : 'sm:pr-0'}`}>
              <h3 className="font-display text-xl">{a.title}</h3>
              <p className="text-ink-60 text-[0.95rem] leading-relaxed mt-2">{a.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
