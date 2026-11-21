"use client";
import dynamic from "next/dynamic";

const PersonalStrip = dynamic(() => import("./PersonalStrip"), { ssr: false });

export default function PersonalLazy(props: { exclude?: string; showReorder?: boolean }) {
  return <PersonalStrip {...props} />;
}
