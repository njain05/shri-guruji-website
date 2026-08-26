import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiPackage, FiList, FiLogOut, FiX, FiMinus } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { formatPrice } from '../../utils/payment'
import { categories } from '../../data/products'
import toast from 'react-hot-toast'
import './Admin.css'

const EMPTY_FORM = {
  name: '',
  category: 'Nuts',
  description: '',
  images: [''],
  inStock: true,
  featured: false,
  weights: [{ size: '250g', price: '' }, { size: '500g', price: '' }, { size: '1kg', price: '' }],
  nutrition: { protein: '', fat: '', fiber: '', calories: '' }
}

export default function ProductManager() {
  const { isAdmin, logout } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const location = useLocation()

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)

  if (!isAdmin) return <Navigate to="/admin" replace />

  function openAddModal() {
    setEditingProduct(null)
    setFormData(EMPTY_FORM)
    setShowModal(true)
  }

  function openEditModal(product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      images: product.images?.length ? product.images : [''],
      inStock: product.inStock,
      featured: product.featured,
      weights: product.weights?.length
        ? product.weights.map(w => ({ size: w.size, price: w.price.toString() }))
        : [{ size: '250g', price: '' }],
      nutrition: product.nutrition || { protein: '', fat: '', fiber: '', calories: '' }
    })
    setShowModal(true)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (name.startsWith('nutrition.')) {
      const key = name.split('.')[1]
      setFormData(prev => ({ ...prev, nutrition: { ...prev.nutrition, [key]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  function handleWeightChange(index, field, value) {
    setFormData(prev => {
      const weights = [...prev.weights]
      weights[index] = { ...weights[index], [field]: value }
      return { ...prev, weights }
    })
  }

  function addWeightRow() {
    setFormData(prev => ({ ...prev, weights: [...prev.weights, { size: '', price: '' }] }))
  }

  function removeWeightRow(index) {
    setFormData(prev => ({ ...prev, weights: prev.weights.filter((_, i) => i !== index) }))
  }

  function handleImageChange(index, value) {
    setFormData(prev => {
      const images = [...prev.images]
      images[index] = value
      return { ...prev, images }
    })
  }

  function addImageRow() {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
  }

  function removeImageRow(index) {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validWeights = formData.weights.filter(w => w.size && w.price)
    if (!formData.name || validWeights.length === 0) {
      toast.error('Name and at least one weight/price are required')
      return
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      images: formData.images.filter(img => img.trim()),
      inStock: formData.inStock,
      featured: formData.featured,
      weights: validWeights.map(w => ({ size: w.size, price: parseInt(w.price) })),
      nutrition: formData.nutrition,
      id: editingProduct
        ? editingProduct.id
        : formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData)
      toast.success('Product updated!')
    } else {
      await addProduct(productData)
      toast.success('Product added!')
    }
    setShowModal(false)
  }

  async function handleDelete(product) {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      await deleteProduct(product.id)
      toast.success('Product deleted')
    }
  }

  async function toggleStock(product) {
    await updateProduct(product.id, { inStock: !product.inStock })
    toast.success(`${product.name} marked as ${!product.inStock ? 'In Stock' : 'Out of Stock'}`)
  }

  const previewImage = formData.images.find(img => img.trim())

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
                  <th>Prices</th>
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
                          src={product.images?.[0]}
                          alt={product.name}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: 'var(--color-beige)', flexShrink: 0 }}
                          onError={(e) => { e.target.src = `https://via.placeholder.com/44x44/F5F0E8/5C3D2E?text=${product.name[0]}` }}
                        />
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
                        {product.weights?.map(w => (
                          <div key={w.size}>{w.size} — {formatPrice(w.price)}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        className={`badge ${product.inStock ? 'badge-green' : 'badge-danger'}`}
                        onClick={() => toggleStock(product)}
                        title="Click to toggle"
                        style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                      >
                        {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                      </button>
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

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div className="admin-form-grid">
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
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Describe the product..." />
              </div>

              {/* Weight & Pricing */}
              <div className="admin-section-label">Weight & Pricing *</div>
              {formData.weights.map((w, i) => (
                <div key={i} className="admin-weight-row">
                  <input
                    value={w.size}
                    onChange={e => handleWeightChange(i, 'size', e.target.value)}
                    placeholder="Size (e.g. 250g)"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    value={w.price}
                    onChange={e => handleWeightChange(i, 'price', e.target.value)}
                    placeholder="Price (₹)"
                    style={{ flex: 1 }}
                  />
                  {formData.weights.length > 1 && (
                    <button type="button" className="btn-icon" onClick={() => removeWeightRow(i)} style={{ color: 'var(--color-danger)' }}>
                      <FiMinus size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="admin-add-row-btn" onClick={addWeightRow}>
                <FiPlus size={14} /> Add size
              </button>

              {/* Images */}
              <div className="admin-section-label" style={{ marginTop: '1.25rem' }}>Product Images</div>
              <div className="admin-images-wrap">
                <div className="admin-images-inputs">
                  {formData.images.map((img, i) => (
                    <div key={i} className="admin-image-row">
                      <input
                        value={img}
                        onChange={e => handleImageChange(i, e.target.value)}
                        placeholder="/images/products/my-product.jpg or https://..."
                        style={{ flex: 1 }}
                      />
                      {formData.images.length > 1 && (
                        <button type="button" className="btn-icon" onClick={() => removeImageRow(i)} style={{ color: 'var(--color-danger)' }}>
                          <FiMinus size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="admin-add-row-btn" onClick={addImageRow}>
                    <FiPlus size={14} /> Add image
                  </button>
                </div>

                {previewImage && (
                  <div className="admin-image-preview">
                    <img
                      src={previewImage}
                      alt="Preview"
                      onError={e => { e.target.style.display = 'none' }}
                      onLoad={e => { e.target.style.display = 'block' }}
                    />
                    <span>Preview</span>
                  </div>
                )}
              </div>

              {/* Nutrition */}
              <div className="admin-section-label" style={{ marginTop: '1.25rem' }}>Nutrition (per 100g)</div>
              <div className="admin-nutrition-grid">
                {['calories', 'protein', 'fat', 'fiber'].map(key => (
                  <div className="form-group" key={key}>
                    <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                    <input
                      name={`nutrition.${key}`}
                      value={formData.nutrition[key]}
                      onChange={handleChange}
                      placeholder={key === 'calories' ? '579 kcal' : '21g'}
                    />
                  </div>
                ))}
              </div>

              {/* Flags */}
              <div className="admin-checkboxes">
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
                  In Stock
                </label>
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                  ⭐ Featured on Homepage
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
