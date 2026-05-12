import {Habit} from '@shared/types/habit';
import {STRINGS} from '@shared/constants/strings';

const MONTHS_LONG = STRINGS.MONTHS.FULL;
const MONTHS_SHORT = STRINGS.MONTHS.SHORT;

export function formatDisplayDate(dateStr: any): string {
  if (!dateStr) return 'N/A';

  try {
    let datePart = '';

    // Handle Firestore Timestamp objects ({_seconds, _nanoseconds})
    if (typeof dateStr === 'object' && (dateStr._seconds !== undefined || dateStr.seconds !== undefined)) {
      const seconds = dateStr._seconds ?? dateStr.seconds;
      const date = new Date(seconds * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const monthName = MONTHS_SHORT[month - 1] || 'N/A';
      return `${monthName}, ${day}, ${year}`;
    }

    if (typeof dateStr !== 'string') return 'N/A';

    // Handle ISO strings and YYYY-MM-DD
    datePart = dateStr.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) return dateStr;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const monthName = MONTHS_SHORT[month - 1] || 'N/A';
    return `${monthName}, ${day}, ${year}`;
  } catch (e) {
    console.warn('Date formatting failed:', e);
    return 'N/A';
  }
}

export function getFrequencyDescription(habit: Partial<Habit>): string {
  const start = habit.startDate ? new Date(habit.startDate) : new Date();
  const day = start.getDate();
  const month = MONTHS_LONG[start.getMonth()];

  if (habit.isOneTime) {
    return `One-time task on ${month} ${day}`;
  }

  if (habit.isOneTime) {
    return STRINGS.HABITS.DESCRIPTIONS.ONE_TIME(month, day);
  }

  switch (habit.frequency) {
    case 'daily':
      return STRINGS.HABITS.DESCRIPTIONS.EVERY_DAY;

    case 'weekly':
      if (habit.daysTarget && habit.daysTarget.length > 0) {
        if (habit.daysTarget.length === 7) return STRINGS.HABITS.DESCRIPTIONS.EVERY_DAY;
        return `${STRINGS.HABITS.DESCRIPTIONS.EVERY}${habit.daysTarget.map(d => d.substring(0, 3)).join(', ')}`;
      }
      return STRINGS.HABITS.DESCRIPTIONS.TIMES_PER_WEEK(habit.targetPerWeek || 0);

    case 'monthly':
      if (habit.datesTarget && habit.datesTarget.length > 0) {
        const sortedDates = [...habit.datesTarget].sort((a, b) => a - b);
        const datesStr = sortedDates.map(d => getOrdinal(d)).join(', ');
        return `${STRINGS.HABITS.DESCRIPTIONS.EVERY}${datesStr}${STRINGS.HABITS.DESCRIPTIONS.OF_MONTH}`;
      }
      return STRINGS.HABITS.DESCRIPTIONS.TIMES_PER_MONTH(habit.targetPerMonth || 0);

    case 'quarterly':
      return STRINGS.HABITS.DESCRIPTIONS.OF_EVERY_3_MONTHS(getOrdinal(day));

    case 'half-yearly':
      return STRINGS.HABITS.DESCRIPTIONS.OF_EVERY_6_MONTHS(getOrdinal(day));

    case 'yearly':
      return STRINGS.HABITS.DESCRIPTIONS.EVERY_YEAR(getOrdinal(day), month);

    case 'custom':
      if (habit.specificDatesTarget && habit.specificDatesTarget.length > 0) {
        return STRINGS.HABITS.DESCRIPTIONS.SPECIFIC_DATES(habit.specificDatesTarget.length);
      }
      return STRINGS.HABITS.DESCRIPTIONS.CUSTOM_SCHEDULE;

    default:
      return STRINGS.HABITS.DESCRIPTIONS.CUSTOM_SCHEDULE;
  }
}

export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Calculates the current streak for a habit.
 * For daily habits, it counts consecutive days ending today or yesterday.
 * For weekly habits, it counts consecutive completions (simplified).
 */
export function calculateStreak(habit: Habit): number {
  if (!habit.completions || habit.completions.length === 0) return 0;

  // Extract unique completion dates in YYYY-MM-DD format
  const completionDates = new Set(habit.completions.map(c => c.date));

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If frequency is daily
  if (habit.frequency === 'daily') {
    let streak = 0;
    const checkDate = completionDates.has(todayStr) ? today : yesterday;

    // If neither today nor yesterday is done, streak is broken (unless it's today and we just haven't done it)
    if (!completionDates.has(todayStr) && !completionDates.has(yesterdayStr)) {
      return 0;
    }

    // Work backwards
    let currentStr = checkDate.toISOString().split('T')[0];
    while (completionDates.has(currentStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      currentStr = checkDate.toISOString().split('T')[0];
    }
    return streak;
  }

  // Simplified logic for other frequencies: count consecutive unique completion dates
  // Sorted descending
  const sortedDates = [...completionDates].sort().reverse();
  if (sortedDates.length === 0) return 0;

  // Basic count of total unique completions for now as a fallback
  return completionDates.size;
}

export function getDayName(date: Date): string {
  // date.getDay() returns 0 for Sunday, 1 for Monday...
  // STRINGS.DAYS.SHORT is ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const shortName = STRINGS.DAYS.SHORT[dayIndex] as keyof typeof STRINGS.DAYS.FULL;
  return STRINGS.DAYS.FULL[shortName];
}
