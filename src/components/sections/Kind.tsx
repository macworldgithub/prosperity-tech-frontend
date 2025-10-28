"use client";
import React from "react";

const Star = ({ filled = true }: { filled?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#1D5E8E" : "none"}
    stroke={filled ? "#1D5E8E" : "none"}
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.48 3.499a.562.562 0 011.04 0l2.062 4.178a.563.563 0 00.424.306l4.616.671c.518.075.725.712.35 1.077l-3.34 3.257a.563.563 0 00-.162.498l.788 4.596a.562.562 0 01-.815.592l-4.125-2.168a.563.563 0 00-.524 0L7.769 18.67a.562.562 0 01-.815-.592l.788-4.596a.563.563 0 00-.162-.498l-3.34-3.257a.563.563 0 01.35-1.077l4.616-.671a.563.563 0 00.424-.306l2.062-4.178z"
    />
  </svg>
);

const Card = ({ text, name }: { text: string; name: string }) => (
  <div className="rounded-3xl bg-[#1720343D] border border-white/10 p-6 sm:p-8 text-white/95 shadow-xl">
    <p className="mb-6 leading-relaxed">{text}</p>
    <div className="flex items-center gap-1 mb-4 opacity-90">
      <Star />
      <Star />
      <Star />
      <Star />
      <Star filled={false} />
    </div>
    <div className="text-sm text-white/80">{name}</div>
  </div>
);

const Kind = () => {
  const testimonials = [
    {
      text: "This is the most impactful design course I've ever taken. I love the tasks for each lesson. It's all been incredibly worthwhile!",
      name: "Jennie Weigle",
    },
    {
      text: "This is the most impactful design course I've ever taken. I love the tasks for each lesson. It's all been incredibly worthwhile!",
      name: "Jennie Weigle",
    },
    {
      text: "This is the most impactful design course I've ever taken. I love the tasks for each lesson. It's all been incredibly worthwhile!",
      name: "Jennie Weigle",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-[#1D5E8E] ">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Kind words they
              <br />
              <span className="text-[#2bb673]">say about us</span>
            </h2>
          </div>
          <button className="px-4 py-2 rounded-xl border border-white/25 text-white/90 hover:bg-white/10 transition">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} text={t.text} name={t.name} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Kind;
