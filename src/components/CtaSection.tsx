import { scrollToSection } from "@/lib/smoothScroll";

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CtaSection = () => {
  return (
    <section id="agendar" className="relative bg-[var(--ink)] text-white overflow-hidden isolate">
      <div className="cta__glow" aria-hidden="true" />
      <div className="relative z-[2] max-w-[820px] mx-auto px-[clamp(20px,4vw,40px)]" style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <div className="flex flex-col gap-6">
          <h2 className="font-medium tracking-[-0.03em] leading-[1.08] text-white" style={{ fontSize: "clamp(30px, 4vw, 48px)" }}>
            Veja o que vamos te entregar após a primeira conversa de 30 minutos
          </h2>

          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(16px, 1.4vw, 19px)" }}>
            Uma conversa objetiva, sem compromisso. Saímos dela com um plano de ação claro e priorizado para o seu negócio.
          </p>

          <a href="#" onClick={scrollToSection("")} className="group inline-flex items-center gap-2.5 self-start mt-6 px-[22px] py-3.5 text-sm font-medium rounded-full bg-white text-[var(--ink)] border border-transparent hover:bg-[oklch(0.82_0.12_90)] hover:text-[var(--ink)] hover:border-[oklch(0.82_0.12_90)] transition-all whitespace-nowrap">
            Agende um diagnóstico gratuito
            <ArrowIcon />
          </a>

          <p className="mt-10 max-w-[680px] leading-[1.6] text-xl text-white">
            Fundada por profissionais ex-{" "}
            {["XP", "Google", "Bradesco BBI", "Barzel Properties"].map((b, i, arr) => (
              <span key={b}>
                <span style={{ color: "oklch(0.82 0.12 90)", fontWeight: 500 }}>{b}</span>
                {i < arr.length - 1 ? ", " : ""}
              </span>
            ))}
            , combinamos experiência em tecnologia, operações e mercado financeiro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;