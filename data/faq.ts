import { business } from "@/config/business";
import { inr } from "@/lib/money";

export const faqs: { q: string; a: string }[] = [
  {
    q: "How do I place an order?",
    a: `Add candles to your cart, fill in your delivery details and tap "Place order". Your order reaches us straight away. We then call or WhatsApp you to confirm it and share the payment details. (If you like, you can also send your order to us on WhatsApp from the confirmation page.)`,
  },
  {
    q: "How do I pay?",
    a: "There is no online payment on the website. After you place your order we confirm it with you by phone or WhatsApp and share the payment details.",
  },
  {
    q: "Do you deliver across India?",
    a: `Yes, we deliver to every Indian pincode. Delivery is FREE on orders of ${inr(business.freeDeliveryThreshold)} or more, otherwise ${inr(business.deliveryCharge)}.`,
  },
  {
    q: "How long does delivery take?",
    a: `We usually dispatch within ${business.dispatchDays} working days. After dispatch, delivery typically takes ${business.deliveryDays} days depending on your location.`,
  },
  { q: "Can I track my order?", a: "Yes. Use the Track order page with your order ID and mobile number. We add the courier and tracking number once your order ships." },
  { q: "Do you offer gift wrapping?", a: `Yes – add gift wrap for ${inr(business.giftWrapPrice)} at checkout, with an optional gift message.` },
  { q: "Do you take bulk or return-gift orders?", a: `Yes. Message us on WhatsApp at ${business.phoneDisplay} with the quantity and date you need.` },
  { q: "What if my candle arrives damaged?", a: `Message us on WhatsApp within ${business.returnWindowDays} days of delivery with photos and we will make it right. See our Refund & Cancellation policy.` },
  { q: "How should I burn my candle safely?", a: "Trim the wick to about 5 mm, burn on a stable heat-resistant surface, never leave it unattended and keep it away from children, pets and flammable items." },
];
