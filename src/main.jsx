import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
// import { OrderProvider } from './context/OrderContext.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
        <ProductProvider>
          <CartProvider>
            {/* <OrderProvider> */}
              <App />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#5C3D2E',
                    color: '#FAF7F2',
                    borderRadius: '12px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.9rem',
                    padding: '12px 20px',
                  },
                }}
              />
            {/* </OrderProvider> */}
          </CartProvider>
        </ProductProvider>
      {/* </AuthProvider> */}
    </BrowserRouter>
  </React.StrictMode>
)
