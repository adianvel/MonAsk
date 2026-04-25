import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: string | number | bigint | undefined, decimals = 6): string {
  if (value === undefined || value === null) return '0.00'
  const num = typeof value === 'bigint' ? Number(value) / 10 ** decimals : Number(value)
  if (isNaN(num)) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
