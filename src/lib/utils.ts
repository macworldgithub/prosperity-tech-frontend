import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDob = (isoDate:any) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;   // e.g. 15/03/1990
};

export const isDeleteIntent = (text: string) => {
  const t = text.toLowerCase();
  return (
    t.includes("delete my account") ||
    t.includes("close my account") ||
    t.includes("delete account") ||
    t.includes("close account")
  );
};