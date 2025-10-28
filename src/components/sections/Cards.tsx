import React from "react";
import { CiCircleCheck } from "react-icons/ci";
type PlanCardProps = {
  title: string;
  data: string;
  price: string;
  frequency?: string;
  features: string[];
  highlight?: boolean;
};

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  data,
  price,
  frequency = "/ month",
  features,
  highlight = false,
}) => {
  return (
    <div className="group rounded-2xl bg-[#1720343D] text-white p-6 sm:p-8 shadow-xl border border-white/10 ">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[#202C3C]">
        {title}
      </div>

      <div className="text-sm opacity-80">{data}</div>

      <div className="mt-1 flex items-end gap-2">
        <div className="text-3xl sm:text-4xl font-bold">{price}</div>
        <div className="text-sm opacity-80">{frequency}</div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          className={`w-full sm:w-auto px-6 py-2 rounded-full font-semibold shadow-md transition bg-white text-[#0E3B5C] hover:bg-[#2bb673] hover:text-white group-hover:bg-[#2bb673] group-hover:text-white`}
        >
          Choose This Plan
        </button>
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold mb-3">Features include:</div>
        <ul className="space-y-2 text-sm">
          {features.map((f, idx) => (
            <li key={idx} className="flex items-start gap-2">
              {/* <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#2bb673]" /> */}
              <CiCircleCheck className="mt-1 text-[#f5f8f7] flex-shrink-0 " />
              <span className="opacity-90">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanCard;
