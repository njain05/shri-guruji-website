import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.find(item => item.cartId === action.payload.cartId)
      if (existing) {
        return state.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        )
      }
      return [...state, action.payload]
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.cartId !== action.payload)
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return state.filter(item => item.cartId !== action.payload.cartId)
      }
      return state.map(item =>
        item.cartId === action.payload.cartId
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem('guruji_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('guruji_cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product, quantity = 1, variant = null) {
    // Fallback if variant isn't explicitly passed (e.g. from somewhere we missed)
    const activeVariant = variant || product.weights[0] 
    const payload = {
      ...product,
      quantity,
      price: activeVariant.price,
      weight: activeVariant.size,
      cartId: `${product.id}-${activeVariant.size}`
    }
    dispatch({ type: 'ADD_TO_CART', payload })
  }

  function removeFromCart(cartId) {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId })
  }

  function updateQuantity(cartId, quantity) {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' })
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
