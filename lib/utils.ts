import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { MaterialCategory } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: string): string {
  return `${currency}${Math.round(value).toLocaleString('en-IN')}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN')
}

export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`
}

export function categoryBadgeClass(category: MaterialCategory): string {
  const map: Record<MaterialCategory, string> = {
    Structure: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    Masonry: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Finishing: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    MEP: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    Fixtures: 'bg-pink-50 text-pink-700 ring-pink-600/20',
    Misc: 'bg-slate-50 text-slate-600 ring-slate-500/20',
  }
  return map[category] ?? map.Misc
}

export function sumBy<T>(arr: T[], fn: (item: T) => number): number {
  return arr.reduce((s, item) => s + fn(item), 0)
}
