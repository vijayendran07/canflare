"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Accordion, Badge, Breadcrumb, EmptyState, Price, Rating, Skeleton } from "@/components/ui/primitives";
import { ChipGroup, Field, QtyStepper, SelectField, Tabs } from "@/components/ui/controls";
import { BottomSheet, Drawer, Modal, useToast } from "@/components/ui/overlays";
import ProductCard from "@/components/ProductCard";
import CandleArt from "@/components/CandleArt";
import { products } from "@/data/products";

const swatch = (name: string, cls: string, text = "text-ink") => (
  <div key={name} className="overflow-hidden rounded-md border border-line">
    <div className={`h-14 ${cls}`} />
    <p className={`px-2 py-1 text-[11px] ${text}`}>{name}</p>
  </div>
);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-8 border-t border-line first:border-0">
      <h2 className="text-2xl mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemView() {
  const [qty, setQty] = useState(2);
  const [chip, setChip] = useState("a");
  const [sheet, setSheet] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);
  const toast = useToast();
  const sample = { ...products.find((p) => p.slug === "plain-white-pillar")! };

  return (
    <div className="container-x py-8 max-w-5xl">
      <p className="eyebrow">Internal · not indexed</p>
      <h1 className="text-4xl mt-2">Canflare design system</h1>
      <p className="mt-2 text-ink-soft">Cinematic Luxe – every token and component used on the site. Source of truth: <code>app/globals.css</code> and <code>components/ui</code>.</p>

      <Section title="Colour">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {swatch("gold", "bg-gold")}{swatch("gold-bright", "bg-gold-bright")}{swatch("gold-deep", "bg-gold-deep", "text-ink")}
          {swatch("ink", "bg-ink", "text-ink")}{swatch("stage", "bg-stage", "text-ink")}{swatch("stage-3", "bg-stage-3")}
          {swatch("surface", "bg-surface")}{swatch("oat", "bg-oat")}{swatch("card", "bg-card")}
          {swatch("line", "bg-line")}{swatch("taupe", "bg-taupe")}{swatch("ink-soft", "bg-ink-soft")}
          {swatch("ok", "bg-ok")}{swatch("warn", "bg-warn")}{swatch("danger", "bg-danger")}
        </div>
      </Section>

      <Section title="Typography (fluid, clamp)">
        <div className="space-y-3">
          <p className="font-serif text-display">Display</p>
          <p className="font-serif text-4xl">Heading 4XL</p>
          <p className="font-serif text-3xl">Heading 3XL</p>
          <p className="font-serif text-2xl">Heading 2XL</p>
          <p className="font-serif text-xl">Heading XL</p>
          <p className="text-lg">Lead text – Plus Jakarta Sans, comfortable line length (max ~65ch).</p>
          <p>Body text – the quick brown fox. Prices use lining figures: ₹1,050 · ₹0123456789</p>
          <p className="text-sm text-taupe">Small / muted – AA contrast on the cream surface.</p>
          <p className="eyebrow">Eyebrow label</p>
        </div>
      </Section>

      <Section title="Elevation 1–5 · radius · glass">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {["e1", "e2", "e3", "e4", "e5"].map((e) => <div key={e} className={`grid h-20 place-items-center rounded-lg bg-card text-xs shadow-${e}`}>shadow-{e}</div>)}
        </div>
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3 text-xs">
          {["xs", "sm", "md", "lg", "xl", "2xl"].map((r) => <div key={r} className={`grid h-16 place-items-center border border-line bg-oat rounded-${r}`}>rounded-{r}</div>)}
        </div>
        <div className="mt-4 stage rounded-xl p-6">
          <div className="glass-dark rounded-lg p-5 max-w-xs"><p className="font-serif text-xl">Glass on stage</p><p className="text-sm text-on-stage-soft">blur 16px · 12% border</p></div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button><Button variant="dark">Dark</Button><Button variant="line">Secondary</Button><Button variant="ghost">Ghost</Button>
          <Button variant="wa">WhatsApp</Button><Button size="lg">Large</Button><Button icon variant="dark" aria-label="Example icon button">♥</Button><Button disabled>Disabled</Button>
          <span className="stage rounded-lg p-3"><Button variant="glass">Glass</Button></span>
        </div>
      </Section>

      <Section title="Chips · badges · price · rating">
        <div className="flex flex-wrap items-center gap-3">
          <ChipGroup label="Pack size" value={chip} onChange={setChip} options={[{ value: "a", label: "120 ml" }, { value: "b", label: "60 ml" }, { value: "c", label: "Pack of 6" }]} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge>New</Badge><Badge tone="dark">Out of stock</Badge><Badge tone="ok">In stock</Badge><Badge tone="warn">Low</Badge><Badge tone="danger">Error</Badge>
          <Price value={1050} from /> <Price value={499} size="lg" />
          <Rating average={4.8} count={12} /> <span className="text-xs text-taupe">(Rating renders nothing without real reviews → next item is empty on purpose:)</span> <Rating average={null} count={0} />
        </div>
      </Section>

      <Section title="Inputs · select · quantity">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Full name" placeholder="Your name" />
          <Field label="Mobile" inputMode="numeric" error="Enter a 10-digit mobile number" defaultValue="123" />
          <SelectField label="State"><option>Tamil Nadu</option><option>Karnataka</option></SelectField>
        </div>
        <div className="mt-4"><QtyStepper value={qty} onChange={setQty} /></div>
      </Section>

      <Section title="Tabs · accordion · breadcrumb">
        <Tabs tabs={[{ id: "d", label: "Details", content: <p className="text-ink-soft">Tab panel with arrow-key navigation.</p> }, { id: "c", label: "Care", content: <p className="text-ink-soft">Trim the wick to 5 mm.</p> }]} />
        <div className="mt-5"><Accordion items={[{ q: "How do I pay?", a: "Place your order – we confirm it and share the payment details." }, { q: "Do you deliver across India?", a: "Yes, every pincode." }]} /></div>
        <div className="mt-5"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Rose Bliss Candle" }]} /></div>
      </Section>

      <Section title="Overlays · toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="line" onClick={() => setSheet(true)}>Bottom sheet</Button>
          <Button variant="line" onClick={() => setDrawer(true)}>Drawer</Button>
          <Button variant="line" onClick={() => setModal(true)}>Modal</Button>
          <Button variant="dark" onClick={() => toast("Added to cart", "ok")}>Toast</Button>
        </div>
        <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Filters" footer={<Button className="w-full" onClick={() => setSheet(false)}>Apply</Button>}><p className="text-ink-soft">Sheet content. Esc, backdrop click and the ✕ close it.</p></BottomSheet>
        <Drawer open={drawer} onClose={() => setDrawer(false)} title="Drawer"><p className="text-ink-soft">Slide-in drawer.</p></Drawer>
        <Modal open={modal} onClose={() => setModal(false)} title="Modal"><p className="text-ink-soft">Centred modal.</p></Modal>
      </Section>

      <Section title="Skeleton · empty state">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Skeleton className="h-40" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/3" /></div>
          <EmptyState icon={<CandleArt kind="votive" className="w-9 h-9" />} title="Nothing here yet" text="Designed empty states keep the next step obvious." action={<Button href="/shop">Shop candles</Button>} />
        </div>
      </Section>

      <Section title="Product card">
        <div className="grid max-w-xs grid-cols-1"><ProductCard p={sample} /></div>
      </Section>

      <Section title="Motion">
        <p className="text-sm text-ink-soft mb-3">Durations 120 / 220 / 400 / 700 ms · easings standard, emphasised, spring. Reduced-motion users get instant state changes.</p>
        <div className="flex flex-wrap gap-4">
          {[["rise", "animate-rise"], ["fade", "animate-fade"], ["pop (spring)", "animate-pop"]].map(([n, c]) => (
            <div key={n} className={`grid h-20 w-28 place-items-center rounded-lg bg-ink text-xs text-gold ${c}`}>{n}</div>
          ))}
        </div>
      </Section>
    </div>
  );
}
