import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.js'
import { seedProducts } from '../data/products.js'

const ProductContext = createContext()

export function useProducts() {
  return useContext(ProductContext)
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Load products from Supabase or local seed data
  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    if (!supabase) {
      setProducts(seedProducts)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.from('products').select('*')
      if (error) throw error

      if (!data || data.length === 0) {
        await seedSupabaseProducts()
      } else {
        setProducts(data)
      }
    } catch (error) {
      console.error('Supabase error, using local data:', error)
      setProducts(seedProducts)
    }
    setLoading(false)
  }

  async function seedSupabaseProducts() {
    if (!supabase) {
      setProducts(seedProducts)
      return
    }

    try {
      const { error } = await supabase.from('products').upsert(seedProducts, { onConflict: 'id' })
      if (error) throw error
      setProducts(seedProducts)
    } catch (error) {
      console.error('Error seeding products:', error)
      setProducts(seedProducts)
    }
  }

  async function addProduct(product) {
    const newProduct = { ...product, id: product.id || Date.now().toString() }
    if (supabase) {
      try {
        const { error } = await supabase.from('products').upsert(newProduct, { onConflict: 'id' })
        if (error) throw error
      } catch (error) {
        console.error('Error adding product to Supabase:', error)
      }
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }

  async function updateProduct(id, updates) {
    if (supabase) {
      try {
        const { error } = await supabase.from('products').update(updates).eq('id', id)
        if (error) throw error
      } catch (error) {
        console.error('Error updating product in Supabase:', error)
      }
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  async function deleteProduct(id) {
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id)
        if (error) throw error
      } catch (error) {
        console.error('Error deleting product from Supabase:', error)
      }
    }
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function getProduct(id) {
    return products.find(p => p.id === id)
  }

  function getFeaturedProducts() {
    return products.filter(p => p.featured)
  }

  function getProductsByCategory(category) {
    if (category === 'All') return products
    return products.filter(p => p.category === category)
  }

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getFeaturedProducts,
    getProductsByCategory,
    refreshProducts: loadProducts
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}
