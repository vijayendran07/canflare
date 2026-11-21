# Handover – what the owner must confirm

Everything below was built with **working defaults, not verified facts**. Nothing here was invented as a "real" claim on the site (no reviews, ratings, awards or customer counts exist anywhere). Please confirm or correct each item.

## 1. Prices and products  ⚠ most important
- **Six products have NO price yet and are therefore hidden** on the shop (by design): Jar Candle (120 ml), Votive Candle (60 ml), Advent Candle (2×12 and 2×6 inch), Diya Candle, Return Gift Pillar, Pillar Candle. Fill the price form (`Canflare-Store-Details.xlsx` / `.pdf`) or set prices in **Admin → Products → Prices & stock** and they go live instantly.
- **Eight products came from the original design prototype** and are visible with the prototype's names and prices: Rose Bliss Candle ₹499, Vanilla Dreams Candle ₹599, Lavender Calm Candle ₹449, Sandalwood Luxury Candle ₹699, Velvet Oud & Bergamot ₹849, Brass Snuffer & Trimmer Set ₹549, Atelier Heritage Gift Box ₹1,499, Wild Fig & Smoked Moss ₹549. **Confirm each is a real product at that price – or remove it** (set `active: false` in `data/products.ts`). Their sizes are shown as "Standard" and the prototype's invented details (jar sizes, burn hours, "soy wax"…) were deliberately **not** carried over.
- Descriptions for the six core products only use the specs you supplied (sizes, volume, scented/non-scented). Add burn times, fragrances, wax type etc. when you have them.
- **Photos:** none were supplied. Shop pages show original candle illustrations instead of photos. Add your own photos (README §5) – no stock photos are used.

## 2. Money settings – `config/business.ts`
| Setting | Current value | Confirm |
|---|---|---|
| Free delivery from | ₹999 | ☐ |
| Delivery charge below that | ₹60 | ☐ |
| Gift wrap | ₹49 | ☐ |
| Dispatch time (shown in FAQ/Shipping) | 1–3 working days | ☐ |
| Delivery time after dispatch | 2–7 days | ☐ |
| Damage/wrong-item report window | 2 days | ☐ |
| Order ID prefix | `CF` (CF-2611-0001) | ☐ |
Delivery is offered to **all India pincodes (first digit 1–8)** with one flat charge – tell us if far states should cost more.

## 3. Policy pages – draft text, please read
`/shipping`, `/refund`, `/privacy`, `/terms` and the FAQ are **plain drafts** built from the numbers above. Check especially: cancellation (allowed before shipping), damaged/wrong item (replacement or refund), what is not refundable (used candles, custom orders). Edit in `app/(shop)/<page>/page.tsx` and `data/faq.ts`.

## 4. Brand details taken from the existing code (verify)
Canflare Candles · +91 98406 99339 (also the WhatsApp order number) · canflare@gmail.com · Instagram @canflare · No 6, Varalakshmi Nagar Ext, 1st Street, Kolathur, Chennai 600099, Tamil Nadu · tagline "Let there be Light".
**About page / home copy** is short and factual ("made in Chennai"); the prototype's marketing claims (100 % botanical soy, hand-poured, IFRA, ratings, reviews, newsletter) were removed because they could not be verified. Tell us any claims you *can* stand behind and we will add them.

## 5. Admin access
- Choose a **strong `ADMIN_PASSWORD`** (12+ characters) and a random `ADMIN_SESSION_SECRET` in Vercel. Sessions last 7 days; 5 wrong attempts lock login for 15 minutes.
- **Alert e-mail:** `OWNER_EMAIL` in Apps Script Script Properties (suggested: canflare@gmail.com). Run `testEmail` once.
- Optional free WhatsApp alert: CallMeBot (README §2).
- Optional `NEXT_PUBLIC_UPI_ID` – your UPI ID for the "Confirm + payment details" WhatsApp message.
- Set `ADMIN_HOST` only after `admin.<your-domain>` shows "Valid" in Vercel.

## 6. Other things to know
- **How orders reach you:** every order goes to your Google Sheet, you get an **email** (OWNER_EMAIL) and it appears in the **admin panel**. Customers are *not* required to WhatsApp you – it is optional. You then call/WhatsApp the customer to confirm and share payment details. There is no payment gateway and no online payment on the site.
- The git author of commits must be a member of your Vercel team, or Vercel blocks the deployment.
- The Apps Script and the owner email cannot be run outside Google – they were reviewed and syntax-checked but **please run `testEmail` and place one test order after deploying** to see the email.
- `legacy/` holds the original Vite/Express prototype for reference; it is not part of the live site and can be deleted.
