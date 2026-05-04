export type HabitStatus = 'active' | 'paused' | 'completed';

export interface Habit {
  id: number;
  title: string;
  description: string;
  createdDate: string;
  status: HabitStatus;
  daysTarget: string[];
  completedDates: string[];
  streak: number;
  goal: string;
}
