import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { FiGrid, FiPackage, FiList, FiLogOut, FiSearch, FiMessageCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrderContext'
import { formatPrice } from '../../utils/payment'
import toast from 'react-hot-toast'
import './Admin.css'

const ORDER_STATUSES = ['Pending Payment', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderManager() {
  const { isAdmin, loading, logout } = useAuth()
  const { orders, updateOrderStatus } = useOrders()
  const location = useLocation()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  if (loading) return <div className="admin-page"><div className="container"><p style={{ padding: '6rem 0' }}>Loading…</p></div></div>
  if (!isAdmin) return <Navigate to="/admin" replace />

  const filtered = orders.filter(order => {
    const matchesSearch =
      !search ||
      order.id?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.phone?.includes(search)

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  async function handleStatusChange(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus)
    toast.success(`Status updated to "${newStatus}"`)
  }

  function resendWhatsApp(order) {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'
    let msg = `*Order Follow-up - Shri Guru Ji Dry Fruits* 🥜\n\n`
    msg += `*Order ID:* ${order.id}\n`
    msg += `*Customer:* ${order.customer?.name || 'N/A'}\n`
    msg += `*Phone:* ${order.customer?.phone || 'N/A'}\n`
    msg += `*Address:* ${order.customer?.address}, ${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}\n\n`
    msg += `*Items:*\n`
    order.items?.forEach(item => {
      msg += `- ${item.name} (${item.weight}) × ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`
    })
    msg += `\n*Total:* ${formatPrice(order.total)}\n`
    msg += `*Payment:* ${order.paymentMethod}\n`
    msg += `*Status:* ${order.status}`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function statusBadgeClass(status) {
    if (status === 'Delivered') return 'badge-green'
    if (status === 'Shipped') return 'badge-gold'
    if (status === 'Confirmed') return 'badge-warning'
    if (status === 'Cancelled') return 'badge-danger'
    return ''
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Order Manager</h1>
            <p className="admin-page__subtitle">View and manage all customer orders</p>
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
            <h3 className="admin-table-wrap__title">
              Orders ({filtered.length}{filtered.length !== orders.length ? ` of ${orders.length}` : ''})
            </h3>
            <div className="admin-order-filters">
              <div className="admin-search-wrap">
                <FiSearch size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, phone, order ID…"
                  className="admin-search-input"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="admin-status-filter"
              >
                <option value="All">All Statuses</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">📋</span>
              <h3>No orders yet</h3>
              <p>Orders will appear here once customers start placing orders via WhatsApp</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">🔍</span>
              <h3>No orders match</h3>
              <p>Try a different search term or status filter</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td><strong style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{order.id}</strong></td>
                    <td>
                      <div>
                        <strong>{order.customer?.name || 'N/A'}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          📞 {order.customer?.phone || '—'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {order.customer?.city}, {order.customer?.state}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>
                        {order.items?.map((item, i) => (
                          <div key={i}>{item.name} ({item.weight}) × {item.quantity}</div>
                        ))}
                        {order.giftPackaging && <div style={{ color: 'var(--color-gold-dark)' }}>🎁 Gift Packaging</div>}
                      </div>
                    </td>
                    <td><strong>{formatPrice(order.total || 0)}</strong></td>
                    <td>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <span className={`badge ${statusBadgeClass(order.status)}`} style={{ fontSize: '0.7rem', display: 'block', marginTop: 4 }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        onClick={() => resendWhatsApp(order)}
                        title="Send order summary on WhatsApp"
                        style={{ color: '#25D366' }}
                      >
                        <FiMessageCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
