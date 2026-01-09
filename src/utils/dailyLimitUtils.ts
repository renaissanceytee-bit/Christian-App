/**
 * Utility functions for managing daily quiz limits
 */

export const DAILY_INCORRECT_LIMIT = 3

/**
 * Check if user is a premium subscriber
 */
export function hasPremium(): boolean {
  return localStorage.getItem('hasPremium') === '1'
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Get the number of incorrect answers used today
 */
export function getDailyIncorrectCount(): number {
  const today = getTodayDateString()
  const lastCheckDate = localStorage.getItem('daily_limit_date')

  // Reset if it's a new day
  if (lastCheckDate !== today) {
    localStorage.setItem('daily_limit_date', today)
    localStorage.setItem('daily_incorrect_count', '0')
    return 0
  }

  return parseInt(localStorage.getItem('daily_incorrect_count') || '0')
}

/**
 * Check if user has reached the daily incorrect answer limit
 */
export function hasReachedDailyLimit(): boolean {
  if (hasPremium()) return false // Premium users have no limit
  return getDailyIncorrectCount() >= DAILY_INCORRECT_LIMIT
}

/**
 * Increment the daily incorrect answer count
 */
export function incrementDailyIncorrect(): void {
  if (hasPremium()) return // Premium users don't track this

  const today = getTodayDateString()
  const lastCheckDate = localStorage.getItem('daily_limit_date')
  let incorrectCount = parseInt(localStorage.getItem('daily_incorrect_count') || '0')

  // Reset if it's a new day
  if (lastCheckDate !== today) {
    incorrectCount = 0
    localStorage.setItem('daily_limit_date', today)
  }

  incorrectCount++
  localStorage.setItem('daily_incorrect_count', String(incorrectCount))
}

/**
 * Reset daily limit (useful for testing or premium conversion)
 */
export function resetDailyLimit(): void {
  localStorage.setItem('daily_limit_date', getTodayDateString())
  localStorage.setItem('daily_incorrect_count', '0')
}

/**
 * Get remaining attempts for the day
 */
export function getRemainingAttempts(): number {
  if (hasPremium()) return Infinity
  return Math.max(0, DAILY_INCORRECT_LIMIT - getDailyIncorrectCount())
}
