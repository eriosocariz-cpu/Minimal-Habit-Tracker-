/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HabitType = 'boolean' | 'numeric';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  type: HabitType;
  unit?: string;
  target: number;
  color: string;
  history: Record<string, number>; // date in YYYY-MM-DD format
  createdAt: number;
  frequencyType: 'daily' | 'weekly';
  frequencyDays?: number[]; // [0, 1, 2, 3, 4, 5, 6] for Sun-Sat
  reminderTimes?: string[]; // HH:mm format
  motivationPhrase?: string;
}

export interface DayProgress {
  date: string;
  totalHabits: number;
  completedHabits: number;
  percentage: number;
}
