"use client";
import React from "react";

const Services = () => {
  const services = [
    {
      title: "Managed IT Services",
      desc: "End-to-end management of your IT infrastructure, ensuring uptime and security.",
    },
    {
      title: "Custom Software Development",
      desc: "Tailored apps and integrations designed to simplify your business operations.",
    },
    {
      title: "Business Phone Systems",
      desc: "Reliable VoIP and mobile solutions integrated with your existing systems.",
    },
    {
      title: "Prosperity Tech Service (MVNO)",
      desc: "Switch your SIM to Prosperity Tech’s branded service powered by JUSTmobile.ai.",
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-[#1D5E8E]">
          Our Services
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#f5f9ff] shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-[#1D5E8E]">
                {s.title}
              </h3>
              <p className="mt-3 text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
