'use client';

import { useCallback, useRef, useState } from 'react';
import { BRANCHES_DATA, DEFAULT_TIME_SLOT } from '@/data';
import type { BookingDraft, ServiceSelection } from '@/types/barbershop';

export const DEFAULT_SERVICE_ID = 'cukur-cuci-pijit';
export const ANY_BARBER_ID = 'any';

interface UseBookingDraftOptions {
  today: string;
  initialService?: ServiceSelection;
  initialBarberId?: string;
  initialBranchId?: string;
}

export function useBookingDraft({
  today,
  initialService,
  initialBarberId,
  initialBranchId,
}: UseBookingDraftOptions) {
  const [draft, setDraft] = useState<BookingDraft>(() => ({
    name: '',
    phone: '',
    branchId: initialBranchId ?? BRANCHES_DATA[0].id,
    service: initialService ?? { kind: 'catalog', id: DEFAULT_SERVICE_ID },
    barberId: initialBarberId ?? ANY_BARBER_ID,
    date: today,
    time: DEFAULT_TIME_SLOT,
    chairId: null,
    notes: '',
  }));

  const initialDraft = useRef(draft).current;

  const setField = useCallback(
    <K extends keyof BookingDraft>(field: K, value: BookingDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  return { draft, setField, reset };
}
