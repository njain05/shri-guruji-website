import { Link } from 'react-router-dom'
import { FiPhone, FiInstagram, FiMapPin } from 'react-icons/fi'
import { BRAND } from '../data/brand'

const SHOP = ['Nuts', 'Dried Fruits', 'Seeds', 'Sweets']

export default function Footer() {
  const tel = BRAND.phone.replace(/[^\d+]/g, '')
  return (
    <footer className="mt-24 bg-pista">
      <div className="container-page pt-14 pb-10 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <img src="/images/logo-full.png" alt={`${BRAND.name} ${BRAND.trade} — ${BRAND.tagline}`} className="h-24 w-auto" />
          <p className="text-muted mt-4 max-w-[34ch] leading-relaxed">
            A Ludhiana wholesale family, now packing dry fruits for homes.
          </p>
        </div>

        <nav aria-label="Shop">
          <h2 className="font-display text-lg">Shop</h2>
          <ul className="mt-3 space-y-2 text-muted">
            {SHOP.map(c => (
              <li key={c}><Link to={`/products?category=${encodeURIComponent(c)}`} className="hover:text-ink">{c}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More">
          <h2 className="font-display text-lg">More</h2>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link to="/gifting" className="hover:text-ink">Diwali gifting</Link></li>
            <li><Link to="/story" className="hover:text-ink">Our story</Link></li>
            <li><Link to="/wishlist" className="hover:text-ink">Saved items</Link></li>
            <li><Link to="/cart" className="hover:text-ink">Basket</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-lg">Talk to us</h2>
          <ul className="mt-3 space-y-2.5 text-muted">
            <li><a href={`tel:${tel}`} className="inline-flex items-center gap-2 hover:text-ink"><FiPhone size={15} />{BRAND.phone}</a></li>
            <li>
              <a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 hover:text-ink">
                <FiInstagram size={15} />@{BRAND.instagram}
              </a>
            </li>
            <li className="inline-flex items-center gap-2"><FiMapPin size={15} />{BRAND.city} {BRAND.pincode}, {BRAND.state}</li>
          </ul>
        </div>
      </div>

      <div className="container-page pb-8">
        <div className="border-t hairline pt-6 flex flex-wrap justify-between gap-x-8 gap-y-2 text-[0.92rem] text-faint">
          <p>© {new Date().getFullYear()} {BRAND.legalName}</p>
          <p>FSSAI licence {BRAND.fssai}</p>
          <p>Made with ❤️ by Nishtha Jain</p>
          <Link to="/admin" className="hover:text-ink">Seller sign-in</Link>
        </div>
      </div>
    </footer>
  )
}
