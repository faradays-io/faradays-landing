import { motion } from "framer-motion";
import ElectricWire from "@/components/ElectricWire";
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
    <div className="min-h-screen bg-page pt-20 pl-20">
      <div className="text-left">
        <motion.h1
          className="font-pixel text-2xl sm:text-4xl md:text-5xl tracking-wide text-page-foreground"
          {...fadeUp(0.2)}
        >
          Faradays
        </motion.h1>

        <motion.p
          className="mt-6 text-xs sm:text-sm font-pixel text-page-foreground/70 tracking-wide"
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
      </div>

      <ElectricWire />
    </div>
  );
};

export default Index;
