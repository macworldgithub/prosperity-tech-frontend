import Navbar from "@/components/layout/Navbar";
import Contact from "@/components/sections/Contact";

import Kind from "@/components/sections/Kind";
import Productive from "@/components/sections/Productive";
import Small from "@/components/sections/Small";
import Big from "@/components/sections/Big";
export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Small />
      <Big />
      <Productive />
      <Kind />
      <Contact />
    </main>
  );
}
