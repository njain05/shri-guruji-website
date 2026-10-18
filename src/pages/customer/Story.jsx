import { Link } from 'react-router-dom'
import { BRAND } from '../../data/brand'

export default function Story() {
  return (
    <div className="container-page pt-10 sm:pt-14">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
        <img src="/why-choose-us.png" alt="Bowls of dry fruits on a kitchen counter by a window"
          width="640" height="640" className="w-full aspect-square object-cover rounded-[var(--radius-panel)] lg:sticky lg:top-28" />
        <article>
          <h1 className="font-display font-normal text-[clamp(2.6rem,5vw,3.8rem)] leading-[1.02] tracking-[-0.02em]">
            {BRAND.story.heading}
          </h1>
          <div className="mt-8 space-y-5 text-lg text-muted leading-relaxed max-w-[60ch]">
            {BRAND.story.body.map((p, i) => <p key={i} className={i === 0 ? 'text-ink' : undefined}>{p}</p>)}
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {BRAND.assurances.map(a => (
              <div key={a.title} className="rounded-[var(--radius-panel)] bg-well p-5">
                <h2 className="font-display text-lg">{a.title}</h2>
                <p className="text-muted text-[0.95rem] leading-relaxed mt-1.5">{a.body}</p>
              </div>
            ))}
          </div>

          <Link to="/products" className="button-primary mt-10">See what we stock</Link>
        </article>
      </div>
    </div>
  )
}
