import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowWeWork from "@/components/HowWeWork";
import StatsSection from "@/components/StatsSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowWeWork />
      <StatsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
