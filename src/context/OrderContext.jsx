import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.js'

const OrderContext = createContext()

export function useOrders() {
  return useContext(OrderContext)
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    if (!supabase) {
      // Use localStorage fallback
      try {
        const saved = localStorage.getItem('guruji_orders')
        setOrders(saved ? JSON.parse(saved) : [])
      } catch {
        setOrders([])
      }
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false })
      if (error) throw error
      const orderList = data || []
      orderList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(orderList)
    } catch (error) {
      console.error('Error loading orders:', error)
      try {
        const saved = localStorage.getItem('guruji_orders')
        setOrders(saved ? JSON.parse(saved) : [])
      } catch {
        setOrders([])
      }
    }
    setLoading(false)
  }

  async function placeOrder(orderData) {
    const order = {
      ...orderData,
      id: orderData.id || 'ORD-' + Date.now(),
      status: orderData.paymentMethod === 'Cash on Delivery' ? 'Confirmed' : 'Pending Payment',
      createdAt: new Date().toISOString()
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('orders').insert(order)
        if (error) throw error
      } catch (error) {
        console.error('Error placing order in Supabase:', error)
      }
    }

    setOrders(prev => {
      const updated = [order, ...prev]
      localStorage.setItem('guruji_orders', JSON.stringify(updated))
      return updated
    })

    return order
  }

  async function updateOrderStatus(orderId, status) {
    if (supabase) {
      try {
        const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
        if (error) throw error
      } catch (error) {
        console.error('Error updating order:', error)
      }
    }

    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o)
      localStorage.setItem('guruji_orders', JSON.stringify(updated))
      return updated
    })
  }

  function getOrderStats() {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const pendingOrders = orders.filter(o => o.status === 'Pending Payment' || o.status === 'Confirmed').length
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length
    return { totalOrders, totalRevenue, pendingOrders, deliveredOrders }
  }

  const value = {
    orders,
    loading,
    placeOrder,
    updateOrderStatus,
    getOrderStats,
    refreshOrders: loadOrders
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}
