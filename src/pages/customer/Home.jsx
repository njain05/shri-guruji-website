import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/ProductCard'
import { BRAND } from '../../data/brand'
import { formatINR } from '../../data/glossary'

const KINDS = [
  { name: 'Nuts', blurb: 'Badam, kaju, pista, akhrot' },
  { name: 'Dried Fruits', blurb: 'Anjeer, khajoor, kishmish' },
  { name: 'Seeds', blurb: 'Chia, pumpkin, magaz' },
  { name: 'Sweets', blurb: 'For the sweet tooth' },
]

function Hero() {
  return (
    <section className="container-page pt-5">
      <div className="rounded-[var(--radius-panel)] bg-pista px-6 py-12 sm:px-12 lg:px-16 lg:py-16
                      grid lg:grid-cols-[1.08fr_0.92fr] gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="font-display font-normal text-[clamp(3rem,6.4vw,5.25rem)] leading-[0.96] tracking-[-0.025em]">
            {BRAND.tagline}
          </h1>
          <p className="text-muted text-lg sm:text-xl leading-relaxed mt-6 max-w-[42ch] mx-auto lg:mx-0">
            {BRAND.heroLead}
          </p>

          <div className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link to="/products" className="button-primary text-[1.05rem]">Shop the range</Link>
            <Link to="/gifting" className="button-quiet text-[1.05rem] bg-paper/60">Diwali gift boxes</Link>
          </div>

          <dl className="mt-11 flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-4 text-[0.95rem]">
            <div>
              <dt className="text-faint">Licensed food business</dt>
              <dd className="tabular-nums">FSSAI {BRAND.fssai}</dd>
            </div>
            <div>
              <dt className="text-faint">Packed by hand in</dt>
              <dd>{BRAND.city}</dd>
            </div>
            <div>
              <dt className="text-faint">Delivery</dt>
              <dd>Free above {formatINR(BRAND.delivery.freeAbove)}</dd>
            </div>
          </dl>
        </div>

        {/* The thaal: overhead bowls, cropped round, the way dry fruits are offered at Diwali */}
        <div className="relative mx-auto w-full max-w-[29rem] aspect-square">
          <div className="absolute inset-0 rounded-full border border-olive/20 scale-[1.06]" aria-hidden="true" />
          <img
            src="/hero-dry-fruits.png"
            alt="A round platter of almonds, cashews, pistachios, walnuts, raisins, dates and figs"
            width="640" height="640"
            className="relative w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

function SectionHead({ title, children, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        <h2 className="font-display font-normal text-[clamp(2rem,3.6vw,2.75rem)] leading-tight tracking-[-0.015em]">{title}</h2>
        {children && <p className="text-muted mt-1.5 max-w-[56ch]">{children}</p>}
      </div>
      {action}
    </div>
  )
}

export default function Home() {
  const { products, loading } = useProducts()

  if (loading) {
    return <div className="container-page py-32 text-center text-muted">Weighing out today's goods…</div>
  }

  const picks = products.filter(p => p.featured).slice(0, 4)
  const kinds = KINDS
    .map(k => {
      const goods = products.filter(p => p.category === k.name)
      return { ...k, count: goods.length, cover: (goods.find(g => g.featured) || goods[0])?.images[0] }
    })
    .filter(k => k.count > 0)

  return (
    <>
      <Hero />

      <section className="container-page mt-20 sm:mt-24">
        <SectionHead title="What we stock">
          {products.length} goods across {kinds.length} kinds, each in 250 g, 500 g and 1 kg packs.
        </SectionHead>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {kinds.map(k => (
            <Link key={k.name} to={`/products?category=${encodeURIComponent(k.name)}`}
              className="group rounded-[var(--radius-panel)] bg-well p-5 sm:p-6 flex flex-col hover:bg-well-deep transition-colors">
              <div className="aspect-[4/3] grid place-items-center">
                {k.cover && (
                  <img src={k.cover} alt="" loading="lazy"
                    className="photo-blend max-h-full max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-[1.04]" />
                )}
              </div>
              <h3 className="font-display text-[1.45rem] leading-tight mt-4">{k.name}</h3>
              <p className="text-muted text-[0.95rem] mt-0.5">{k.blurb}</p>
              <p className="text-faint text-[0.9rem] mt-3">{k.count} {k.count === 1 ? 'good' : 'goods'}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-20 sm:mt-24">
        <SectionHead
          title="Start with these"
          action={<Link to="/products" className="button-quiet !py-2.5">See all {products.length}</Link>}
        >
          The goods most families reach for first.
        </SectionHead>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-9 sm:gap-x-6">
          {picks.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Diwali — the one place crimson appears in a heading */}
      <section className="container-page mt-20 sm:mt-24">
        <div className="rounded-[var(--radius-panel)] bg-blush px-6 py-12 sm:px-12 lg:px-16 lg:py-16
                        grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display font-normal text-crimson-deep text-[clamp(2.3rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.02em]">
              Diwali boxes, packed by hand
            </h2>
            <p className="text-muted text-lg leading-relaxed mt-5 max-w-[46ch]">
              Choose the goods and the weights. We pack them into a gift box, seal it,
              and send it with your note inside.
            </p>
            <Link to="/gifting" className="button-primary mt-8 text-[1.05rem] !bg-crimson-deep hover:!bg-crimson">
              Plan a gift box
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-[var(--radius-panel)] bg-paper/70 p-6">
              <h3 className="font-display text-xl">For the family</h3>
              <p className="text-muted mt-2 leading-relaxed">One box or a few, for the people you visit this Diwali.</p>
            </div>
            <div className="rounded-[var(--radius-panel)] bg-paper/70 p-6">
              <h3 className="font-display text-xl">For the office</h3>
              <p className="text-muted mt-2 leading-relaxed">Ten or more boxes. Give us a budget per box and we will send options.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-20 sm:mt-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <img src="/why-choose-us.png" alt="Bowls of dry fruits on a kitchen counter by a window"
          width="640" height="640" loading="lazy"
          className="w-full aspect-square object-cover rounded-[var(--radius-panel)]" />
        <div>
          <h2 className="font-display font-normal text-[clamp(2rem,3.6vw,2.75rem)] leading-tight tracking-[-0.015em]">
            {BRAND.story.heading}
          </h2>
          <div className="mt-6 space-y-4 text-muted text-lg leading-relaxed max-w-[54ch]">
            {BRAND.story.body.map((para, i) => (
              <p key={i} className={i === 0 ? 'text-ink' : undefined}>{para}</p>
            ))}
          </div>
          <Link to="/story" className="button-quiet mt-7">Read our story</Link>
        </div>
      </section>

      <section className="container-page mt-20 sm:mt-24 grid sm:grid-cols-3 gap-4 sm:gap-5">
        {BRAND.assurances.map(a => (
          <div key={a.title} className="rounded-[var(--radius-panel)] bg-well p-7">
            <h3 className="font-display text-[1.3rem]">{a.title}</h3>
            <p className="text-muted mt-2 leading-relaxed">{a.body}</p>
          </div>
        ))}
      </section>
    </>
  )
}
