import Dexie, { type Table } from 'dexie';
import type { DailyLog, DailyMetricEntry, Measurement, TaskCompletion, WeeklyReview } from '../types';

class LooksmaxDB extends Dexie {
  taskCompletions!: Table<TaskCompletion, string>;
  dailyMetrics!: Table<DailyMetricEntry, string>;
  dailyLogs!: Table<DailyLog, string>;
  measurements!: Table<Measurement, string>;
  weeklyReviews!: Table<WeeklyReview, string>;

  constructor() {
    super('looksmax_os_db');
    this.version(1).stores({
      taskCompletions: '&key, taskId, periodKey',
      dailyMetrics: '&key, date, metricId, [date+metricId]',
      dailyLogs: '&date',
      measurements: '&date',
      weeklyReviews: '&weekKey',
    });
  }
}

export const db = new LooksmaxDB();

export async function setTaskCompletion(taskId: string, periodKey: string, status: TaskCompletion['status']) {
  const key = `${taskId}|${periodKey}`;
  await db.taskCompletions.put({
    key,
    taskId,
    periodKey,
    status,
    completedAt: status === 'completed' ? new Date().toISOString() : undefined,
  });
}

export async function setMetricValue(date: string, metricId: string, value: number) {
  const key = `${date}|${metricId}`;
  await db.dailyMetrics.put({ key, date, metricId, value, updatedAt: new Date().toISOString() });
}
