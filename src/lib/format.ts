import type { DailyMetricDefinition, PersonalTargets } from '../types';

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function parseLocalizedNumber(value: string): number | null {
  const trimmed = value.trim().replace(',', '.');
  if (!trimmed || !/^-?\d+(\.\d+)?$/.test(trimmed)) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits }).format(value);
}

export function formatMetricValue(value: number, unit: DailyMetricDefinition['unit']): string {
  if (unit === 'minutes') {
    const hours = Math.floor(value / 60);
    const minutes = Math.round(value % 60);
    return hours > 0 ? `${hours}g ${minutes.toString().padStart(2, '0')}p` : `${minutes} phút`;
  }
  const labels = { ml: 'ml', steps: 'bước', kcal: 'kcal', g: 'g', servings: 'khẩu phần' } as const;
  return `${formatNumber(value, unit === 'g' ? 1 : 0)} ${labels[unit]}`;
}

export function getMetricTarget(metric: DailyMetricDefinition, targets: PersonalTargets) {
  switch (metric.id) {
    case 'FLUID-DAILY': return { target: targets.dailyFluidMl };
    case 'STEPS-DAILY': return { target: targets.dailySteps };
    case 'CALORIES-DAILY': return { min: targets.dailyCaloriesMin, max: targets.dailyCaloriesMax };
    case 'PROTEIN-DAILY': return { min: targets.dailyProteinMinG, max: targets.dailyProteinMaxG };
    case 'SLEEP-DAILY': return { min: targets.dailySleepMinMinutes, max: targets.dailySleepMaxMinutes };
    case 'PRODUCE-DAILY': return { target: targets.dailyProduceServings };
    default: return metric.defaultTarget !== undefined
      ? { target: metric.defaultTarget }
      : { min: metric.defaultMinimum, max: metric.defaultMaximum };
  }
}

export function getMetricState(
  value: number,
  metric: DailyMetricDefinition,
  targets: PersonalTargets,
): 'empty' | 'progress' | 'complete' | 'over' {
  if (value <= 0) return 'empty';
  const target = getMetricTarget(metric, targets);
  if ('target' in target && typeof target.target === 'number') {
    return value >= target.target ? 'complete' : 'progress';
  }
  if ('min' in target && typeof target.min === 'number' && typeof target.max === 'number') {
    if (value < target.min) return 'progress';
    if (value > target.max) return 'over';
    return 'complete';
  }
  return 'progress';
}

export function getMetricProgress(
  value: number,
  metric: DailyMetricDefinition,
  targets: PersonalTargets,
): number {
  const target = getMetricTarget(metric, targets);
  const denominator = 'target' in target && typeof target.target === 'number'
    ? target.target
    : ('max' in target && typeof target.max === 'number' ? target.max : 1);
  if (!Number.isFinite(value) || !Number.isFinite(denominator) || denominator <= 0) return 0;
  return Math.min(100, Math.max(0, (value / denominator) * 100));
}
