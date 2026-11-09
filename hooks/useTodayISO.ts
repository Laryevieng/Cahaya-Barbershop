'use client';

import { useSyncExternalStore } from 'react';
import { getTodayLocalISO } from '@/lib/date';

const subscribe = () => () => {};

export function useTodayISO(): string {
  return useSyncExternalStore(subscribe, getTodayLocalISO, getTodayLocalISO);
}
