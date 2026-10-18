import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

// Customer pages
import Home from './pages/customer/Home'
import Products from './pages/customer/Products'
import ProductDetail from './pages/customer/ProductDetail'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderConfirmation from './pages/customer/OrderConfirmation'
import Wishlist from './pages/customer/Wishlist'
import Story from './pages/customer/Story'
import Gifting from './pages/customer/Gifting'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ProductManager from './pages/admin/ProductManager'
import OrderManager from './pages/admin/OrderManager'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const isAdminLogin = location.pathname === '/admin'

  return (
    <>
      <ScrollToTop />
      {!isAdminLogin && <Navbar />}

      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/story" element={<Story />} />
          <Route path="/gifting" element={<Gifting />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManager />} />
          <Route path="/admin/orders" element={<OrderManager />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
    </>
  )
}
