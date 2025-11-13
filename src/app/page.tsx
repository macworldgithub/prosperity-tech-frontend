import HeroSection from "@/components/sections/HeroSection";
import FAQSection from "@/components/sections/FAQSection";
import Features from "@/components/sections/Features";

import Contact from "@/components/sections/Contact";

import Kind from "@/components/sections/Kind";
import Productive from "@/components/sections/Productive";
import Small from "@/components/sections/Small";
export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <Features />
      <Small />
      <Productive />
      <Kind />
      <FAQSection />
      <Contact />
    </main>
  );
}
