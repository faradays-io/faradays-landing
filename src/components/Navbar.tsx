import { useEffect, useState } from "react";
import logo from "@/assets/faradays-logo.png";

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px]">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[var(--line-soft)]" : "border-b border-transparent"
      }`}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "saturate(150%) blur(12px)",
        WebkitBackdropFilter: "saturate(150%) blur(12px)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,40px)] flex items-center justify-between h-[72px]">
        <a href="#" className="inline-flex items-center gap-2.5" aria-label="Faradays">
          <img src={logo} alt="Faradays" className="h-7 w-auto block" />
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--muted-color)]" aria-label="Primário" />

        <a
          href="#agendar"
          className="group hidden md:inline-flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium rounded-full border border-[var(--line)] text-[var(--ink)] bg-transparent hover:border-[var(--ink)] transition-all whitespace-nowrap"
        >
          Agende um diagnóstico gratuito
          <ArrowIcon />
        </a>
      </div>
    </header>
  );
};

export default Navbar;