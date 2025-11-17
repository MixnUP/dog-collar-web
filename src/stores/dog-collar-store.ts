import { create } from 'zustand';
import type { DataRow } from '@/types';

type Store = {
  data: DataRow[];
};

export const useDogCollarStore = create<Store>(() => ({
  data: [
    { person: 'A', visit: 1, proximity: 'near', near_time_start: '10:00', near_time_end: '10:05' },
    { person: 'B', visit: 1, proximity: 'far', near_time_start: '10:02', near_time_end: '10:03' },
    { person: 'A', visit: 2, proximity: 'near', near_time_start: '11:00', near_time_end: '11:05' },
    { person: 'C', visit: 1, proximity: 'near', near_time_start: '12:00', near_time_end: '12:05' },
  ],
}));
