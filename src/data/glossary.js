// The trade names are the real names, and they are what the brand is.
// This maps each good to the plain-English gloss a first-time buyer needs,
// so the page can say "Badam Giri" without leaving anyone behind.
// Falls back to the product's category when a good isn't listed.
export const GLOSS = {
  'badam-giri': 'California almonds',
  'pista': 'Iranian pistachios',
  'kaju': 'Whole cashews',
  'roasted-kaju': 'Roasted salted cashews',
  'kismish': 'Golden raisins',
  'black-raisin': 'Seedless black raisins',
  'walnut': 'Kashmiri walnut kernels',
  'chia-seeds': 'Chia seeds',
  'pumpkin-seeds': 'Pumpkin seeds',
  'sunflower-seeds': 'Sunflower seeds',
  'magaj': 'Melon seed kernels',
  'mix-seeds': 'Five-seed mix',
  'dried-fruit-mix': 'Mixed dried fruit',
  'dried-mango': 'Dried mango',
  'dried-strawberry': 'Dried strawberry',
  'dried-kiwi': 'Dried kiwi',
  'anjeer': 'Afghani figs',
  'dates': 'Soft dates',
  'pebble-chocolates': 'Chocolate pebbles',
}

export function glossFor(product) {
  return GLOSS[product?.id] || product?.category || ''
}

export function lowestPrice(product) {
  if (!product?.weights?.length) return 0
  return Math.min(...product.weights.map(w => w.price))
}

export function formatINR(n) {
  return '₹' + new Intl.NumberFormat('en-IN').format(Math.round(n))
}

// Rates in this trade are quoted per kilo. Showing it alongside the pack price
// lets a buyer compare us against a shop without doing arithmetic.
export function perKilo(weight) {
  const m = /^([\d.]+)\s*(g|kg)$/i.exec(weight.size.trim())
  if (!m) return null
  const grams = m[2].toLowerCase() === 'kg' ? parseFloat(m[1]) * 1000 : parseFloat(m[1])
  if (!grams) return null
  return (weight.price / grams) * 1000
}
