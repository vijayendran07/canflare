/**
 * Original line-art candle illustrations used wherever a product photo has not been supplied yet.
 * Pure SVG – no stock photography.
 */
export type CandleKind = "jar" | "votive" | "pillar" | "advent" | "diya" | "gift";

export const kindForCategory = (category?: string): CandleKind => {
  if (!category) return "jar";
  if (category.includes("votive")) return "votive";
  if (category.includes("advent")) return "advent";
  if (category.includes("diya")) return "diya";
  if (category.includes("pillar")) return "pillar";
  if (category.includes("gift")) return "gift";
  return "jar";
};

const WAX = "#f4e8cf";
const WAX_SHADE = "#e6d3ac";
const GLASS = "#cdb98f";

function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-8" rx="16" ry="22" fill="url(#cf-glow)" />
      <g className="cf-flame">
        <path d="M0 -30 C 8 -18 9 -8 0 0 C -9 -8 -8 -18 0 -30 Z" fill="url(#cf-flame)" />
        <path d="M0 -14 C 3 -9 3 -4 0 0 C -3 -4 -3 -9 0 -14 Z" fill="#fff3c4" opacity=".9" />
      </g>
    </g>
  );
}

export default function CandleArt({ kind = "jar", className = "" }: { kind?: CandleKind; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="cf-glow">
          <stop offset="0" stopColor="#fab507" stopOpacity=".55" />
          <stop offset="1" stopColor="#fab507" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cf-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd75e" />
          <stop offset="1" stopColor="#f08a00" />
        </linearGradient>
        <linearGradient id="cf-wax" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={WAX_SHADE} />
          <stop offset=".45" stopColor={WAX} />
          <stop offset="1" stopColor={WAX_SHADE} />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="176" rx="62" ry="7" fill="#c78a00" opacity=".12" />

      {kind === "jar" && (
        <>
          <rect x="52" y="86" width="96" height="84" rx="14" fill={GLASS} opacity=".55" />
          <rect x="58" y="98" width="84" height="66" rx="9" fill="url(#cf-wax)" />
          <rect x="58" y="98" width="84" height="7" rx="3" fill="#fff" opacity=".35" />
          <rect x="52" y="84" width="96" height="9" rx="4" fill="#c78a00" />
          <rect x="99" y="76" width="2.5" height="12" rx="1" fill="#3b2b1a" />
          <rect x="70" y="118" width="60" height="24" rx="3" fill="#fbf9f5" opacity=".7" />
          <rect x="80" y="126" width="40" height="3" rx="1.5" fill="#7b5800" opacity=".7" />
          <rect x="88" y="132" width="24" height="2.5" rx="1" fill="#8c827a" opacity=".6" />
          <Flame x={100} y={74} />
        </>
      )}
      {kind === "votive" && (
        <>
          <path d="M66 120 h68 l-6 48 h-56 z" fill={GLASS} opacity=".55" />
          <path d="M71 128 h58 l-4 36 h-50 z" fill="url(#cf-wax)" />
          <rect x="62" y="116" width="76" height="8" rx="4" fill="#c78a00" />
          <rect x="99" y="108" width="2.5" height="10" rx="1" fill="#3b2b1a" />
          <Flame x={100} y={106} s={0.9} />
        </>
      )}
      {kind === "pillar" && (
        <>
          <rect x="76" y="62" width="48" height="108" rx="6" fill="url(#cf-wax)" />
          <rect x="76" y="62" width="48" height="8" rx="4" fill="#fff" opacity=".4" />
          <path d="M82 70 q4 14 0 22" stroke={WAX_SHADE} strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="99" y="52" width="2.5" height="13" rx="1" fill="#3b2b1a" />
          <Flame x={100} y={50} />
        </>
      )}
      {kind === "advent" && (
        <>
          <rect x="88" y="40" width="24" height="130" rx="5" fill="url(#cf-wax)" />
          <rect x="88" y="40" width="24" height="6" rx="3" fill="#fff" opacity=".4" />
          <rect x="88" y="110" width="24" height="4" fill="#fab507" opacity=".8" />
          <rect x="88" y="124" width="24" height="4" fill="#fab507" opacity=".5" />
          <rect x="99" y="30" width="2.5" height="12" rx="1" fill="#3b2b1a" />
          <Flame x={100} y={28} s={0.9} />
          <rect x="72" y="166" width="56" height="8" rx="3" fill="#c78a00" />
        </>
      )}
      {kind === "diya" && (
        <>
          <path d="M48 128 q52 -14 104 0 q-10 40 -52 40 q-42 0 -52 -40 z" fill="#c9783a" />
          <path d="M52 129 q48 -10 96 0 q-6 8 -48 8 q-42 0 -48 -8 z" fill="#e39a55" />
          <ellipse cx="100" cy="128" rx="46" ry="6" fill={WAX} />
          <rect x="99" y="116" width="2.5" height="12" rx="1" fill="#3b2b1a" />
          <Flame x={100} y={116} s={0.9} />
        </>
      )}
      {kind === "gift" && (
        <>
          <rect x="52" y="96" width="96" height="74" rx="6" fill="#c78a00" />
          <rect x="52" y="96" width="96" height="16" rx="4" fill="#2c2d2a" />
          <rect x="94" y="96" width="12" height="74" fill="#fab507" />
          <path d="M100 96 c-18 -22 -34 -6 -20 0 z M100 96 c18 -22 34 -6 20 0 z" fill="#fab507" />
          <rect x="116" y="68" width="22" height="30" rx="4" fill="url(#cf-wax)" transform="rotate(10 127 83)" />
          <Flame x={134} y={62} s={0.5} />
        </>
      )}
    </svg>
  );
}
