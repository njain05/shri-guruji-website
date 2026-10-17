import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { useProducts } from '../../context/ProductContext'
import { categories } from '../../data/products'
import ProductCard from '../../components/ProductCard'
import './Products.css'

// Products are priced per weight variant, so sort on the cheapest pack.
function lowestPrice(product) {
  if (!product.weights?.length) return Number.POSITIVE_INFINITY
  return Math.min(...product.weights.map(w => w.price))
}

export default function Products() {
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState('name')

  // Debounce search — wait 250ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(timer)
  }, [search])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => lowestPrice(a) - lowestPrice(b))
        break
      case 'price-high':
        result.sort((a, b) => lowestPrice(b) - lowestPrice(a))
        break
      case 'name':
      default:
        result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [products, activeCategory, debouncedSearch, sortBy])

  function handleCategoryChange(cat) {
    setActiveCategory(cat)
    if (cat === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  return (
    <div className="products-page">
      <div className="products-page__header">
        <div className="container">
          <h1 className="products-page__title">Our Products</h1>
          <p className="products-page__subtitle">
            Explore our premium collection of dry fruits and seeds
          </p>
        </div>
      </div>

      <div className="container">
        <div className="products-page__toolbar">
          <div className="products-page__search">
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <FiSearch size={18} className="products-page__search-icon" />
            <input
              type="text"
              id="product-search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="products-page__search-input"
            />
          </div>

          <div className="products-page__filters">
            <div className="products-page__categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`products-page__cat-btn ${activeCategory === cat ? 'products-page__cat-btn--active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="products-page__sort"
              id="product-sort"
              aria-label="Sort products"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="skeleton-card card">
                <div className="skeleton skeleton--image"></div>
                <div className="skeleton skeleton--text"></div>
                <div className="skeleton skeleton--text-sm"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-page__empty">
            <span className="products-page__empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            <p className="products-page__count">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid-4">
              {filteredProducts.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fade-in-up">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
