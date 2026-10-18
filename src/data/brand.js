// Every word a customer reads lives here, so it can be changed without
// touching a component. Anything marked TODO is a fact I don't have —
// fill these in rather than leaving them, they are the parts that make
// the page believable.
export const BRAND = {
  name: 'Shri Guru Ji',
  trade: 'Dry Fruits',
  city: 'Ludhiana',
  state: 'Punjab',

  // One line that explains the whole business to a stranger.
  masthead: 'A Ludhiana wholesale house, now packing for homes.',

  story: {
    heading: 'The same goods we sell to shops',
    body: [
      // TODO: replace "for years" with the actual number once you know it
      // (e.g. "since 1996") — a real date does more work than any adjective.
      'Our family has supplied dry fruits wholesale in Ludhiana for years. Shopkeepers across Punjab buy their badam, kaju and anjeer from us, by the sack.',
      // TODO: your mother's name, and how long she taught.
      'This shop is run by my mother. She taught for most of her working life and left it to start this — the same sourcing, the same grades, packed at home and sent straight to you.',
      'Because we buy as a wholesaler, nothing passes through a middleman on its way to you. And because we pack to order, nothing sits in a warehouse waiting for a buyer.',
    ],
  },

  // Three claims, each one concrete enough to be checked.
  assurances: [
    { title: 'Bought as a wholesaler', body: 'We buy by the sack for the shops we supply, so you pay closer to trade rates than retail ones.' },
    { title: 'Packed to order', body: 'Nothing is pre-packed and left on a shelf. Your order is weighed and sealed the day it goes out.' },
    { title: 'Sent across India', body: 'Free delivery on orders above ₹500. Same-day within Ludhiana.' },
  ],

  delivery: { freeAbove: 500, charge: 50 },
}
