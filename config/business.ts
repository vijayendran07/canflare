/**
 * Every business setting lives here. Items marked CONFIRM must be checked by the
 * owner (see HANDOVER.md) – they are working defaults, not verified facts.
 */
export const business = {
  name: "Canflare",
  legalName: "Canflare Candles",
  tagline: "Let there be Light",
  /** 2-letter prefix for order IDs, e.g. CF-2611-0001 */
  orderPrefix: "CF",

  // ---- Contact (taken from the existing site) ----
  phoneDisplay: "+91 98406 99339",
  phoneTel: "+919840699339",
  /** WhatsApp number in international format without "+" – used for wa.me links */
  whatsapp: "919840699339",
  email: "canflare@gmail.com",
  instagramHandle: "@canflare",
  instagramUrl: "https://www.instagram.com/canflare",
  /** Existing wa.me chat link (used where a plain chat link is wanted) */
  whatsappChatLink: "https://wa.me/message/NTBONRJVIW56I1",
  address: {
    line1: "No 6, Varalakshmi Nagar Ext, 1st Street",
    area: "Kolathur",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600099",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=No+6+Varalakshmi+Nagar+Ext+1st+Street+Kolathur+Chennai+600099",

  // ---- Money (CONFIRM) ----
  currency: "INR",
  freeDeliveryThreshold: 999, // CONFIRM
  deliveryCharge: 60, // CONFIRM
  giftWrapPrice: 49, // CONFIRM
  /** Policy numbers used on the policy pages and in structured data (CONFIRM) */
  returnWindowDays: 2, // CONFIRM – damaged / wrong item must be reported within this many days
  dispatchDays: "1–3", // CONFIRM – working days to pack and ship
  deliveryDays: "2–7", // CONFIRM – transit time after dispatch

  /** Delivery areas: every Indian pincode (first digit 1–8) */
  pincodePattern: /^[1-8]\d{5}$/,
} as const;

export const fullAddress = () => {
  const a = business.address;
  return `${business.legalName}, ${a.line1}, ${a.area}, ${a.city} ${a.pincode}, ${a.state}`;
};

export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
