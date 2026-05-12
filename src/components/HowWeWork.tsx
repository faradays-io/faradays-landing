import { useEffect, useRef } from "react";

const columns = [
  {
    title: "Plataforma única e customizada",
    items: [
      { highlight: true, text: "Dashboard único e customizado para todas as suas rotinas" },
      { highlight: false, text: "Fluxos automáticos de aprovação, edição e validação de documentos" },
      { highlight: false, text: "Compliance, cadastro e cobrança automatizados" },
      { highlight: false, text: "Robôs autônomos para processos em contas correntes" },
    ],
  },
  {
    title: "Integração completa entre sistemas",
    items: [
      { highlight: false, text: "Conexão entre seus ERPs, planilhas e sistemas internos" },
      { highlight: false, text: "Conciliação automática de saldos entre sistemas e bancos" },
      { highlight: false, text: "Geração de relatórios para investidores e reguladores" },
    ],
  },
  {
    title: "IA & Agentes especializados",
    items: [
      { highlight: true, text: "Consultoria no uso de IA", suffix: " que realmente aumenta a produtividade da equipe" },
      { highlight: false, text: "Esteira automática para vendas, suporte e cobrança" },
      { highlight: true, text: "Automação completa para seu atendimento", suffix: " via e-mail e WhatsApp" },
    ],
  },
];

const useReveal = () => {
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
  return ref;
};

const HowWeWork = () => {
  const headRef = useReveal();
  const gridRef = useReveal();
  const accent = "oklch(0.82 0.12 90)";

  return (
    <section id="como" className="border-t border-b border-[var(--line-soft)] bg-[var(--paper)]" style={{ padding: "clamp(72px, 10vw, 140px) 0" }}>
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,40px)]">
        <div ref={headRef} className="reveal flex flex-col gap-6 max-w-[860px] mb-16">
          <h2 className="font-medium tracking-[-0.03em] leading-[1.08]" style={{ fontSize: "clamp(30px, 4vw, 48px)" }}>
            Automatizamos seus processos de ponta a ponta.
          </h2>
          <p className="text-[var(--muted-color)]" style={{ fontSize: "clamp(16px, 1.4vw, 19px)" }}>
            A Faradays faz o diagnóstico da sua operação e entrega automações sob medida,{" "}
            <span style={{ color: accent, fontWeight: 600 }}>
              por meio de uma plataforma 100% customizada à sua empresa
            </span>
            , combinando soluções tradicionais com IA de ponta. Você não precisa trocar seus sistemas atuais. Nós integramos com o que já existe.
          </p>
        </div>

        <div ref={gridRef} className="reveal grid md:grid-cols-3 border-l border-r border-[var(--line)]">
          {columns.map((col) => (
            <article key={col.title} className="flex flex-col gap-6 bg-white border-r border-[var(--line)] last:border-r-0" style={{ padding: "var(--s-6, 64px) var(--s-5, 48px)" }}>
              <div className="flex flex-col gap-3">
                <h3 className="text-[18px] font-semibold tracking-[-0.015em]">{col.title}</h3>
                <span className="block w-10 h-[2px]" style={{ background: accent }} />
              </div>
              <ul className="flex flex-col gap-4">
                {col.items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-[15px] leading-[1.55] text-[var(--muted-color)]">
                    <span className="mt-[6px] shrink-0" style={{ color: accent }}>▸</span>
                    <span>
                      <span style={item.highlight ? { color: accent, fontWeight: 600 } : undefined}>
                        {item.text}
                      </span>
                      {"suffix" in item && item.suffix ? <span>{item.suffix}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
