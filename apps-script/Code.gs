/**
 * Canflare – Google Apps Script backend (Google Sheet as the database)
 *
 * SETUP (details in README.md):
 *  1. Create a Google Sheet, open Extensions > Apps Script, paste this file.
 *  2. Run setup() once (authorise). It creates the sheets and logs your SECRET.
 *  3. Project Settings > Script Properties: add OWNER_EMAIL (and optionally SITE_URL, ADMIN_URL,
 *     CALLMEBOT_PHONE, CALLMEBOT_KEY).
 *  4. Deploy > New deployment > Web app: Execute as "Me", Who has access "Anyone". Copy the /exec URL.
 *  5. In Vercel set ORDER_WEBHOOK_URL = that URL and ORDER_WEBHOOK_SECRET = the SECRET.
 */

var BRAND = 'Canflare';
var PREFIX = 'CF';
var TZ = 'Asia/Kolkata';
var DEFAULT_SITE = 'https://canflare.in';

var C = { gold: '#FAB507', goldDark: '#7B5800', dark: '#1B1C1A', cream: '#FBF9F5', oat: '#F5F0E8', line: '#EAE5DE', text: '#1B1C1A', muted: '#6b665a' };

var ORDER_HEADERS = ['Order ID', 'Date', 'Status', 'Items', 'Item count', 'Subtotal', 'Delivery', 'Gift wrap', 'Total', 'Payment',
  'Name', 'Mobile', 'WhatsApp', 'Address', 'City', 'State', 'District', 'Pincode', 'Gift message', 'Note', 'Courier', 'Tracking',
  'Source', 'Admin note', 'Updated at', 'Items JSON', 'Discount'];
var STATUSES = ['New', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

// Seed for the Products sheet (slug | variant | price). Blank price = not priced yet (hidden on the site).
var PRODUCT_SEED = [
  ['jar-candles', '120 ml', 20],
  ['votive-green-pink-rose', 'Standard', 20],
  ['votive-pink-white-pair', 'Standard', 20],
  ['votive-mint-lavender-pair', 'Standard', 20],
  ['votive-blue-rose', 'Standard', 20],
  ['votive-yellow-peach-rose', 'Standard', 20],
  ['return-gift-printed-trio', 'Standard', 20],
  ['return-gift-silver-ribbon', 'Standard', 20],
  ['return-gift-floral-pair', 'Standard', 20],
  ['mandala-heart-pillar', 'Standard', 20],
  ['advent-candle', '2 × 12 inch', 20],
  ['advent-candle', '2 × 6 inch', 20],
  ['plain-white-pillar', 'Standard', 20],
  ['ceremony-cross-pillar-set', 'Standard', 20],
  ['baptism-blue-pillar', 'Standard', 20],
  ['burlap-white-rose-pillar', 'Standard', 20],
  ['burlap-rose-succulent-pair', 'Standard', 20],
  ['square-green-ribbon-pillars', 'Standard', 20],
  ['santa-christmas-pillars', 'Standard', 20],
  ['christmas-tree-candle', 'Standard', 20],
  ['rose-shaped-candle', 'Standard', 20],
  ['diya-candle', 'Standard', 20],
  ['white-dome-candle', 'Standard', 20]
];

// ───────────────────────────── setup ─────────────────────────────
function setup() {
  var ss = SpreadsheetApp.getActive();
  var props = PropertiesService.getScriptProperties();

  // Orders
  var o = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
  if (o.getLastRow() === 0) o.getRange(1, 1, 1, ORDER_HEADERS.length).setValues([ORDER_HEADERS]);
  o.setFrozenRows(1);
  o.getRange(1, 1, 1, ORDER_HEADERS.length).setFontWeight('bold').setBackground(C.dark).setFontColor(C.gold);
  var col = function (name) { return ORDER_HEADERS.indexOf(name) + 1; };
  ['Subtotal', 'Delivery', 'Gift wrap', 'Total', 'Discount'].forEach(function (n) {
    o.getRange(2, col(n), 2000, 1).setNumberFormat('"₹"#,##,##0');
  });
  ['Mobile', 'WhatsApp', 'Pincode', 'Tracking', 'Order ID'].forEach(function (n) {
    o.getRange(2, col(n), 2000, 1).setNumberFormat('@');
  });
  o.getRange(2, col('Date'), 2000, 1).setNumberFormat('dd-mmm-yyyy hh:mm');
  o.getRange(2, col('Updated at'), 2000, 1).setNumberFormat('dd-mmm-yyyy hh:mm');
  o.getRange(2, col('Status'), 2000, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build());
  o.setColumnWidth(col('Items'), 320);
  o.hideColumns(col('Items JSON'));

  // Products
  var p = ss.getSheetByName('Products') || ss.insertSheet('Products');
  if (p.getLastRow() === 0) {
    p.getRange(1, 1, 1, 4).setValues([['slug', 'variant', 'price', 'in_stock']]);
    var rows = PRODUCT_SEED.map(function (r) { return [r[0], r[1], r[2], true]; });
    p.getRange(2, 1, rows.length, 4).setValues(rows);
  }
  p.setFrozenRows(1);
  p.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground(C.dark).setFontColor(C.gold);
  p.getRange(2, 4, 1000, 1).insertCheckboxes();
  p.getRange(2, 3, 1000, 1).setNumberFormat('"₹"#,##,##0');

  // Custom products
  var c = ss.getSheetByName('Custom Products') || ss.insertSheet('Custom Products');
  if (c.getLastRow() === 0) c.getRange(1, 1, 1, 4).setValues([['slug', 'name', 'active', 'json']]);
  c.setFrozenRows(1);
  c.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground(C.dark).setFontColor(C.gold);

  var def = ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);

  // Secret
  var secret = props.getProperty('SECRET');
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('SECRET', secret);
  }
  Logger.log('SECRET (put this in Vercel as ORDER_WEBHOOK_SECRET): ' + secret);
  Logger.log('Now add Script Properties: OWNER_EMAIL (required), SITE_URL, ADMIN_URL, CALLMEBOT_PHONE, CALLMEBOT_KEY (optional).');
  return secret;
}

