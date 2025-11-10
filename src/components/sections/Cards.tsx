"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface PlanCardProps {
  title: string;
  data: string;
  price: string;
  features?: string[];
  highlight?: boolean;
  network?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  data,
  price,
  features = [],
  highlight = false,
  network,
}) => {
  const router = useRouter();

  const handleClick = () => {
    // Encode plan name to make it URL-safe
    const encodedTitle = encodeURIComponent(title);
    router.push(`/chat-window?plan=${encodedTitle}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer rounded-2xl shadow-lg p-6 sm:p-8 text-center transition-all duration-300 ${
        highlight
          ? "bg-gradient-to-b from-[#0f3046] to-[#1a5324] text-white scale-[1.02]"
          : "bg-white text-gray-800 hover:shadow-2xl"
      } hover:scale-[1.03]`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      <div className="flex justify-center items-center space-x-2 mb-4">
        <span className="text-3xl font-bold">{data}</span>
        {network && (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              network === "5G"
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            {network}
          </span>
        )}
      </div>

      <p className="text-2xl font-semibold mb-4">{price}</p>

      <ul className="text-sm space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="opacity-90">
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2 rounded-lg font-medium transition-all ${
          highlight
            ? "bg-white text-[#1a5324] hover:opacity-80"
            : "bg-gradient-to-r from-[#0f3046] to-[#1a5324] text-white hover:opacity-90"
        }`}
      >
        Choose this Plan
      </button>
    </div>
  );
};

export default PlanCard;
