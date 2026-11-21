import { EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import CandleArt from "@/components/CandleArt";

export const metadata = { title: "Offline", robots: { index: false, follow: false } };

export default function Offline() {
  return (
    <div className="container-x py-16 max-w-xl">
      <EmptyState
        icon={<CandleArt kind="votive" className="h-10 w-10" />}
        title="You're offline"
        text="No connection right now. Pages you've already visited still work, and any order you place is saved and sent when you're back online."
        action={<Button href="/">Back to home</Button>}
      />
    </div>
  );
}
