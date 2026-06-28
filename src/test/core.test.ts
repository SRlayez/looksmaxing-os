import { describe, expect, it } from 'vitest';
import { getLocalDateKey, getLocalMonthKey, getLocalWeekKey } from '../lib/date';
import { getMetricProgress, getMetricState, normalizeSearchText, parseLocalizedNumber } from '../lib/format';
import { DEFAULT_SETTINGS, METRICS } from '../data/content';

describe('date helpers', () => {
  it('creates local keys', () => {
    const date = new Date(2026, 5, 28, 23, 30);
    expect(getLocalDateKey(date)).toBe('2026-06-28');
    expect(getLocalMonthKey(date)).toBe('2026-06');
    expect(getLocalWeekKey(date)).toBe('2026-06-22');
  });
});

describe('Vietnamese search', () => {
  it('normalizes accents and đ', () => {
    expect(normalizeSearchText('Chống nắng và đường thở')).toBe('chong nang va duong tho');
  });
});

describe('localized numbers', () => {
  it('parses comma and dot', () => {
    expect(parseLocalizedNumber('54,5')).toBe(54.5);
    expect(parseLocalizedNumber('54.5')).toBe(54.5);
    expect(parseLocalizedNumber('54..5')).toBeNull();
    expect(parseLocalizedNumber('abc')).toBeNull();
  });
});

describe('metric progress', () => {
  const water = METRICS.find((item) => item.id === 'FLUID-DAILY')!;
  const protein = METRICS.find((item) => item.id === 'PROTEIN-DAILY')!;
  it('clamps progress at 100%', () => {
    expect(getMetricProgress(5000, water, DEFAULT_SETTINGS.personalTargets)).toBe(100);
  });
  it('detects range states', () => {
    expect(getMetricState(85, protein, DEFAULT_SETTINGS.personalTargets)).toBe('progress');
    expect(getMetricState(100, protein, DEFAULT_SETTINGS.personalTargets)).toBe('complete');
    expect(getMetricState(130, protein, DEFAULT_SETTINGS.personalTargets)).toBe('over');
  });
});
