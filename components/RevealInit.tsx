"use client";
import { useReveal } from "@/lib/motion";

/** Mount once per page that uses `.reveal` elements. */
export default function RevealInit() {
  useReveal();
  return null;
}
