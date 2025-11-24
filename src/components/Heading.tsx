"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  align = "left",
  level = 2,
  className,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeStyles: Record<number, string> = {
    1: "text-[clamp(2rem,5vw,3.5rem)] font-extrabold", // h1 — Hero size
    2: "text-[clamp(1.75rem,4vw,2.75rem)] font-bold",  // h2 — Section title
    3: "text-[clamp(1.5rem,3vw,2.25rem)] font-semibold", // h3 — Subsection
    4: "text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold", // h4 — Minor heading
    5: "text-[clamp(1.1rem,2vw,1.4rem)] font-medium", // h5 — Small heading
    6: "text-[clamp(1rem,1.8vw,1.2rem)] font-medium", // h6 — Caption heading
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "mb-4 flex flex-col gap-1",
        align === "center" && "text-center items-center",
        align === "right" && "text-right items-end"
      )}
    >
      {React.createElement(
        Tag,
        {
          className: cn(
            sizeStyles[level],
            "text-gray-900 leading-tight tracking-tight",
            className
          ),
        },
        title
      )}

      {subtitle && (
        <p className="text-sm sm:text-base text-gray-500">{subtitle}</p>
      )}
    </motion.div>
  );
};
