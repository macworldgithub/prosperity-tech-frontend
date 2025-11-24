"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  variant?: "body" | "muted" | "small" | "highlight";
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  className,
}) => {
  const variants = {
    body: "text-base text-gray-700",
    muted: "text-sm text-gray-500",
    small: "text-xs text-gray-500",
    highlight: "text-base text-blue-600 font-medium",
  };

  return (
    <motion.p
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(variants[variant], className)}
    >
      {children}
    </motion.p>
  );
};
