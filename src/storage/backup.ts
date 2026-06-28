import { z } from 'zod';
import { db } from './db';
import { settingsSchema } from './settings';
import type { AppSettings } from '../types';

const backupSchema = z.object({
  schemaVersion: z.number(),
  appVersion: z.string(),
  exportedAt: z.string(),
  settings: settingsSchema,
  taskCompletions: z.array(z.object({ key: z.string(), taskId: z.string(), periodKey: z.string(), status: z.enum(['completed', 'pending', 'not_applicable']), completedAt: z.string().optional() })),
  dailyMetrics: z.array(z.object({ key: z.string(), date: z.string(), metricId: z.string(), value: z.number(), updatedAt: z.string() })),
  dailyLogs: z.array(z.object({ date: z.string(), sleepQuality: z.number().optional(), energy: z.number().optional(), nasalCongestion: z.number().optional(), jawTension: z.number().optional(), skinStatus: z.number().optional(), notes: z.string().optional(), updatedAt: z.string() })),
  measurements: z.array(z.object({ date: z.string(), weightKg: z.number().optional(), waistCm: z.number().optional(), chestCm: z.number().optional(), shoulderCm: z.number().optional(), armCm: z.number().optional(), trainingCompleted: z.boolean().optional(), notes: z.string().optional() })),
  weeklyReviews: z.array(z.object({ weekKey: z.string(), compliancePercent: z.number(), wins: z.string(), problems: z.string(), nextWeekAdjustment: z.string(), createdAt: z.string() })),
});

export type BackupData = z.infer<typeof backupSchema>;

export async function createBackup(settings: AppSettings): Promise<BackupData> {
  const [taskCompletions, dailyMetrics, dailyLogs, measurements, weeklyReviews] = await Promise.all([
    db.taskCompletions.toArray(),
    db.dailyMetrics.toArray(),
    db.dailyLogs.toArray(),
    db.measurements.toArray(),
    db.weeklyReviews.toArray(),
  ]);
  return {
    schemaVersion: 1,
    appVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    taskCompletions,
    dailyMetrics,
    dailyLogs,
    measurements,
    weeklyReviews,
  };
}

export function parseBackup(text: string): BackupData {
  const json = JSON.parse(text);
  return backupSchema.parse(json);
}

export async function restoreBackup(data: BackupData) {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
    await db.taskCompletions.bulkPut(data.taskCompletions);
    await db.dailyMetrics.bulkPut(data.dailyMetrics);
    await db.dailyLogs.bulkPut(data.dailyLogs);
    await db.measurements.bulkPut(data.measurements);
    await db.weeklyReviews.bulkPut(data.weeklyReviews);
  });
}
