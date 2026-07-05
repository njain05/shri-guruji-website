import { Link, useLocation, Navigate } from 'react-router-dom'
import { FiGrid, FiPackage, FiList, FiLogOut, FiEye } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrderContext'
import { formatPrice } from '../../utils/payment'
import toast from 'react-hot-toast'
import './Admin.css'

const ORDER_STATUSES = ['Pending Payment', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderManager() {
  const { isAdmin, logout } = useAuth()
  const { orders, updateOrderStatus } = useOrders()
  const location = useLocation()

  if (!isAdmin) return <Navigate to="/admin" replace />

  async function handleStatusChange(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus)
    toast.success(`Order status updated to "${newStatus}"`)
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
            <h3 className="admin-table-wrap__title">All Orders ({orders.length})</h3>
          </div>

          {orders.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">📋</span>
              <h3>No orders yet</h3>
              <p>Customer orders will appear here once they start placing orders</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td><strong style={{ fontSize: '0.85rem' }}>{order.id}</strong></td>
                    <td>
                      <div>
                        <strong>{order.customer?.name || 'N/A'}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {order.customer?.city}, {order.customer?.state}
                        </div>
                      </div>
                    </td>
                    <td>{order.customer?.phone || 'N/A'}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {order.items?.map(item => (
                          <div key={item.id}>{item.name} × {item.quantity}</div>
                        ))}
                      </div>
                    </td>
                    <td><strong>{formatPrice(order.total || 0)}</strong></td>
                    <td><span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{order.paymentMethod}</span></td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{
                          color: order.status === 'Delivered' ? 'var(--color-success)' :
                                 order.status === 'Cancelled' ? 'var(--color-danger)' :
                                 order.status === 'Shipped' ? 'var(--color-gold-dark)' : 'var(--color-text)'
                        }}
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
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
