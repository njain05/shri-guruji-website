// Facts the site states about the business, kept in one place so a claim
// can't drift out of step between pages. Only things that are true belong
// here — if you can't point to it, leave it out.
export const BRAND = {
  name: 'Shri Guru Ji',
  legalName: 'Shri Guruji Traders',
  city: 'Ludhiana',
  state: 'Punjab',
  pincode: '141008',
  tagline: 'Crunch Into Happiness',
  fssai: '12124999000222',
  instagram: 'shrigurujidryfruits',

  // TODO: confirm the charge below the threshold — ₹50 is the old value and
  // may not cover a courier outside Ludhiana.
  delivery: { freeAbove: 2000, charge: 50 },
}

// The single delivery rule, used by the basket, checkout and confirmation so
// their totals can never disagree.
export function deliveryFor(subtotal) {
  return subtotal >= BRAND.delivery.freeAbove ? 0 : BRAND.delivery.charge
}

export function formatINR(n) {
  return '₹' + new Intl.NumberFormat('en-IN').format(Math.round(n))
}
