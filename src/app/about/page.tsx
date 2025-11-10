"use client";
import React from "react";

const About = () => {
  return (
    <section className="w-full py-16 bg-[#f9fafb]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#1D5E8E] to-[#2bb673] bg-clip-text text-transparent">
          About Prosperity Tech Solutions
        </h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Based in Gawler South, South Australia, Prosperity Tech Solutions
          delivers reliable, client-centric IT support, phone systems, and
          communication software to empower local businesses.
        </p>
        <p className="mt-6 text-gray-600">
          Through our partnership with <strong>JUSTmobile.ai</strong>, we now
          offer the <strong>Prosperity Tech Service</strong> — a plug-and-play
          MVNO solution that enhances business mobility and integrates seamlessly
          with your existing IT ecosystem.
        </p>
      </div>
    </section>
  );
};

export default About;
