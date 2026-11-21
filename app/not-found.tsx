import Link from "next/link";
import CandleArt from "@/components/CandleArt";

export default function NotFound() {
  return (
    <div className="stage on-stage grid min-h-screen place-items-center px-4 text-center">
      <div>
        <CandleArt kind="jar" className="mx-auto h-40 w-40 drop-shadow-[0_10px_40px_rgba(250,181,7,.4)]" />
        <p className="eyebrow eyebrow-gold mt-4">Error 404</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">This page went out</h1>
        <p className="mt-3 text-on-stage-soft">The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s relight your search.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gold btn-lg">Go home</Link>
          <Link href="/shop" className="btn btn-glass btn-lg">Shop candles</Link>
        </div>
      </div>
    </div>
  );
}
