"use client";
import React from "react";

const Plans = () => {
  const plans = [
    { name: "Business Starter", price: "$25/mo", features: ["5GB Data", "Unlimited Calls", "1 Line"] },
    { name: "Professional", price: "$45/mo", features: ["25GB Data", "Priority Support", "5 Lines"] },
    { name: "Enterprise", price: "$80/mo", features: ["Unlimited Data", "Team Dashboard", "Dedicated Account Manager"] },
  ];

  return (
    <section className="w-full py-16 bg-[#f8fbff]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-[#1D5E8E]">Choose Your Plan</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className="p-8 bg-white rounded-2xl shadow hover:shadow-lg">
              <h3 className="text-xl font-semibold text-[#1D5E8E]">{plan.name}</h3>
              <p className="text-2xl text-black font-bold mt-2">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-black">
                {plan.features.map((f, j) => (
                  <li key={j}>- {f}</li>
                ))}
              </ul>
              <button className="mt-6 w-full py-2 bg-gradient-to-r from-[#41be58] to-[#438cbd] text-white rounded-md font-semibold">
                Switch SIM
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
