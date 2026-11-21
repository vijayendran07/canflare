import * as React from "react";

type VTProps = { name?: string; children: React.ReactNode };
const R = React as unknown as { ViewTransition?: React.ComponentType<VTProps>; unstable_ViewTransition?: React.ComponentType<VTProps> };
const NativeVT = R.ViewTransition ?? R.unstable_ViewTransition;

/**
 * Shared-element transition (product card image → product page image) using React's ViewTransition + the browser View Transitions API.
 * Browsers or React builds without support just render the children – no behaviour change.
 */
export default function VT({ name, children }: VTProps) {
  return NativeVT ? <NativeVT name={name}>{children}</NativeVT> : <>{children}</>;
}
