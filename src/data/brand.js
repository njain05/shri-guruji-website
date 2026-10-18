// Every word a customer reads lives here, so it can be changed without
// touching a component. Anything marked TODO is a fact I don't have —
// fill these in rather than leaving them, they are the parts that make
// the page believable.
export const BRAND = {
  name: 'Shri Guru Ji',
  trade: 'Dry Fruits',
  legalName: 'Shri Guruji Traders',
  city: 'Ludhiana',
  state: 'Punjab',
  pincode: '141008',

  // From the packaging. This is the brand's own voice — use it, don't invent one.
  tagline: 'Crunch into happiness',

  // Printed on every pouch, and the thing that tells a stranger buying food
  // online that this is a registered food business.
  fssai: '12124999000222',
  instagram: 'shrigurujidryfruits',
  // TODO: two numbers exist — the label says +91 950135512, the site footer
  // says +91 98155 10684. Tell me which one customers should call.
  phone: '+91 98155 10684',

  // One line that explains the whole business to a stranger.
  masthead: 'A Ludhiana wholesale house, now packing for homes.',

  heroLead: 'Almonds, cashews, pistachios and figs from a Ludhiana wholesale family — the same grades we sell to shops, now weighed and packed for your home.',

  story: {
    heading: 'The same goods we sell to shops',
    body: [
      // TODO: replace "for years" with the actual number once you know it
      // (e.g. "since 1996") — a real date does more work than any adjective.
      'Our family has supplied dry fruits wholesale in Ludhiana for years. Shopkeepers buy their badam, kaju and anjeer from us in bulk.',
      // TODO: your mother's name, and how long she taught.
      'This shop is run by my mother. She was a teacher until recently, and left to start this from home — the same sourcing, the same grades, packed by hand and sent straight to you.',
      'Because we buy as a wholesaler, nothing passes through a middleman on its way to you. And because we pack to order, nothing sits in a warehouse waiting for a buyer.',
    ],
  },

  // Three claims, each one concrete enough to be checked.
  assurances: [
    { title: 'Bought as a wholesaler', body: 'We buy by the sack for the shops we supply, so you pay closer to trade rates than retail ones.' },
    { title: 'Packed to order', body: 'Nothing is pre-packed and left on a shelf. Your order is weighed and sealed the day it goes out.' },
    { title: 'Licensed and labelled', body: 'A registered food business, FSSAI 12124999000222. The number is printed on every pouch.' },
  ],

  // One source of truth for delivery. Cart and checkout must read from here:
  // if they disagree, a customer sees one total in the basket and another at
  // checkout. TODO: confirm the charge below the threshold — ₹50 is the old
  // value and may not cover a courier outside Ludhiana.
  delivery: { freeAbove: 2000, charge: 50 },
}

// The single rule for delivery, used by the basket, checkout and confirmation.
export function deliveryFor(subtotal) {
  return subtotal >= BRAND.delivery.freeAbove ? 0 : BRAND.delivery.charge
}
