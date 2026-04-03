import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes efficiently in React Native.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates current blur intensity based on message count.
 * Starting intensity: 100 (fully blurred)
 * Increment: -10 per message
 * Min: 0 (fully unblurred)
 *
 * @param messageCount Total messages in the chat session.
 * @returns number (0-100)
 */
export function calculateBlurIntensity(messageCount: number): number {
  const baseIntensity = 100;
  const reductionPerMessage = 10;
  const currentIntensity = baseIntensity - (messageCount * reductionPerMessage);
  
  return Math.max(0, currentIntensity);
}
