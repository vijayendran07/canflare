import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "gold" | "dark" | "line" | "ghost" | "wa" | "glass";

type Common = { variant?: ButtonVariant; size?: "md" | "lg"; icon?: boolean; className?: string; children: ReactNode };

/** Button / link-button. `href` renders a Next <Link>; `icon` makes a 44px round icon button (needs aria-label). */
export function Button(props: Common & ({ href: string } & { target?: string; rel?: string } | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>))) {
  const { variant = "gold", size = "md", icon, className = "", children, ...rest } = props as Common & Record<string, unknown>;
  const cls = `btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${icon ? "btn-icon" : ""} ${className}`.trim();
  if (typeof rest.href === "string") {
    const { href, target, rel } = rest as { href: string; target?: string; rel?: string };
    return /^https?:|^tel:|^mailto:/.test(href) ? (
      <a href={href} target={target} rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} className={cls}>{children}</a>
    ) : (
      <Link href={href} className={cls}>{children}</Link>
    );
  }
  return <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
