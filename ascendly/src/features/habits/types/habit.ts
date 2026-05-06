export type HabitStatus = 'active' | 'paused' | 'completed';
export type HabitPriority = 'high' | 'medium' | 'low';
export type HabitDurationType = 'hours' | 'minutes' | 'count' | 'none';
export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly' | 'custom';
export type HabitTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';

export interface HabitCompletion {
  date: string; // ISO 8601 YYYY-MM-DD
  value?: number;
  note?: string;
}

export interface Habit {
  id: number;
  categoryId: string;
  isOneTime: boolean;
  priority: HabitPriority;
  title: string;
  description: string;
  createdDate: string;
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
  duration?: string;
  durationType: HabitDurationType;
  frequency: HabitFrequency;
  timeOfDay: HabitTimeOfDay;
  targetPerWeek?: number;
  targetPerMonth?: number;
  status: HabitStatus;
  daysTarget: string[];
  datesTarget?: number[];
  specificDatesTarget?: string[];
  scheduleDescription?: string;
  isFavorite?: boolean;
  completions: HabitCompletion[];
  goal: string;
  lastSyncedAt?: string;
  isDirty?: boolean;
}
