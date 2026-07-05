// UPI Payment Helper
// Generates UPI payment links and QR code URLs

// Set your UPI ID here
export const MERCHANT_UPI_ID = import.meta.env.VITE_UPI_ID || 'yourupi@paytm'
export const MERCHANT_NAME = 'Shri Guru Ji Dry Fruits'

/**
 * Generate a UPI payment URI
 * This URI opens Google Pay, PhonePe, Paytm, etc. when clicked on mobile
 */
export function generateUPILink(amount, orderId) {
  const params = new URLSearchParams({
    pa: MERCHANT_UPI_ID,        // Payee address (UPI ID)
    pn: MERCHANT_NAME,           // Payee name
    am: amount.toFixed(2),       // Amount
    cu: 'INR',                   // Currency
    tn: `Order ${orderId}`,      // Transaction note
    tr: orderId                  // Transaction reference
  })
  return `upi://pay?${params.toString()}`
}

/**
 * Format price in INR
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

/**
 * Generate a unique order ID
 */
export function generateOrderId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase()
}
