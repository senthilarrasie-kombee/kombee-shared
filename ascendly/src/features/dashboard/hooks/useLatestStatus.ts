import {useState, useMemo} from 'react';
import {useAppSelector} from '@store';
import {useTheme} from '@shared/theme';
import {createStyles} from '../screens/LatestStatusStyles';
import {Habit} from '@shared/types/habit';

export const useLatestStatus = () => {
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const allHabits = useAppSelector(state => state.root.habits);

  const stats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed

    // 1. Get all completions for the current view
    const allCompletions = allHabits.flatMap(h => h.completions);
    
    // 2. Filter completions based on viewMode
    const filteredCompletions = allCompletions.filter(c => {
      const d = new Date(c.date);
      if (viewMode === 'month') {
        return d.getFullYear() === year && d.getMonth() === month;
      }
      return d.getFullYear() === year;
    });

    // 3. Calculate target completion days
    // This is complex because each habit has its own schedule.
    // For simplicity, let's calculate based on startDate/endDate and frequency.
    let totalTargetDays = 0;
    allHabits.forEach(habit => {
      // Basic target calculation (placeholder for now, can be improved)
      if (habit.status === 'active') {
        if (viewMode === 'month') {
          totalTargetDays += (habit.targetPerWeek || 7) * 4; // Approx
        } else {
          totalTargetDays += (habit.targetPerWeek || 7) * 52; // Approx
        }
      }
    });

    // Ensure we don't divide by zero
    totalTargetDays = totalTargetDays || 1;
    const completionRate = Math.min(Math.round((filteredCompletions.length / totalTargetDays) * 100), 100);

    // 4. Calculate trend (comparison with previous period)
    const prevPeriodCompletions = allCompletions.filter(c => {
      const d = new Date(c.date);
      if (viewMode === 'month') {
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
      }
      return d.getFullYear() === year - 1;
    }).length;

    const trend = filteredCompletions.length >= prevPeriodCompletions ? '+' : '-';
    const trendValue = prevPeriodCompletions === 0 ? 0 : Math.abs(Math.round(((filteredCompletions.length - prevPeriodCompletions) / prevPeriodCompletions) * 100));

    // 5. Perfect Days Calculation
    // A perfect day is when all habits scheduled for that day are completed.
    // For now, let's count days where at least 3 habits were completed as "Active Days"
    const completionsByDate = filteredCompletions.reduce((acc: any, c) => {
      acc[c.date] = (acc[c.date] || 0) + 1;
      return acc;
    }, {});

    const activeDays = Object.keys(completionsByDate).length;
    const perfectDays = Object.values(completionsByDate).filter((v: any) => v >= 3).length; // Placeholder logic

    // 6. Trend Chart Data (Last 6 months/weeks)
    const trendData = [30, 45, 60, 55, 75, completionRate]; // Dynamic last point

    return {
      completionRate,
      completedCount: filteredCompletions.length,
      targetCount: totalTargetDays,
      activeDays,
      perfectDays,
      trend,
      trendValue,
      trendData,
      completionsByDate
    };
  }, [allHabits, viewMode, currentDate]);

  const canGoForward = useMemo(() => {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const curYear = currentDate.getFullYear();
    const curMonth = currentDate.getMonth();

    if (viewMode === 'month') {
      return curYear < nowYear || (curYear === nowYear && curMonth < nowMonth);
    } else {
      return curYear < nowYear;
    }
  }, [currentDate, viewMode]);

  const changeDate = (direction: 'back' | 'forward') => {
    if (direction === 'forward' && !canGoForward) return;
    
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'forward' ? 1 : -1));
    } else {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'forward' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return {
    colors,
    styles,
    viewMode,
    setViewMode,
    currentDate,
    changeDate,
    canGoForward,
    stats
  };
};

