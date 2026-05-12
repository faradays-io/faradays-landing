import { useEffect, useRef } from "react";

const stats = [
  { value: "80%", label: "de redução em horas gastas em rotinas operacionais e de cobrança" },
  { value: "90%", label: "de redução em horas de contabilidade e financeiro via conciliação automática" },
  { value: "3 meses", label: "economizados por ano com geração automática de relatórios regulatórios" },
];

const StatsSection = () => {
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
    <section id="resultados" className="border-b border-[var(--line-soft)] bg-[var(--paper)]" style={{ padding: "var(--s-6, 64px) 0" }}>
      <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,40px)]">
        <h2 className="font-medium tracking-[-0.03em] leading-[1.08] mb-10 text-center" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
          Resultados que nossos clientes já viram
        </h2>
        <div ref={ref} className="reveal grid grid-cols-1 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-start text-center bg-transparent" style={{ padding: "var(--s-6, 64px) var(--s-5, 48px)" }}>
              <div className="group/stat inline-block font-medium leading-none tracking-[-0.035em] cursor-default h-[clamp(32px,4vw,52px)] flex items-center" style={{ fontSize: "clamp(32px, 4vw, 52px)" }}>
                <span className="transition-[color,font-weight] duration-[250ms] ease-out group-hover/stat:text-[oklch(0.82_0.12_90)] group-hover/stat:font-bold">{stat.value}</span>
              </div>
              <div className="mt-2.5 text-[13px] text-[var(--muted-color)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;