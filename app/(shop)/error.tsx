"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/primitives";
import CandleArt from "@/components/CandleArt";
import { business } from "@/config/business";
import { ownerWaLink } from "@/lib/whatsapp";

/** Friendly error state with a retry – the rest of the shop (cart, header, nav) stays usable. */
export default function ShopError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="container-x max-w-xl py-16">
      <EmptyState
        icon={<CandleArt kind="votive" className="h-10 w-10" />}
        title="Something went wrong"
        text="That page couldn't load. Your cart is safe. Please try again – or message us on WhatsApp and we'll help you order."
        action={<><Button variant="dark" onClick={reset}>Try again</Button><Button variant="wa" href={ownerWaLink(`Hi ${business.name}! The website had a problem.`)} target="_blank">WhatsApp us</Button><Button variant="line" href="/">Home</Button></>}
      />
    </div>
  );
}
