# 🥜 Shri Guru Ji Dry Fruits

Premium dry fruits e-commerce static web app built with **React + Vite**.

---

## ✨ Features

### Customer Storefront
- **Home page** — Hero section, featured products, "Why Choose Us", testimonials
- **Products page** — 16 products with search, category filter (Nuts / Dried Fruits / Seeds), sort by price/name
- **Product detail** — Description, nutrition facts, quantity selector, related products
- **Cart** — Quantity controls, free delivery over ₹500, order summary
- **Checkout** — Shipping form + **WhatsApp Checkout Redirect** (generates a ready-to-send WhatsApp order)
- **UPI Payments** — Includes UPI QR generation (Google Pay, PhonePe, Paytm)

### Seller Admin (Disabled for Static Version)
> Note: Admin features and Firebase integration have been commented out to keep the site entirely static and free to host! If you wish to re-enable them in the future to build a full backend, you can just uncomment the logic in `src/main.jsx`, `src/App.jsx`, and `src/components/Navbar.jsx`.

### Design
- Calming beige & earthy color palette with gold accents
- Playfair Display + Inter typography
- Smooth animations, glassmorphism navbar, fully responsive

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173/**

### Build for Production

```bash
npm run build
```

Deploy the `dist/` folder easily and for free to **GitHub Pages**, **Vercel**, or **Netlify**.

---

## 📦 Product Catalog

| Product | Price (₹) | Category |
|---------|-----------|----------|
| Badam Giri | 875 | Nuts |
| Pista | 1,100 | Nuts |
| Walnut | 700 | Nuts |
| Kismish | 500 | Dried Fruits |
| Black Raisin | 500 | Dried Fruits |
| Anjeer | 990 | Dried Fruits |
| Dates | 300 | Dried Fruits |
| Dried Mango | 450 | Dried Fruits |
| Dried Strawberry | 650 | Dried Fruits |
| Dried Kiwi | 400 | Dried Fruits |
| Dried Fruit Mix | 500 | Dried Fruits |
| Chia Seeds | 280 | Seeds |
| Pumpkin Seeds | 450 | Seeds |
| Sunflower Seeds | 200 | Seeds |
| Magaj | 550 | Seeds |
| Mix Seeds | 560 | Seeds |

---

## ⚙️ Configuration & WhatsApp Automation

### 1. Set Your WhatsApp Number

Edit `src/pages/customer/Checkout.jsx` and replace the dummy number (`919999999999`) with your actual WhatsApp Business registered number (include country code without `+`):

```js
const brandPhoneNumber = '919876543210' // Change this to your business mobile number
```

### 2. WhatsApp Automation Ideas

For managing your customer orders, we recommend setting up the **WhatsApp Business App** directly on your phone:
- **Greeting Message**: Let new customers know someone is looking at their order.
- **Quick Replies**: Use shortcuts to quickly drop instructions, like `/upi` to send your payment QR/number, or `/delivery` to explain timelines.
- **Labels**: Tag specific chats as "Payment Pending", "Order Confirmed", and "Dispatched".

As you grow to 50-100+ orders, consider using a WhatsApp API provider (like Interakt, WATI, or AISensy) to build chatbots for automatic confirmations!

### 3. UPI Payments (Scan to Pay)

Edit `src/utils/payment.js` and replace `MERCHANT_UPI_ID` with your real UPI ID:

```js
export const MERCHANT_UPI_ID = 'yourname@paytm'  // or yourname@upi
```

---

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **React Router** — Client-side routing
- **qrcode.react** — UPI QR code generation
- **react-hot-toast** — Toast notifications
- **react-icons** — Icon library

---

## 📄 License

This project is private and built for **Shri Guru Ji Dry Fruits**.
