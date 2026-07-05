import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiPackage, FiList, FiLogOut, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { formatPrice } from '../../utils/payment'
import { categories } from '../../data/products'
import toast from 'react-hot-toast'
import './Admin.css'

export default function ProductManager() {
  const { isAdmin, logout } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const location = useLocation()

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '', category: 'Nuts', price: '', weight: '500g',
    description: '', image: '', inStock: true, featured: false,
    nutrition: { protein: '', fat: '', fiber: '', calories: '' }
  })

  if (!isAdmin) return <Navigate to="/admin" replace />

  function resetForm() {
    setFormData({
      name: '', category: 'Nuts', price: '', weight: '500g',
      description: '', image: '', inStock: true, featured: false,
      nutrition: { protein: '', fat: '', fiber: '', calories: '' }
    })
    setEditingProduct(null)
  }

  function openAddModal() {
    resetForm()
    setShowModal(true)
  }

  function openEditModal(product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      weight: product.weight,
      description: product.description,
      image: product.image,
      inStock: product.inStock,
      featured: product.featured,
      nutrition: product.nutrition || { protein: '', fat: '', fiber: '', calories: '' }
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required')
      return
    }

    const productData = {
      ...formData,
      price: parseInt(formData.price),
      id: editingProduct ? editingProduct.id : formData.name.toLowerCase().replace(/\s+/g, '-')
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData)
      toast.success('Product updated!')
    } else {
      await addProduct(productData)
      toast.success('Product added!')
    }

    setShowModal(false)
    resetForm()
  }

  async function handleDelete(product) {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      await deleteProduct(product.id)
      toast.success('Product deleted')
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (name.startsWith('nutrition.')) {
      const key = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        nutrition: { ...prev.nutrition, [key]: value }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Product Manager</h1>
            <p className="admin-page__subtitle">Add, edit, and manage your product catalog</p>
          </div>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            <FiLogOut size={16} /> Logout
          </button>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/dashboard" className={`admin-nav__link ${location.pathname === '/admin/dashboard' ? 'admin-nav__link--active' : ''}`}>
            <FiGrid size={16} /> Dashboard
          </Link>
          <Link to="/admin/products" className={`admin-nav__link ${location.pathname === '/admin/products' ? 'admin-nav__link--active' : ''}`}>
            <FiPackage size={16} /> Products
          </Link>
          <Link to="/admin/orders" className={`admin-nav__link ${location.pathname === '/admin/orders' ? 'admin-nav__link--active' : ''}`}>
            <FiList size={16} /> Orders
          </Link>
        </nav>

        <div className="admin-table-wrap">
          <div className="admin-table-wrap__header">
            <h3 className="admin-table-wrap__title">All Products ({products.length})</h3>
            <button className="btn btn-primary btn-sm" onClick={openAddModal} id="add-product-btn">
              <FiPlus size={16} /> Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">📦</span>
              <h3>No products yet</h3>
              <p>Click "Add Product" to start building your catalog</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Weight</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: 'var(--color-beige)' }}
                          onError={(e) => { e.target.src = `https://via.placeholder.com/40x40/F5F0E8/5C3D2E?text=${product.name[0]}` }}
                        />
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.weight}</td>
                    <td>
                      <span className={`badge ${product.inStock ? 'badge-green' : 'badge-danger'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>{product.featured ? '⭐' : '—'}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="btn-icon" onClick={() => openEditModal(product)} title="Edit">
                          <FiEdit2 size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => handleDelete(product)} title="Delete" style={{ color: 'var(--color-danger)' }}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal__title" style={{ margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Premium Almonds" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g. 875" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight</label>
                  <input name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 500g" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Product description..." />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>

              <h4 style={{ margin: '1rem 0 0.5rem', fontSize: '1rem' }}>Nutrition (per 100g)</h4>
              <div className="grid-4" style={{ gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Calories</label>
                  <input name="nutrition.calories" value={formData.nutrition.calories} onChange={handleChange} placeholder="579 kcal" />
                </div>
                <div className="form-group">
                  <label className="form-label">Protein</label>
                  <input name="nutrition.protein" value={formData.nutrition.protein} onChange={handleChange} placeholder="21g" />
                </div>
                <div className="form-group">
                  <label className="form-label">Fat</label>
                  <input name="nutrition.fat" value={formData.nutrition.fat} onChange={handleChange} placeholder="49g" />
                </div>
                <div className="form-group">
                  <label className="form-label">Fiber</label>
                  <input name="nutrition.fiber" value={formData.nutrition.fiber} onChange={handleChange} placeholder="12g" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} style={{ width: 'auto' }} />
                  In Stock
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} style={{ width: 'auto' }} />
                  Featured Product
                </label>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
