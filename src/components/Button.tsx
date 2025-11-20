"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
        outline:
          "border border-gray-300 bg-white text-gray-800 hover:bg-blue-100 focus-visible:ring-gray-400",
        ghost:
          "text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-300 dark:text-white dark:hover:bg-gray-800",
        gradient:
          "bg-gradient-to-r from-[#13AFF0] to-[#EB0FB6] text-white hover:opacity-90 focus-visible:ring-pink-400",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs sm:text-sm md:text-sm",
        md: "h-10 px-4 text-sm sm:text-base md:text-base",
        lg: "h-12 px-6 text-base sm:text-lg md:text-lg",
        xl: "h-14 px-8 text-lg sm:text-xl md:text-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref" | "children">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  isLoading,
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  disabled,
  type = "button",
  ...props
}) => (
  <motion.button
    type={type}
    whileTap={{ scale: 0.97 }}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    disabled={isLoading || disabled}
    aria-busy={isLoading}
    aria-disabled={isLoading || disabled}
    className={cn(buttonVariants({ variant, size, fullWidth }), className)}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin" />
    ) : (
      leftIcon && (
        <span className="mr-2 flex items-center">
          {React.cloneElement(
            leftIcon as React.ReactElement<{ className?: string }>,
            {
              className: "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6",
            }
          )}
        </span>
      )
    )}

    <span className="whitespace-nowrap">{children}</span>

    {!isLoading && rightIcon && (
      <span className="ml-2 flex items-center">
        {React.cloneElement(
          rightIcon as React.ReactElement<{ className?: string }>,
          {
            className: "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6",
          }
        )}
      </span>
    )}
  </motion.button>
);
