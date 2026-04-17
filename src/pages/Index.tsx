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
    <div className="min-h-screen bg-page pt-0 pl-0 overflow-hidden">
      <motion.div {...fadeUp(0.2)}>
        <img
          src="/faradays-logo-bright.png"
          alt="Faradays"
          className="w-[360px] pointer-events-none"
        />
      </motion.div>

      <div className="text-left -mt-2 pl-[52px]" style={{ fontSize: "105%", position: "relative", zIndex: 10 }}>
        <motion.p
          className="text-sm sm:text-base font-pixel text-page-foreground/70 tracking-wide"
          {...fadeUp(0.8)}
        >
          Hello, world<DotsCycle />&nbsp; <SmileyPulse />
        </motion.p>

        <motion.p
          className="mt-8 text-xs sm:text-sm text-page-foreground/40 font-pixel tracking-wider"
          {...fadeUp(1.4)}
        >
          Até breve.
        </motion.p>

        <motion.p
          className="mt-4 text-xs sm:text-sm text-page-foreground/70 font-pixel tracking-wider max-w-[14rem] sm:max-w-[20rem] md:max-w-[26rem] leading-relaxed"
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
