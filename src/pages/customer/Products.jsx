import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import { categories } from '../../data/products'
import ProductCard from '../../components/ProductCard'
import { lowestPrice, hindiFor } from '../../data/glossary'

export default function Products() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // The category lives in the URL, not in state. Reading it once on mount meant
  // footer links and back/forward changed the address but never the filter.
  const activeCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(t)
  }, [search])

  const filtered = useMemo(() => {
    let result = [...products]
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory)
    const q = debouncedSearch.trim().toLowerCase()
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        hindiFor(p).includes(debouncedSearch.trim())
      )
    }
    if (sortBy === 'price-low') result.sort((a, b) => lowestPrice(a) - lowestPrice(b))
    else if (sortBy === 'price-high') result.sort((a, b) => lowestPrice(b) - lowestPrice(a))
    else result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [products, activeCategory, debouncedSearch, sortBy])

  function setCategory(cat) {
    if (cat === 'All') setSearchParams({})
    else setSearchParams({ category: cat })
  }

  function clearAll() {
    setSearch('')
    setDebouncedSearch('')
    setSearchParams({})
  }

  return (
    <div className="container-page pt-10 sm:pt-14">
      <header className="max-w-2xl">
        <h1 className="font-display font-normal text-[clamp(2.6rem,5vw,3.8rem)] leading-none tracking-[-0.02em]">
          {activeCategory === 'All' ? 'The shop' : activeCategory}
        </h1>
        <p className="text-muted text-lg mt-3">
          Every good comes in 250 g, 500 g and 1 kg packs, weighed and sealed to order.
        </p>
      </header>

      <div className="mt-9 flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between border-b hairline pb-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
          {categories.map(cat => {
            const on = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={on}
                className={`rounded-[var(--radius-field)] px-4 py-2 text-[0.98rem] border transition-colors ${
                  on ? 'bg-olive text-paper border-olive' : 'bg-paper text-ink hairline hover:bg-well'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-72">
            <label htmlFor="product-search" className="sr-only">Search the shop</label>
            <FiSearch size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search kaju, anjeer, seeds…"
              className="field !pl-10"
            />
          </div>
          <label htmlFor="product-sort" className="sr-only">Sort</label>
          <select id="product-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="field !w-auto">
            <option value="name">Name</option>
            <option value="price-low">Price, low to high</option>
            <option value="price-high">Price, high to low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-9 sm:gap-x-6" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square rounded-[var(--radius-media)] bg-well animate-pulse" />
              <div className="h-4 w-2/3 mt-4 rounded bg-well animate-pulse" />
              <div className="h-4 w-1/3 mt-2 rounded bg-well animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="font-display text-2xl">Nothing matches that</h2>
          <p className="text-muted mt-2">
            Try a different word, or look through everything we stock.
          </p>
          <button onClick={clearAll} className="button-quiet mt-6">
            <FiX size={16} /> Clear search and filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-faint mt-6 mb-5" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'good' : 'goods'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
