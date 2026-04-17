import { useMemo } from 'react';

/**
 * Returns an array of 7 date objects starting from today.
 * Each has: { day, date, month, full }
 */
export function useDateRange(count = 7) {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        day: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
        date: d.getDate(),
        month: d.getMonth() + 1,
        full: d,
      };
    });
  }, [count]);
}
