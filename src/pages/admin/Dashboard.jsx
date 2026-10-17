import { Link, useLocation, Navigate } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiDollarSign, FiTruck, FiGrid, FiList, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { useOrders } from '../../context/OrderContext'
import { formatPrice } from '../../utils/payment'
import './Admin.css'

export default function Dashboard() {
  const { isAdmin, loading, logout } = useAuth()
  const { products } = useProducts()
  const { orders, getOrderStats } = useOrders()
  const location = useLocation()

  if (loading) return <div className="admin-page"><div className="container"><p style={{ padding: '6rem 0' }}>Loading…</p></div></div>
  if (!isAdmin) return <Navigate to="/admin" replace />

  const stats = getOrderStats()
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-page__header">
          <div>
            <h1 className="admin-page__title">Dashboard</h1>
            <p className="admin-page__subtitle">Welcome back! Here's your store overview.</p>
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

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--brown">
              <FiPackage size={24} />
            </div>
            <div>
              <div className="stat-card__value">{products.length}</div>
              <div className="stat-card__label">Total Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--gold">
              <FiShoppingBag size={24} />
            </div>
            <div>
              <div className="stat-card__value">{stats.totalOrders}</div>
              <div className="stat-card__label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--green">
              <FiDollarSign size={24} />
            </div>
            <div>
              <div className="stat-card__value">{formatPrice(stats.totalRevenue)}</div>
              <div className="stat-card__label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--blue">
              <FiTruck size={24} />
            </div>
            <div>
              <div className="stat-card__value">{stats.pendingOrders}</div>
              <div className="stat-card__label">Pending Orders</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-table-wrap">
          <div className="admin-table-wrap__header">
            <h3 className="admin-table-wrap__title">Recent Orders</h3>
            <Link to="/admin/orders" className="btn btn-sm btn-secondary">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="admin-empty">
              <span className="admin-empty__icon">📦</span>
              <h3>No orders yet</h3>
              <p>Orders will appear here when customers start ordering</p>
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
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer?.name || 'N/A'}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td>{formatPrice(order.total || 0)}</td>
                    <td><span className="badge badge-gold">{order.paymentMethod}</span></td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'badge-green' :
                        order.status === 'Shipped' ? 'badge-gold' :
                        order.status === 'Confirmed' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
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
