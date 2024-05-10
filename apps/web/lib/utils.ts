import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: string | string[]) {
  if (Array.isArray(error)) {
    return error[0];
  } else return error;
}
