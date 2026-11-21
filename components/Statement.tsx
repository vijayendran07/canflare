/** Large typographic statement. Words fade in as they scroll into view (CSS scroll-driven; static text elsewhere). Wrap words in *stars* to highlight. */
export default function Statement({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <p className={`statement ${className}`}>
      {parts.flatMap((p, i) => {
        const hl = p.startsWith("*");
        return (hl ? p.slice(1, -1) : p).split(" ").filter(Boolean).map((w, j) => (
          <span key={`${i}-${j}`} className={`w ${hl ? "hl" : ""}`}>{w}{" "}</span>
        ));
      })}
    </p>
  );
}
