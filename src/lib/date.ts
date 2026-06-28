import { format, getISODay, startOfWeek } from 'date-fns';

export function getLocalDateKey(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function getLocalWeekKey(date = new Date()): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

export function getLocalMonthKey(date = new Date()): string {
  return format(date, 'yyyy-MM');
}

export function getWeekdayNumber(date = new Date()): number {
  return getISODay(date);
}

export function formatVietnameseDate(date = new Date()): string {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function formatShortDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(
    new Date(year, month - 1, day),
  );
}
