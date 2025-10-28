import React from "react";
import PlanCard from "./Cards";

const Small: React.FC = () => {
  const plans = [
    {
      title: "Basic Plan",
      data: "65GB",
      price: "$37.55",
      features: [
        "Unlimited standard calls.",
        "Unlimited SMS to Australian Numbers.",
        "5G Network Access",
      ],
    },
    {
      title: "Standard Plan",
      data: "100GB",
      price: "$46.40",
      highlight: true,
      features: [
        "Unlimited standard calls.",
        "Unlimited SMS to Australian Numbers.",
        "5G Network Access",
      ],
    },
    {
      title: "Premium Plan",
      data: "120GB",
      price: "$54.86",
      features: [
        "Unlimited standard calls.",
        "Unlimited SMS to Australian Numbers.",
        "5G Network Access",
      ],
    },
    {
      title: "Elite Plan",
      data: "150GB",
      price: "$59.89",
      features: [
        "Unlimited standard calls.",
        "Unlimited SMS to Australian Numbers.",
        "5G Network Access",
      ],
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-[#1D5E8E]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white">
            Big Plans
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/80">
            Get the highest level of protection and privacy at a price that
            suits you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p, i) => (
            <PlanCard
              key={i}
              title={p.title}
              data={p.data}
              price={p.price}
              features={p.features}
              highlight={(p as any).highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Small;