// ───────────────────────────── helpers ─────────────────────────────
function prop(k, d) { return PropertiesService.getScriptProperties().getProperty(k) || d || ''; }
function json(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function fail(msg) { return json({ ok: false, error: msg }); }

/** Formula-injection guard: neutralise leading = + - @ in any text we write to a cell. */
function safe(v) {
  if (typeof v !== 'string') return v;
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function inrIN(n) {
  var s = String(Math.round(Number(n) || 0));
  if (s.length <= 3) return '₹' + s;
  var last3 = s.slice(-3), rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return '₹' + rest + ',' + last3;
}
function sheet(name) { return SpreadsheetApp.getActive().getSheetByName(name); }
function authed(secret) { var s = prop('SECRET'); return s && secret && s === secret; }
function last10(s) { return String(s || '').replace(/\D/g, '').slice(-10); }

// ───────────────────────────── routing ─────────────────────────────
function doGet(e) {
  try {
    var p = e.parameter || {};
    if (!authed(p.secret)) return fail('unauthorized');
    switch (p.action) {
      case 'products': return json({ ok: true, rows: getProducts() });
      case 'custom': return json({ ok: true, items: getCustom() });
      case 'track': return json(trackOrder(p.id, p.mobile));
      case 'admin_orders': return json({ ok: true, orders: getOrders() });
      case 'ping': return json({ ok: true });
    }
    return fail('unknown-action');
  } catch (err) { return fail(String(err)); }
}

function doPost(e) {
  try {
    var b = JSON.parse(e.postData.contents);
    if (!authed(b.secret)) return fail('unauthorized');
    switch (b.action) {
      case 'order': return json(createOrder(b.order, b.orderId));
      case 'admin_update': return json(adminUpdate(b));
      case 'admin_products_save': return json(saveProducts(b.rows));
      case 'admin_custom_save': return json(saveCustom(b.item));
      case 'admin_custom_delete': return json(deleteCustom(b.slug));
    }
    return fail('unknown-action');
  } catch (err) { return fail(String(err)); }
}

// ───────────────────────────── orders ─────────────────────────────
function nextOrderId() {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var props = PropertiesService.getScriptProperties();
    var ym = Utilities.formatDate(new Date(), TZ, 'yyMM');
    var key = 'CNT_' + ym;
    var n = Number(props.getProperty(key) || '0') + 1;
    props.setProperty(key, String(n));
    return PREFIX + '-' + ym + '-' + ('000' + n).slice(-4);
  } finally { lock.releaseLock(); }
}

function findRow(id) {
  var s = sheet('Orders');
  var last = s.getLastRow();
  if (last < 2) return 0;
  var ids = s.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

function itemsText(items) {
  return (items || []).map(function (i) {
    return i.name + (i.variant ? ' (' + i.variant + ')' : '') + ' × ' + i.qty + ' — ' + inrIN(i.price * i.qty);
  }).join('\n');
}

function createOrder(o, forcedId) {
  if (!o || !o.items || !o.items.length) return { ok: false, error: 'empty-order' };
  var id = forcedId && /^[A-Z]{2}-\d{4}-R?\d{4}$/.test(forcedId) ? forcedId : '';
  if (id && findRow(id)) return { ok: true, id: id, duplicate: true }; // retry of an order we already have
  if (!id) id = nextOrderId();

  var now = new Date();
  var s = sheet('Orders');
  var row = [
    id, now, safe(o.status || 'New'), safe(itemsText(o.items)), Number(o.itemCount) || 0, Number(o.subtotal) || 0,
    Number(o.delivery) || 0, Number(o.giftWrap) || 0, Number(o.total) || 0, safe(o.payment || ''),
    safe(o.name || ''), safe(String(o.mobile || '')), safe(String(o.whatsapp || '')), safe(o.address || ''), safe(o.city || ''),
    safe(o.state || ''), safe(o.district || ''), safe(String(o.pincode || '')), safe(o.giftMessage || ''), safe(o.note || ''),
    '', '', safe(o.source || 'Website'), '', now, JSON.stringify(o.items), Number(o.discount) || 0
  ];
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (findRow(id)) return { ok: true, id: id, duplicate: true };
    var r = s.getLastRow() + 1;
    s.getRange(r, 1, 1, row.length).setValues([row]);
  } finally { lock.releaseLock(); }

  var order = JSON.parse(JSON.stringify(o)); order.id = id; order.date = now;
  try { sendOwnerEmail(order); } catch (e) { Logger.log('email failed: ' + e); }
  try { sendCallMeBot(order); } catch (e) { Logger.log('callmebot failed: ' + e); }
  return { ok: true, id: id };
}

function rowToOrder(h, r) {
  var o = {};
  h.forEach(function (name, i) { o[name] = r[i]; });
  var items = [];
  try { items = JSON.parse(o['Items JSON'] || '[]'); } catch (e) {}
  return {
    id: String(o['Order ID']), date: o['Date'] instanceof Date ? o['Date'].toISOString() : String(o['Date']),
    status: o['Status'], itemsText: o['Items'], items: items, itemCount: o['Item count'], subtotal: o['Subtotal'],
    delivery: o['Delivery'], giftWrap: o['Gift wrap'], discount: o['Discount'] || 0, total: o['Total'], payment: o['Payment'],
    name: o['Name'], mobile: String(o['Mobile']), whatsapp: String(o['WhatsApp']), address: o['Address'], city: o['City'],
    state: o['State'], district: o['District'], pincode: String(o['Pincode']), giftMessage: o['Gift message'], note: o['Note'],
    courier: o['Courier'], tracking: String(o['Tracking'] || ''), source: o['Source'], adminNote: o['Admin note'],
    updatedAt: o['Updated at'] instanceof Date ? o['Updated at'].toISOString() : String(o['Updated at'])
  };
}

function getOrders() {
  var s = sheet('Orders');
  var last = s.getLastRow();
  if (last < 2) return [];
  var vals = s.getRange(1, 1, last, ORDER_HEADERS.length).getValues();
  var h = vals[0];
  return vals.slice(1).filter(function (r) { return r[0]; }).map(function (r) { return rowToOrder(h, r); }).reverse();
}

function trackOrder(id, mobile) {
  var row = findRow(String(id || '').toUpperCase());
  if (!row) return { ok: true, found: false };
  var s = sheet('Orders');
  var h = s.getRange(1, 1, 1, ORDER_HEADERS.length).getValues()[0];
  var o = rowToOrder(h, s.getRange(row, 1, 1, ORDER_HEADERS.length).getValues()[0]);
  if (last10(o.mobile) !== last10(mobile)) return { ok: true, found: false };
  return { ok: true, found: true, order: {
    id: o.id, date: o.date, status: o.status, itemsText: o.itemsText, itemCount: o.itemCount, total: o.total,
    courier: o.courier, tracking: o.tracking
  } };
}

function adminUpdate(b) {
  var row = findRow(b.id);
  if (!row) return { ok: false, error: 'not-found' };
  var s = sheet('Orders');
  var set = function (name, val) { s.getRange(row, ORDER_HEADERS.indexOf(name) + 1).setValue(safe(val)); };
  if (b.status) { if (STATUSES.indexOf(b.status) < 0) return { ok: false, error: 'bad-status' }; set('Status', b.status); }
  if (b.courier !== undefined) set('Courier', b.courier);
  if (b.tracking !== undefined) set('Tracking', String(b.tracking));
  if (b.adminNote !== undefined) set('Admin note', b.adminNote);
  if (b.payment !== undefined) set('Payment', b.payment);
  s.getRange(row, ORDER_HEADERS.indexOf('Updated at') + 1).setValue(new Date());
  return { ok: true };
}

// ───────────────────────────── products ─────────────────────────────
function getProducts() {
  var s = sheet('Products');
  var last = s.getLastRow();
  if (last < 2) return [];
  return s.getRange(2, 1, last - 1, 4).getValues().filter(function (r) { return r[0]; }).map(function (r) {
    var price = Number(r[2]);
    return { slug: String(r[0]), variant: String(r[1]), price: r[2] === '' || !price ? null : price, inStock: r[3] === true || String(r[3]).toLowerCase() === 'true' };
  });
}

function saveProducts(rows) {
  var s = sheet('Products');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var last = s.getLastRow();
    if (last > 1) s.getRange(2, 1, last - 1, 4).clearContent();
    if (rows && rows.length) {
      var vals = rows.map(function (r) { return [safe(String(r.slug)), safe(String(r.variant)), r.price === null ? '' : Number(r.price), !!r.inStock]; });
      s.getRange(2, 1, vals.length, 4).setValues(vals);
      s.getRange(2, 4, vals.length, 1).insertCheckboxes();
    }
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function getCustom() {
  var s = sheet('Custom Products');
  var last = s.getLastRow();
  if (last < 2) return [];
  var out = [];
  s.getRange(2, 1, last - 1, 4).getValues().forEach(function (r) {
    try { var it = JSON.parse(r[3]); if (it) out.push(it); } catch (e) {}
  });
  return out;
}

function saveCustom(item) {
  if (!item || !item.slug) return { ok: false, error: 'bad-item' };
  var s = sheet('Custom Products');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var last = s.getLastRow();
    var row = 0;
    if (last > 1) {
      var slugs = s.getRange(2, 1, last - 1, 1).getValues();
      for (var i = 0; i < slugs.length; i++) if (String(slugs[i][0]) === item.slug) { row = i + 2; break; }
    }
    if (!row) row = last + 1;
    s.getRange(row, 1, 1, 4).setValues([[safe(item.slug), safe(item.name), item.active !== false, JSON.stringify(item)]]);
  } finally { lock.releaseLock(); }
  return { ok: true };
}

function deleteCustom(slug) {
  var s = sheet('Custom Products');
  var last = s.getLastRow();
  for (var r = last; r >= 2; r--) if (String(s.getRange(r, 1).getValue()) === slug) { s.deleteRow(r); break; }
  return { ok: true };
}

// ───────────────────────────── notifications ─────────────────────────────
function sendCallMeBot(o) {
  var phone = prop('CALLMEBOT_PHONE'), key = prop('CALLMEBOT_KEY');
  if (!phone || !key) return; // optional – skipped when empty
  var text = 'New order ' + o.id + ' · ' + inrIN(o.total) + ' · ' + o.name + ', ' + o.city;
  UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(phone) + '&text=' + encodeURIComponent(text) + '&apikey=' + encodeURIComponent(key), { muteHttpExceptions: true });
}

