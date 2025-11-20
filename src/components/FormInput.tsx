"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  className,
  value,
  onChange,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const hasValue =
    (typeof value === "string" && value.length > 0) ||
    (typeof value === "number" && value !== 0);

  return (
    <div className="relative w-full max-w-md">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}

      <input
        {...props}
        value={value}
        onChange={onChange} // ✅ use parent handler
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "peer h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          icon && "pl-9",
          className
        )}
      />

      <motion.label
        animate={{
          y: focused || hasValue ? -22 : -4,
          x: icon ? 24 : 12,
          scale: focused || hasValue ? 0.85 : 1,
          color: focused ? "#2563eb" : "#6b7280",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white px-1 text-sm pointer-events-none"
      >
        {label}
      </motion.label>
    </div>
  );
};
