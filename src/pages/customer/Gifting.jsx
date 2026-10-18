import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'

export default function Gifting() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-5xl sm:text-6xl leading-[1.02] tracking-[-0.02em]">
        Boxes for Diwali
      </h1>
      <p className="font-display italic text-2xl text-ink-40 mt-3">
        For the family, and for the office
      </p>

      <p className="text-lg text-ink-60 leading-relaxed max-w-[58ch] mt-8">
        Tell us what the box is for and roughly what you want to spend. We will put the
        combinations together, send you the rates, and pack them with a note inside.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 gap-px bg-espresso/10 border rule">
        <div className="bg-linen p-7">
          <h2 className="font-display text-2xl">One or two boxes</h2>
          <p className="text-ink-60 leading-relaxed mt-3">
            Pick the goods and weights you want from the shop and tell us at checkout
            that it is a gift. We will pack it as one.
          </p>
          <Link to="/products" className="inline-block mt-5 text-espresso underline underline-offset-4">
            Start from the shop
          </Link>
        </div>

        <div className="bg-linen p-7">
          <h2 className="font-display text-2xl">Ten or more</h2>
          <p className="text-ink-60 leading-relaxed mt-3">
            Offices, staff gifts and client boxes. Give us a budget per box and a
            quantity, and we will send you three options at trade rates.
          </p>
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ''}?text=${encodeURIComponent('Hello, I would like a quote for Diwali gift boxes. Quantity: \nBudget per box: ')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 bg-maroon text-linen px-6 py-3 font-medium hover:opacity-90 transition-opacity"
          >
            Ask for a quote
          </a>
        </div>
      </div>

      <p className="text-ink-40 text-sm mt-8">
        Packed in {BRAND.city}. Free delivery above ₹{BRAND.delivery.freeAbove}.
      </p>
    </div>
  )
}