function waNumber(m) { var d = String(m || '').replace(/\D/g, ''); return d.length === 10 ? '91' + d : d; }

function sendOwnerEmail(o) {
  var to = prop('OWNER_EMAIL');
  if (!to) return;
  var site = prop('SITE_URL', DEFAULT_SITE).replace(/\/$/, '');
  var adminBase = prop('ADMIN_URL', site + '/admin').replace(/\/$/, '');
  var sheetUrl = SpreadsheetApp.getActive().getUrl();
  var when = Utilities.formatDate(o.date ? new Date(o.date) : new Date(), TZ, 'dd MMM yyyy, hh:mm a') + ' IST';
  var adminLink = adminBase + '/orders/' + encodeURIComponent(o.id);
  var wa = 'https://wa.me/' + waNumber(o.whatsapp || o.mobile);
  var mapsQ = [o.address, o.city, o.district, o.state, o.pincode].filter(Boolean).join(', ');
  var maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapsQ);
  var total = inrIN(o.total);
  var subject = 'New order ' + o.id + ' · ' + total + ' · ' + o.name;
  var pre = 'New order ' + o.id + ' · ' + total + ' · ' + o.name + ' · ' + o.city;
  var F = "font-family:Arial,Helvetica,sans-serif;";

  var btn = function (href, label, bg, fg) {
    return '<a href="' + esc(href) + '" style="' + F + 'display:inline-block;background:' + bg + ';color:' + fg + ';font-size:14px;font-weight:bold;text-decoration:none;padding:13px 22px;border-radius:8px;">' + label + '</a>';
  };
  var itemRows = (o.items || []).map(function (i) {
    return '<tr><td style="' + F + 'padding:10px 0;border-bottom:1px solid ' + C.line + ';font-size:14px;color:' + C.text + ';">' + esc(i.name) +
      (i.variant ? '<br><span style="font-size:12px;color:' + C.muted + ';">' + esc(i.variant) + '</span>' : '') + '</td>' +
      '<td align="center" style="' + F + 'padding:10px 8px;border-bottom:1px solid ' + C.line + ';font-size:14px;color:' + C.text + ';">× ' + esc(i.qty) + '</td>' +
      '<td align="right" style="' + F + 'padding:10px 0;border-bottom:1px solid ' + C.line + ';font-size:14px;font-weight:bold;color:' + C.text + ';">' + inrIN(i.price * i.qty) + '</td></tr>';
  }).join('');
  var line = function (k, v) {
    return '<tr><td style="' + F + 'padding:3px 0;font-size:13px;color:' + C.muted + ';">' + k + '</td><td align="right" style="' + F + 'padding:3px 0;font-size:13px;color:' + C.text + ';">' + v + '</td></tr>';
  };
  var kv = function (k, v) {
    return '<tr><td style="' + F + 'padding:5px 0;font-size:12px;color:' + C.muted + ';width:110px;vertical-align:top;">' + k + '</td><td style="' + F + 'padding:5px 0;font-size:14px;color:' + C.text + ';">' + v + '</td></tr>';
  };

  var html = '<!DOCTYPE html><html><body style="margin:0;padding:0;background:' + C.oat + ';">' +
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' + esc(pre) + '&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C.oat + ';"><tr><td align="center" style="padding:20px 10px;">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ' + C.line + ';">' +
    // header
    '<tr><td align="center" style="background:' + C.dark + ';padding:28px 20px 24px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0"><tr><td align="center" style="border:2px solid ' + C.gold + ';border-radius:14px;padding:8px 14px;background:#000000;">' +
    '<img src="' + esc(site) + '/logo.jpg" width="130" alt="' + esc(BRAND) + '" style="display:block;border:0;height:auto;"></td></tr></table>' +
    '<div style="' + F + 'color:' + C.gold + ';font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-top:16px;">' + esc(BRAND) + '</div>' +
    '<div style="' + F + 'color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">New order received</div>' +
    '<div style="margin-top:12px;"><span style="' + F + 'display:inline-block;background:' + C.gold + ';color:' + C.dark + ';font-weight:bold;font-size:15px;padding:6px 16px;border-radius:20px;">' + esc(o.id) + '</span></div>' +
    '<div style="' + F + 'color:#bdb8a8;font-size:12px;margin-top:10px;">' + esc(when) + '</div></td></tr>' +
    // total card
    '<tr><td style="padding:22px 24px 6px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C.cream + ';border:1px solid ' + C.line + ';border-radius:12px;"><tr><td style="padding:18px 20px;">' +
    '<div style="' + F + 'font-size:12px;color:' + C.muted + ';text-transform:uppercase;letter-spacing:1px;">Order total</div>' +
    '<div style="' + F + 'font-size:34px;font-weight:bold;color:' + C.goldDark + ';margin:2px 0 4px;">' + total + '</div>' +
    '<div style="' + F + 'font-size:13px;color:' + C.muted + ';margin-bottom:10px;">' + esc(o.itemCount) + ' item' + (o.itemCount == 1 ? '' : 's') + ' · ' + esc(o.payment || 'Payment pending') + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + line('Subtotal', inrIN(o.subtotal)) +
    line('Delivery', Number(o.delivery) === 0 ? '<b style="color:#2e7d32;">FREE</b>' : inrIN(o.delivery)) +
    (Number(o.giftWrap) > 0 ? line('Gift wrap', inrIN(o.giftWrap)) : '') +
    (Number(o.discount) > 0 ? line('Discount', '− ' + inrIN(o.discount)) : '') +
    '</table></td></tr></table></td></tr>' +
    // buttons
    '<tr><td align="center" style="padding:16px 24px 8px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="padding:4px;">' + btn(adminLink, 'Open order in Admin →', C.dark, C.gold) + '</td>' +
    '<td style="padding:4px;">' + btn(wa, 'WhatsApp customer', '#25D366', '#ffffff') + '</td></tr></table></td></tr>' +
    // items
    '<tr><td style="padding:14px 24px 4px;"><div style="' + F + 'font-size:12px;color:' + C.muted + ';text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Items</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + itemRows + '</table></td></tr>' +
    // customer
    '<tr><td style="padding:16px 24px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ' + C.line + ';border-radius:12px;"><tr><td style="padding:14px 18px;">' +
    '<div style="' + F + 'font-size:12px;color:' + C.muted + ';text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Customer</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
    kv('Name', '<b>' + esc(o.name) + '</b>') +
    kv('Mobile', '<a href="tel:' + esc(o.mobile) + '" style="color:' + C.goldDark + ';font-weight:bold;text-decoration:none;">' + esc(o.mobile) + '</a>') +
    kv('WhatsApp', '<a href="' + esc(wa) + '" style="color:' + C.goldDark + ';text-decoration:none;">' + esc(o.whatsapp || o.mobile) + '</a>') +
    kv('Address', esc(mapsQ) + '<br><a href="' + esc(maps) + '" style="color:' + C.goldDark + ';font-size:13px;">Open in Google Maps</a>') +
    (o.giftMessage ? kv('Gift message', esc(o.giftMessage)) : '') +
    (o.note ? '<tr><td colspan="2" style="padding-top:8px;"><div style="' + F + 'background:#FFF4CC;border-left:4px solid ' + C.gold + ';padding:10px 12px;font-size:14px;color:' + C.text + ';"><b>Note:</b> ' + esc(o.note) + '</div></td></tr>' : '') +
    kv('Source', esc(o.source || 'Website')) +
    '</table></td></tr></table></td></tr>' +
    // footer
    '<tr><td align="center" style="padding:18px 24px 26px;' + F + 'font-size:12px;color:' + C.muted + ';">' +
    '<a href="' + esc(adminBase + '/orders') + '" style="color:' + C.goldDark + ';text-decoration:none;">All orders (admin)</a> &nbsp;·&nbsp; ' +
    '<a href="' + esc(sheetUrl) + '" style="color:' + C.goldDark + ';text-decoration:none;">Google Sheet</a> &nbsp;·&nbsp; ' +
    '<a href="' + esc(site) + '" style="color:' + C.goldDark + ';text-decoration:none;">Website</a>' +
    '</td></tr></table></td></tr></table></body></html>';

  var text = [
    'NEW ORDER ' + o.id + ' (' + when + ')', 'Total: ' + total + ' · ' + o.itemCount + ' items · ' + (o.payment || ''), '',
    itemsText(o.items), '',
    'Subtotal ' + inrIN(o.subtotal) + ' | Delivery ' + (Number(o.delivery) === 0 ? 'FREE' : inrIN(o.delivery)) + (Number(o.giftWrap) > 0 ? ' | Gift wrap ' + inrIN(o.giftWrap) : ''), '',
    o.name + ' · ' + o.mobile + (o.whatsapp && o.whatsapp !== o.mobile ? ' (WhatsApp ' + o.whatsapp + ')' : ''), mapsQ,
    o.giftMessage ? 'Gift message: ' + o.giftMessage : '', o.note ? 'NOTE: ' + o.note : '', 'Source: ' + (o.source || 'Website'), '',
    'Admin: ' + adminLink, 'WhatsApp customer: ' + wa, 'Maps: ' + maps, 'Sheet: ' + sheetUrl
  ].filter(function (x) { return x !== ''; }).join('\n');

  MailApp.sendEmail({ to: to, subject: subject, body: text, htmlBody: html, name: BRAND + ' Orders' });
}

/** Run once from the editor to check the email design. */
function testEmail() {
  sendOwnerEmail({
    id: PREFIX + '-0000-0001', date: new Date(), items: [{ name: 'Jar Candle', variant: '120 ml', qty: 2, price: 499 }],
    itemCount: 2, subtotal: 998, delivery: 60, giftWrap: 0, discount: 0, total: 1058, payment: 'Pending (confirm on WhatsApp)',
    name: 'Test Customer', mobile: '9840699339', whatsapp: '9840699339', address: '1 Test Street', city: 'Chennai',
    district: 'Chennai', state: 'Tamil Nadu', pincode: '600099', giftMessage: 'Happy birthday!', note: 'Please call before delivery', source: 'Website'
  });
}
