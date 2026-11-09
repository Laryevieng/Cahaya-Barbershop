export const DEFAULT_TIME_ZONE = 'Asia/Jakarta';

export function getTodayLocalISO(timeZone: string = DEFAULT_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function getNowLocalParts(timeZone: string = DEFAULT_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  const year = Number(part('year'));
  const month = Number(part('month'));
  const day = Number(part('day'));
  const hour = Number(part('hour') === '24' ? '00' : part('hour'));
  const minute = Number(part('minute'));

  const dateISO = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const timeHHMM = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const timeMinutes = hour * 60 + minute;

  return { year, month, day, hour, minute, dateISO, timeHHMM, timeMinutes };
}

export function getCurrentMonthBounds(timeZone: string = DEFAULT_TIME_ZONE) {
  const { year, month } = getNowLocalParts(timeZone);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const monthString = String(month).padStart(2, '0');
  const monthISO = `${year}-${monthString}`;
  const startISO = `${monthISO}-01`;
  const endISO = `${monthISO}-${String(daysInMonth).padStart(2, '0')}`;

  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone,
    month: 'long',
    year: 'numeric',
  });
  const monthLabel = formatter.format(new Date(Date.UTC(year, month - 1, 15)));

  return { year, month, monthISO, startISO, endISO, daysInMonth, monthLabel };
}

export function isDateInCurrentMonth(
  dateISO: string,
  timeZone: string = DEFAULT_TIME_ZONE
): boolean {
  const { monthISO } = getCurrentMonthBounds(timeZone);
  return typeof dateISO === 'string' && dateISO.startsWith(monthISO);
}

export function isDateInPast(
  dateISO: string,
  timeZone: string = DEFAULT_TIME_ZONE
): boolean {
  const today = getTodayLocalISO(timeZone);
  return dateISO < today;
}

export function isTimeInPastToday(
  dateISO: string,
  timeHHMM: string,
  timeZone: string = DEFAULT_TIME_ZONE
): boolean {
  const { dateISO: today, timeMinutes: currentMinutes } = getNowLocalParts(timeZone);
  if (dateISO !== today) {
    return false;
  }
  return timeToMinutes(timeHHMM) <= currentMinutes;
}

export function timeToMinutes(timeHHMM: string): number {
  const [h, m] = timeHHMM.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatDateIndonesian(
  dateISO: string,
  options?: { withWeekday?: boolean }
): string {
  if (!dateISO) return '';
  const [year, month, day] = dateISO.split('-').map(Number);
  if (!year || !month || !day) return dateISO;

  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: DEFAULT_TIME_ZONE,
    weekday: options?.withWeekday ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatter.format(date);
}

export function formatDateTimeWIB(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const formatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: DEFAULT_TIME_ZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${formatter.format(date)} WIB`;
}
