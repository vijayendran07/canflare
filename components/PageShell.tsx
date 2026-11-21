export default function PageShell({ title, intro, eyebrow = "Canflare", children }: { title: string; intro?: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <>
      <header className="stage on-stage">
        <div className="container-x max-w-3xl py-10 sm:py-16">
          <p className="eyebrow eyebrow-gold animate-rise">{eyebrow}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl animate-rise [animation-delay:80ms]">{title}</h1>
          {intro && <p className="mt-3 max-w-xl text-on-stage-soft animate-rise [animation-delay:160ms]">{intro}</p>}
        </div>
      </header>
      <div className="section-bg bg-corners">
        <div className="container-x max-w-3xl py-8 sm:py-12">
          <div className="prose-page">{children}</div>
        </div>
      </div>
    </>
  );
}
