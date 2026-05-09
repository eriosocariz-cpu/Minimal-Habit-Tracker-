/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Habit } from '../types';

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Hidratación',
    icon: 'Droplets',
    type: 'numeric',
    unit: 'ml',
    target: 2500,
    color: '#3B82F6', // Blue
    history: {
      '2026-05-08': 1500,
      '2026-05-07': 2500,
      '2026-05-06': 2000,
    },
    createdAt: Date.now() - 100000000,
    frequencyType: 'daily',
    reminderTimes: ['09:00', '14:00', '20:00']
  },
  {
    id: '2',
    name: 'Meditar',
    icon: 'Wind',
    type: 'boolean',
    target: 1,
    color: '#8B5CF6', // Purple
    history: {
      '2026-05-08': 1,
      '2026-05-07': 0,
      '2026-05-06': 1,
    },
    createdAt: Date.now() - 200000000,
    frequencyType: 'daily',
    reminderTimes: ['08:00']
  },
  {
    id: '3',
    name: 'Lectura',
    icon: 'Book',
    type: 'numeric',
    unit: 'páginas',
    target: 20,
    color: '#F59E0B', // Amber
    history: {
      '2026-05-08': 5,
      '2026-05-07': 20,
      '2026-05-06': 15,
    },
    createdAt: Date.now() - 300000000,
    frequencyType: 'daily',
    reminderTimes: ['21:00']
  }
];

export const getTodayDate = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const getDayName = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { weekday: 'long' });
};

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
};

export const calculateStreak = (habit: Habit) => {
  const dates = Object.keys(habit.history).sort().reverse();
  const today = getTodayDate();
  let streak = 0;
  let currentDate = new Date(today);

  // If not completed today, check from yesterday
  if (habit.history[today] < habit.target) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dStr = currentDate.toISOString().split('T')[0];
    if (habit.history[dStr] >= habit.target) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};
