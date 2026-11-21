# Canflare – candle store

Next.js (App Router) + TypeScript + Tailwind v4, deployed on Vercel. Orders, products and the admin panel run on a **Google Sheet through a Google Apps Script web app** – no database.

```
app/            pages, API routes (/api/order, /api/track, /api/catalog, /api/admin/*), admin panel (app/admin)
components/     shop + admin UI
config/business.ts   ALL business settings (phone, address, delivery charge, free-delivery threshold, gift wrap…)
data/products.ts     ALL products (single source of truth)
apps-script/Code.gs  the complete Google Apps Script backend
lib/            pricing, order validation, WhatsApp messages, sheet client, admin auth
proxy.ts        admin subdomain routing, www / *.vercel.app redirects
tests/          Vitest suite (npm test)
legacy/         the original Vite + Express prototype (kept for reference only, not built)
```

## 1. Run locally

```bash
npm install
cp .env.example .env.local     # fill in values (all optional for a first look)
npm run dev                    # http://localhost:3000
npm test                       # 50 tests
npm run build                  # production build
```

Without `ORDER_WEBHOOK_URL` the shop still works: orders get a fallback ID (`CF-YYMM-R####`), are queued in the customer's browser, and the customer is asked to send the order on WhatsApp as a backup. The admin panel needs the sheet.

Open the admin locally at `http://localhost:3000/admin` (set `ADMIN_PASSWORD` first).

## 2. Google Sheet + Apps Script (step by step)

1. Go to <https://sheets.new> and name the sheet **Canflare Orders**.
2. **Extensions → Apps Script**. Delete the sample code and paste the whole of [`apps-script/Code.gs`](apps-script/Code.gs). Save.
3. Choose the function **`setup`** in the toolbar and press **Run**. Approve the permissions (Google shows an "unverified app" screen for your own script – *Advanced → Go to project*).
   `setup()` creates the **Orders**, **Products** and **Custom Products** sheets and **logs your SECRET** (View → Logs / Execution log). Copy it.
4. **Project Settings (gear) → Script Properties → Add property**:

   | Property | Value |
   |---|---|
   | `OWNER_EMAIL` | where new-order emails go, e.g. `canflare@gmail.com` (**required for the email**) |
   | `SITE_URL` | your shop address, e.g. `https://canflare.in` (used for the logo and links in the email) |
   | `ADMIN_URL` | e.g. `https://admin.canflare.in` (the "Open order in Admin" button) |
   | `CALLMEBOT_PHONE` | *optional* free WhatsApp alert: your number with country code, e.g. `919840699339` |
   | `CALLMEBOT_KEY` | *optional* API key you receive from CallMeBot (see below) |

   CallMeBot (optional): from your phone send the message `I allow callmebot to send me messages` to **+34 644 51 95 23** on WhatsApp; it replies with your API key. Leave both properties empty to skip it.
5. Run **`testEmail`** once to check the email arrives and looks right.
6. **Deploy → New deployment → ⚙ Select type → Web app**.
   *Execute as:* **Me**. *Who has access:* **Anyone**. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
   Every time you change `Code.gs` later: **Deploy → Manage deployments → ✏ → Version: New version → Deploy** (the URL stays the same).
7. Put the URL and the SECRET into Vercel (next section).

The SECRET is the only thing protecting the web app – never share it or commit it.

## 3. Vercel

1. Import the GitHub repo in Vercel. The framework is detected as Next.js (`vercel.json` pins it). Root directory = repo root.
2. **Settings → Environment Variables** (Production + Preview):

   | Variable | Value |
   |---|---|
   | `ORDER_WEBHOOK_URL` | the Apps Script `/exec` URL |
   | `ORDER_WEBHOOK_SECRET` | the SECRET from `setup()` |
   | `ADMIN_PASSWORD` | a long password (12+ characters) for the admin panel |
   | `ADMIN_SESSION_SECRET` | any long random string (e.g. 64 random characters) |
   | `NEXT_PUBLIC_SITE_URL` | `https://canflare.in` (your real domain, no trailing slash) |
   | `NEXT_PUBLIC_UPI_ID` | *optional* – your UPI ID, used only in the admin's "confirm + payment" WhatsApp message |
   | `ADMIN_HOST` | **set last**, only after the admin subdomain works (below) |

