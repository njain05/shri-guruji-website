import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'

export default function Story() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display text-5xl sm:text-6xl leading-[1.02] tracking-[-0.02em]">
        {BRAND.story.heading}
      </h1>

      <div className="mt-10 space-y-6 text-lg text-ink-60 leading-relaxed">
        {BRAND.story.body.map((para, i) => (
          <p key={i} className={i === 0 ? 'text-espresso' : undefined}>{para}</p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t rule grid sm:grid-cols-2 gap-8">
        {BRAND.assurances.map(a => (
          <div key={a.title}>
            <h2 className="font-display text-xl">{a.title}</h2>
            <p className="text-ink-60 leading-relaxed mt-2">{a.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-12">
        <Link to="/products" className="bg-marigold text-white px-7 py-3.5 inline-block font-medium hover:bg-marigold-deep transition-colors">
          See what we stock
        </Link>
      </p>
    </article>
  )
}
