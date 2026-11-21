import Image from "next/image";
import { img } from "@/lib/img";
import CandleArt, { kindForCategory } from "./CandleArt";

/** Real photo when the owner has supplied one; otherwise an original candle illustration (never a stock photo). */
export default function ProductImage({
  src,
  alt,
  category,
  sizes = "(max-width: 640px) 50vw, 25vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  category?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className="ph-bg absolute inset-0 grid place-items-center"
        role="img"
        aria-label={alt}
      >
        <CandleArt kind={kindForCategory(category)} className="w-[72%] h-[72%]" />
      </div>
    );
  }
  const external = /^https?:/.test(src);
  return <Image src={img(src)} alt={alt} fill sizes={sizes} priority={priority} unoptimized={external} className="object-cover" />;
}