3. Redeploy after changing variables.
4. Git commits must be authored by a member of your Vercel team, otherwise Vercel blocks the deployment (set `git config user.email` accordingly).

## 4. Domain, DNS and the admin subdomain

1. **Vercel → Project → Settings → Domains**: add `canflare.in` (main) and `www.canflare.in`. Follow Vercel's DNS instructions at your registrar (usually an `A` record `76.76.21.21` for the apex and a `CNAME` `cname.vercel-dns.com` for `www`). `www` and `*.vercel.app` automatically redirect (308) to the main domain.
2. Add **`admin.canflare.in`** as another domain in the same project, with a `CNAME` `admin → cname.vercel-dns.com`. Wait until Vercel shows it as **Valid**.
3. Open `https://admin.canflare.in` – you should see the admin login (it works through `/admin` until the next step).
4. **Only now** set `ADMIN_HOST=admin.canflare.in` in Vercel and redeploy. From then on:
   - `admin.canflare.in/` → dashboard, `/orders`, `/orders/[id]`, `/orders/new`, `/products`
   - `/admin` and `/api/admin` return **404 on the shop domain**
   - every admin page and API sends `X-Robots-Tag: noindex, nofollow`, the admin `robots.txt` is `Disallow: /`, and it is not in the sitemap.
5. In Apps Script set `SITE_URL` and `ADMIN_URL` (section 2) so the email buttons point to the right places.

## 5. Everyday tasks

**Change a price / mark out of stock** – Admin → **Products → Prices & stock**, edit, **Save**. It is live on the shop immediately (a blank price hides that size). You can also edit the **Products** sheet directly; the site picks it up within 5 minutes (or instantly after any admin save).

**Add a product or combo** – Admin → Products → **Add product / combo**. Combos: pick the products, check "Bought separately", tap 5/10/15 % off, preview, save. A combo goes out of stock automatically when any item inside is out of stock.

**Permanent catalogue changes** (names, descriptions, categories, new sizes) – edit [`data/products.ts`](data/products.ts). A new size must also be added as a row on the **Products** sheet (slug | variant | price | in_stock).

**Add your own photos**
1. Put the files in `public/products/`, e.g. `public/products/jar-candle-1.jpg` (square or 4:5, under ~300 KB each; JPG/WebP).
2. In `data/products.ts` set `images: ["/products/jar-candle-1.jpg", "/products/jar-candle-2.jpg"]`.
3. Commit and deploy. A content hash (`?v=…`) is added to every image URL automatically, so a replaced photo shows immediately – no stale cache.
Products added in the admin take a direct photo link (https://…).

**Business settings** (delivery charge, free-delivery threshold, gift-wrap price, phone, address…) – [`config/business.ts`](config/business.ts).

**Order flow** – customer taps **Place order** → `/api/order` re-prices everything from the catalogue → Apps Script writes the row to the Orders sheet, returns `CF-YYMM-0001` and **emails the owner** (with an "Open order in Admin" button) → the order appears in the **admin panel** → the customer sees `/order/[id]` with tracking. The owner then calls or WhatsApps the customer to confirm and share payment details. Sending the order on WhatsApp is **optional** for the customer. If the sheet is unreachable, the order is saved on the customer's device and retried automatically, and the confirmation page asks them to also send it on WhatsApp as a backup.

## 6. Admin panel features

Dashboard (today / month / average order / customers, to-do counts, 7-day chart, best sellers), new-order alerts every 30 s (chime, banner, tab-title count, browser notification – click **Enable order alerts** once), orders list with search/filters/quick status/CSV, order page (status stepper, cancel/re-open, courier + tracking shown to the customer on `/track`, private note, repeat-customer history, one-tap WhatsApp templates that also update the status, printable packing slip), manual orders (phone/WhatsApp/Instagram/walk-in), and product management.
