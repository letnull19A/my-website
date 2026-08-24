import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function vibrateOnTap(e: { pointerType?: string }, duration = 10) {
  if (e.pointerType !== "touch") return
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(duration)
  }
}
