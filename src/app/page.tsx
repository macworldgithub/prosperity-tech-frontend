import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import FAQSection from "@/components/sections/FAQSection";
import Features from "@/components/sections/Features";
import ChatWindow from "@/components/ChatWindow";

export default function HomePage() {
  return (
    <main className="relative">
      <ChatWindow />
      {/* <Navbar />
      <HeroSection />
      <Features />
      <FAQSection /> */}
    </main>
  );
}
