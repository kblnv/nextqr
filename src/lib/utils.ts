import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function textIsUrl(text: string): boolean {
  try {
    return Boolean(new URL(text));
  } catch (err) {
    return false;
  }
}
