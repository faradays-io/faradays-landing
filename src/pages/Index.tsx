import { motion } from "framer-motion";
import DotsCycle from "@/components/DotsCycle";
import SmileyPulse from "@/components/SmileyPulse";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 1.2,
    delay,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
});

const Index = () => {
  return (
    <div className="min-h-screen bg-page pt-20 pl-14 overflow-hidden">
      <motion.div {...fadeUp(0.2)} style={{ marginLeft: "-56px", marginTop: "-240px" }}>
        <video
          src="/faradays-title.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-[520px] pointer-events-none"
          style={{ mask: "radial-gradient(ellipse 85% 80% at 30% 50%, black 40%, transparent 100%)", WebkitMask: "radial-gradient(ellipse 85% 80% at 30% 50%, black 40%, transparent 100%)" }}
        />
      </motion.div>

      <div className="text-left mt-6" style={{ fontSize: "105%", marginTop: "-145px", marginLeft: -17, position: "relative", zIndex: 10 }}>
        <motion.p
          className="text-xs sm:text-sm font-pixel text-page-foreground/70 tracking-wide"
          {...fadeUp(0.8)}
        >
          Hello, world<DotsCycle />&nbsp; <SmileyPulse />
        </motion.p>

        <motion.p
          className="mt-8 text-[10px] sm:text-xs text-page-foreground/40 font-pixel tracking-wider"
          {...fadeUp(1.4)}
        >
          Até breve.
        </motion.p>

        <motion.p
          className="mt-4 text-[10px] sm:text-xs text-page-foreground/70 font-pixel tracking-wider max-w-[12rem] sm:max-w-[18rem] md:max-w-[24rem] leading-relaxed"
          {...fadeUp(1.8)}
        >
          Se não puder esperar, entre em contato no{" "}
          <a href="mailto:contato@faradays.io" className="underline hover:text-page-foreground">
            contato@faradays.io
          </a>
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
