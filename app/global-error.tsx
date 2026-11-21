"use client";

/** Last-resort error page (renders outside the layout, so it carries its own minimal styling). */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#0c0a08", color: "#f3ead6", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 32 }}>Something went wrong</h1>
          <p style={{ color: "#c9bfa8" }}>Please try again. If it keeps happening, message us on WhatsApp.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: "12px 24px", borderRadius: 10, border: 0, background: "#fab507", color: "#1b1c1a", fontWeight: 700, fontSize: 15 }}>Try again</button>
        </div>
      </body>
    </html>
  );
}
