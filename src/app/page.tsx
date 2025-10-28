import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import FAQSection from "@/components/sections/FAQSection";
import Features from "@/components/sections/Features";
import ChatWindow from "@/components/ChatWindow";
import Contact from "@/components/sections/Contact";

import Kind from "@/components/sections/Kind";
import Productive from "@/components/sections/Productive";
import Small from "@/components/sections/Small";
import Big from "@/components/sections/Big";
export default function HomePage() {
  return (
    <main className="relative">
      {/* <Navbar />
      <HeroSection />
      <Features />
      <Small />
      <Big />
      <Productive />
      <Kind />

      <FAQSection />
      <Contact /> */}

      <ChatWindow />
    </main>
  );
}
