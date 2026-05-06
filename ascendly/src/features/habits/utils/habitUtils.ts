import { Habit } from '../types/habit';

export function getFrequencyDescription(habit: Partial<Habit>): string {
  const start = habit.startDate ? new Date(habit.startDate) : new Date();
  const day = start.getDate();
  const month = start.toLocaleString('default', { month: 'long' });

  if (habit.isOneTime) {
    return `One-time task on ${month} ${day}`;
  }

  switch (habit.frequency) {
    case 'daily':
      return 'Every day';

    case 'weekly':
      if (habit.daysTarget && habit.daysTarget.length > 0) {
        if (habit.daysTarget.length === 7) return 'Every day';
        return `Every ${habit.daysTarget.map(d => d.substring(0, 3)).join(', ')}`;
      }
      return `${habit.targetPerWeek} times per week`;

    case 'monthly':
      if (habit.datesTarget && habit.datesTarget.length > 0) {
        const sortedDates = [...habit.datesTarget].sort((a, b) => a - b);
        return `Every ${sortedDates.join(', ')}${sortedDates.length === 1 ? 'th' : ''} of the month`;
      }
      return `${habit.targetPerMonth} times per month`;

    case 'quarterly':
      return `${getOrdinal(day)} of every 3 months`;

    case 'half-yearly':
      return `${getOrdinal(day)} of every 6 months`;

    case 'yearly':
      return `${getOrdinal(day)} of ${month} every year`;
    
    case 'custom':
      if (habit.specificDatesTarget && habit.specificDatesTarget.length > 0) {
        return `${habit.specificDatesTarget.length} specific date${habit.specificDatesTarget.length > 1 ? 's' : ''}`;
      }
      return 'Custom schedule';

    default:
      return 'Custom schedule';
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
    let checkDate = completionDates.has(todayStr) ? today : yesterday;
    
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
