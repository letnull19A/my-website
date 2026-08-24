import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function vibrateOnTap(
  e?: { pointerType?: string; nativeEvent?: unknown } | null,
  duration = 10
) {
  let pointerType = e?.pointerType;
  if (!pointerType && e && "nativeEvent" in e) {
    pointerType = (e.nativeEvent as { pointerType?: string } | null)?.pointerType;
  }
  if (pointerType !== "touch") return;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(duration);
  }
}
