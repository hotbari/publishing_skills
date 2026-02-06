import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to local date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

/**
 * Format time to HH:MM
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/**
 * Calculate duration between two dates in minutes
 */
export function calculateDuration(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? new Date(start) : start
  const e = typeof end === 'string' ? new Date(end) : end
  return Math.floor((e.getTime() - s.getTime()) / (1000 * 60))
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Check if a time is within business hours
 * Returns: 'green' | 'yellow' | 'red'
 */
export function checkBusinessHours(
  visitTime: Date | string,
  openTime: string,
  closeTime: string
): 'green' | 'yellow' | 'red' {
  const visit = typeof visitTime === 'string' ? new Date(visitTime) : visitTime
  const visitHours = visit.getHours() * 60 + visit.getMinutes()

  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  if (visitHours < openMinutes || visitHours > closeMinutes) return 'red'
  if (visitHours < openMinutes + 30 || visitHours > closeMinutes - 30) return 'yellow'
  return 'green'
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
