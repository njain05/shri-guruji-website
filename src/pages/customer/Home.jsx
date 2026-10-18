import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { BRAND } from '../../data/brand'
import { glossFor, lowestPrice, formatINR, perKilo } from '../../data/glossary'

function Hero() {
  return (
    <section className="border-b rule overflow-hidden">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 py-14 lg:py-24
                      grid lg:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-20 items-center">
        <div className="text-center lg:text-left">
          <h1 className="font-display text-[clamp(2.9rem,6.4vw,4.9rem)] leading-[0.98] tracking-[-0.022em]">
            {BRAND.tagline}
          </h1>

          <p className="text-ink-60 text-lg leading-relaxed mt-6 max-w-[46ch] mx-auto lg:mx-0">
            {BRAND.heroLead}
          </p>

          <div className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              to="/products"
              className="bg-brand text-white px-8 py-4 font-medium hover:bg-brand-deep transition-colors"
            >
              Shop the range
            </Link>
            <Link
              to="/gifting"
              className="border border-espresso/25 px-8 py-4 font-medium hover:border-espresso hover:bg-almond/60 transition-colors"
            >
              Diwali gift boxes
            </Link>
          </div>

          <dl className="mt-10 pt-6 border-t rule flex flex-wrap justify-center lg:justify-start
                         gap-x-9 gap-y-3 text-sm">
            <div>
              <dt className="text-ink-40">Licensed food business</dt>
              <dd className="text-leaf tabular-nums mt-0.5">FSSAI {BRAND.fssai}</dd>
            </div>
            <div>
              <dt className="text-ink-40">Packed in</dt>
              <dd className="mt-0.5">{BRAND.city}, {BRAND.state}</dd>
            </div>
            <div>
              <dt className="text-ink-40">Delivery</dt>
              <dd className="mt-0.5">Free over {formatINR(BRAND.delivery.freeAbove)}</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -inset-3 bg-almond -z-10" aria-hidden="true" />
          <img
            src="/hero-dry-fruits.png"
            alt="Bowls of almonds, cashews, pistachios, walnuts, raisins, dates and figs"
            width="640"
            height="640"
            className="w-full aspect-square object-cover"
          />
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
        <span className="block text-lg tabular-nums group-hover:text-brand transition-colors">
          {formatINR(lowestPrice(product))}
        </span>
      </div>
    </Link>
  )
}

export default function Home() {
  const { products, loading } = useProducts()

  if (loading || !products.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <p className="text-ink-40">Loading the day's rates…</p>
      </div>
    )
  }

  return (
    <>
      <Hero />

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
      <section className="bg-red-deep text-linen">
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
              className="inline-block mt-7 bg-linen text-red-deep px-7 py-3.5 font-medium hover:bg-almond transition-colors"
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
