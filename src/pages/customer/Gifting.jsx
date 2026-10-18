import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'
import { formatINR } from '../../data/glossary'

export default function Gifting() {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const quote = `https://wa.me/${phone}?text=${encodeURIComponent('Hello, I would like a quote for Diwali gift boxes.\nHow many boxes: \nBudget per box: \nDeliver by (date): ')}`

  return (
    <div className="container-page pt-5">
      <section className="rounded-[var(--radius-panel)] bg-blush px-6 py-12 sm:px-12 lg:px-16 lg:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <h1 className="font-display font-normal text-crimson-deep text-[clamp(2.8rem,5.6vw,4.4rem)] leading-[0.98] tracking-[-0.022em]">
            Diwali boxes, packed by hand
          </h1>
          <p className="text-muted text-lg sm:text-xl leading-relaxed mt-6 max-w-[46ch]">
            Choose the goods and the weights. We pack them into a gift box, seal it, and send it
            with your note inside.
          </p>
        </div>
        <img src="/hero-dry-fruits.png" alt="A platter of almonds, cashews, pistachios, raisins, dates and figs"
          width="640" height="640" className="w-full max-w-[26rem] mx-auto aspect-square rounded-full object-cover" />
      </section>

      <div className="mt-10 grid md:grid-cols-2 gap-5">
        <section className="rounded-[var(--radius-panel)] border hairline p-7 sm:p-8 flex flex-col">
          <h2 className="font-display text-[1.8rem] leading-tight">For the family</h2>
          <p className="text-muted text-lg leading-relaxed mt-3">
            Add the goods you want to your basket, then tick <span className="text-ink">"Pack it in a gift box"</span> at
            checkout. We pack the whole order as one box.
          </p>
          <ol className="mt-5 space-y-2 text-muted">
            <li><span className="text-ink tabular-nums mr-2">1.</span>Choose goods and pack sizes in the shop</li>
            <li><span className="text-ink tabular-nums mr-2">2.</span>Tick the gift box option at checkout</li>
            <li><span className="text-ink tabular-nums mr-2">3.</span>Send us your note on WhatsApp when we confirm</li>
          </ol>
          <Link to="/products" className="button-primary mt-7 self-start">Start in the shop</Link>
        </section>

        <section className="rounded-[var(--radius-panel)] bg-pista p-7 sm:p-8 flex flex-col">
          <h2 className="font-display text-[1.8rem] leading-tight">For the office</h2>
          <p className="text-muted text-lg leading-relaxed mt-3">
            Ten boxes or two hundred. Tell us how many, your budget per box, and when you need them.
            We buy as a wholesaler, so bulk orders are priced closer to trade rates.
          </p>
          <p className="text-faint mt-4">We'll reply on WhatsApp with a few box options to choose from.</p>
          <a href={quote} target="_blank" rel="noopener noreferrer" className="button-primary mt-7 self-start">
            Ask for a quote on WhatsApp
          </a>
        </section>
      </div>

      <p className="text-faint mt-6">
        Packed in {BRAND.city}. Free delivery on orders above {formatINR(BRAND.delivery.freeAbove)}.
      </p>
    </div>
  )
}
