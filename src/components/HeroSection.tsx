import { useEffect, useRef } from "react";
import { scrollToSection } from "@/lib/smoothScroll";

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SilkBackground = () => (
  <div className="silk" aria-hidden="true">
    <div className="silk__layer silk__layer--a" />
    <div className="silk__layer silk__layer--b" />
    <svg className="silk__wave" viewBox="0 0 1600 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.98 0.02 95)" stopOpacity="0" />
          <stop offset="25%" stopColor="oklch(0.94 0.08 92)" stopOpacity="0.9" />
          <stop offset="50%" stopColor="oklch(0.82 0.14 88)" stopOpacity="1" />
          <stop offset="75%" stopColor="oklch(0.88 0.11 85)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="oklch(0.98 0.02 95)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="waveGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.95 0.04 90)" stopOpacity="0" />
          <stop offset="50%" stopColor="oklch(0.85 0.14 88)" stopOpacity="0.65" />
          <stop offset="100%" stopColor="oklch(0.95 0.04 90)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="wave-glow" d="M -50 420 C 300 380, 520 260, 800 320 S 1300 520, 1700 360">
        <animate attributeName="d" dur="14s" repeatCount="indefinite"
          values="M -50 420 C 300 380, 520 260, 800 320 S 1300 520, 1700 360;M -50 440 C 300 320, 520 340, 800 280 S 1300 480, 1700 400;M -50 400 C 300 420, 520 220, 800 360 S 1300 560, 1700 320;M -50 420 C 300 380, 520 260, 800 320 S 1300 520, 1700 360"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </path>
      <path className="wave-core" d="M -50 420 C 300 380, 520 260, 800 320 S 1300 520, 1700 360">
        <animate attributeName="d" dur="14s" repeatCount="indefinite"
          values="M -50 420 C 300 380, 520 260, 800 320 S 1300 520, 1700 360;M -50 440 C 300 320, 520 340, 800 280 S 1300 480, 1700 400;M -50 400 C 300 420, 520 220, 800 360 S 1300 560, 1700 320;M -50 420 C 300 380, 520 260, 800 320 S 1300 520, 1700 360"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </path>
      <path className="wave-hair" d="M -50 418 C 300 378, 520 258, 800 318 S 1300 518, 1700 358">
        <animate attributeName="d" dur="16s" repeatCount="indefinite"
          values="M -50 418 C 300 378, 520 258, 800 318 S 1300 518, 1700 358;M -50 438 C 300 318, 520 338, 800 278 S 1300 478, 1700 398;M -50 398 C 300 418, 520 218, 800 358 S 1300 558, 1700 318;M -50 418 C 300 378, 520 258, 800 318 S 1300 518, 1700 358"
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" />
      </path>
    </svg>
  </div>
);

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden isolate" style={{ padding: "clamp(64px, 10vw, 140px) 0 clamp(80px, 12vw, 180px)" }}>
      <SilkBackground />

      <div ref={ref} className="reveal relative z-[2] max-w-[1200px] mx-auto px-[clamp(20px,4vw,40px)]">
        <div className="flex flex-col gap-8 max-w-[960px]">
          <h1 className="font-medium tracking-[-0.035em] leading-[1.02]" style={{ fontSize: "clamp(40px, 6vw, 76px)" }}>
            Transforme processos manuais em<br />
            <span className="text-[var(--muted-color)]" style={{ fontStyle: "normal" }}>vantagem competitiva.</span>
          </h1>

          <p className="text-[var(--muted-color)] max-w-[56ch]" style={{ fontSize: "clamp(16px, 1.4vw, 19px)", textWrap: "pretty" as any }}>
            Desenhamos e entregamos automações em um dashboard customizado, que reduzem custo, aceleram a operação e destravam crescimento. Implementamos sua primeira demo em questão de dias. 
          </p>

          <div className="flex gap-3.5 flex-wrap mt-4">
            <a href="https://cal.com/elymansur/45min" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 px-[22px] py-3.5 text-sm font-medium rounded-full bg-[var(--ink)] text-white border border-transparent hover:bg-[oklch(0.82_0.12_90)] hover:text-[var(--ink)] hover:border-[oklch(0.82_0.12_90)] transition-all whitespace-nowrap">
              Agende um diagnóstico gratuito
              <ArrowIcon />
            </a>
            <a href="#como" onClick={scrollToSection("como")} className="group inline-flex items-center gap-2.5 px-[22px] py-3.5 text-sm font-medium rounded-full bg-transparent text-[var(--ink)] border border-[var(--line)] hover:border-[var(--ink)] transition-all whitespace-nowrap">
              Como atuamos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;