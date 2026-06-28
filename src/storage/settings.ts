import { z } from 'zod';
import { DEFAULT_SETTINGS } from '../data/content';
import type { AppSettings } from '../types';

const SETTINGS_KEY = 'looksmax_os_v1_settings';

const targetsSchema = z.object({
  dailyFluidMl: z.number().min(0).max(6000),
  dailySteps: z.number().min(0).max(50000),
  dailyCaloriesMin: z.number().min(0).max(10000),
  dailyCaloriesMax: z.number().min(0).max(10000),
  dailyProteinMinG: z.number().min(0).max(400),
  dailyProteinMaxG: z.number().min(0).max(400),
  dailySleepMinMinutes: z.number().min(0).max(900),
  dailySleepMaxMinutes: z.number().min(0).max(900),
  dailyProduceServings: z.number().min(0).max(15),
  weeklyTrainingSessions: z.number().min(0).max(7),
  weeklyPostureSessions: z.number().min(0).max(7),
  weeklyWeighIns: z.number().min(0).max(7),
});

export const settingsSchema = z.object({
  schemaVersion: z.number(),
  displayName: z.string(),
  theme: z.enum(['light', 'dark', 'system']),
  roadmapStartDate: z.string(),
  activeWeek: z.number().min(0).max(12),
  reducedMotion: z.boolean(),
  onboardingCompleted: z.boolean(),
  isPaused: z.boolean(),
  personalTargets: targetsSchema,
  schedule: z.object({
    trainingDays: z.array(z.number().min(1).max(7)),
    postureDays: z.array(z.number().min(1).max(7)),
    weighInDays: z.array(z.number().min(1).max(7)),
  }),
});

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = settingsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearSettings() {
  localStorage.removeItem(SETTINGS_KEY);
}
