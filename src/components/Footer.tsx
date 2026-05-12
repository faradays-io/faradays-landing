import logo from "@/assets/faradays-logo.png";
import { scrollToSection } from "@/lib/smoothScroll";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--line-soft)] text-[var(--muted-color)] text-[13px]" style={{ padding: "var(--s-6, 64px) 0 var(--s-5, 48px)" }}>
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,40px)]">
        <div className="flex justify-between items-center gap-8 flex-wrap">
          <a href="#" onClick={scrollToSection("")} aria-label="Faradays">
            <img src={logo} alt="Faradays" className="h-[22px] w-auto block" />
          </a>
          <nav className="flex gap-8" aria-label="Rodapé">
            <a href="mailto:contato@faradays.io" className="hover:text-[var(--ink)] transition-colors">contato@faradays.io</a>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-[var(--line-soft)] flex justify-between flex-wrap gap-3 text-[var(--muted-2)] text-xs">
          <span>© 2026 Faradays Consulting LTDA. Todos os direitos reservados.</span>
          <span>CNPJ 65.590.441/0001-36 · São Paulo, Brasil</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;