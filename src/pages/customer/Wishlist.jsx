import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/ProductCard'

export default function Wishlist() {
  const { wishlist } = useWishlist()
  const { products } = useProducts()
  const saved = products.filter(p => wishlist.includes(p.id))

  if (saved.length === 0) {
    return (
      <div className="container-page py-28 text-center">
        <h1 className="font-display font-normal text-[2.6rem]">Nothing saved yet</h1>
        <p className="text-muted text-lg mt-2">Tap the heart on any good to keep it here for later.</p>
        <Link to="/products" className="button-primary mt-8">Go to the shop</Link>
      </div>
    )
  }

  return (
    <div className="container-page pt-10 sm:pt-14">
      <h1 className="font-display font-normal text-[clamp(2.6rem,5vw,3.6rem)] leading-none tracking-[-0.02em]">Saved for later</h1>
      <p className="text-muted text-lg mt-2">{saved.length} {saved.length === 1 ? 'good' : 'goods'}</p>
      <div className="mt-9 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
        {saved.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
