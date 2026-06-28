export type EvidenceLevel = 'A' | 'B' | 'C' | 'D';
export type TaskCategory =
  | 'sleep'
  | 'skin'
  | 'nutrition'
  | 'body'
  | 'posture'
  | 'jaw'
  | 'hair'
  | 'dental'
  | 'grooming'
  | 'style'
  | 'safety';

export type CompletionStatus = 'completed' | 'pending' | 'not_applicable';
export type TaskFrequency = 'daily' | 'weekly' | 'monthly' | 'conditional' | 'scheduled';
export type TaskPriority = 'core' | 'optimize' | 'optional' | 'avoid';

export interface TaskDefinition {
  id: string;
  title: string;
  shortTitle?: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  priority: TaskPriority;
  evidence: EvidenceLevel;
  phaseStart: number;
  estimatedMinutes?: number;
  instructions?: string;
  reason?: string;
  stopRule?: string;
  activeByDefault: boolean;
  scheduledType?: 'training' | 'posture' | 'weighIn' | 'weeklyReview' | 'pillowcase';
  conditionalLabel?: string;
}

export type MetricUnit = 'ml' | 'steps' | 'kcal' | 'g' | 'minutes' | 'servings';
export type MetricCompletionMode = 'at_least' | 'within_range' | 'informational';

export interface DailyMetricDefinition {
  id: string;
  title: string;
  shortTitle: string;
  category: TaskCategory;
  unit: MetricUnit;
  defaultTarget?: number;
  defaultMinimum?: number;
  defaultMaximum?: number;
  completionMode: MetricCompletionMode;
  quickAddValues?: number[];
  minimumAllowed: number;
  maximumAllowed: number;
  step: number;
  description?: string;
  guidance?: string;
  phaseStart: number;
  displayOrder: number;
}

export interface RoadmapWeek {
  id: string;
  weekNumber: number;
  title: string;
  shortDescription: string;
  goals: string[];
  moduleSlug: string;
  newTaskIds: string[];
  completionCriteria: string[];
}

export interface ModuleContent {
  slug: string;
  weekNumber: number;
  title: string;
  intro: string;
  understand: string[];
  do: string[];
  track: string[];
  avoid: string[];
  deepDive?: string[];
}

export interface LibraryItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: TaskCategory;
  evidence: EvidenceLevel;
  type: 'protocol' | 'explanation' | 'myth' | 'warning';
  tags: string[];
  body: string[];
}

export interface PersonalTargets {
  dailyFluidMl: number;
  dailySteps: number;
  dailyCaloriesMin: number;
  dailyCaloriesMax: number;
  dailyProteinMinG: number;
  dailyProteinMaxG: number;
  dailySleepMinMinutes: number;
  dailySleepMaxMinutes: number;
  dailyProduceServings: number;
  weeklyTrainingSessions: number;
  weeklyPostureSessions: number;
  weeklyWeighIns: number;
}

export interface ScheduleSettings {
  trainingDays: number[];
  postureDays: number[];
  weighInDays: number[];
}

export interface AppSettings {
  schemaVersion: number;
  displayName: string;
  theme: 'light' | 'dark' | 'system';
  roadmapStartDate: string;
  activeWeek: number;
  reducedMotion: boolean;
  onboardingCompleted: boolean;
  isPaused: boolean;
  personalTargets: PersonalTargets;
  schedule: ScheduleSettings;
}

export interface TaskCompletion {
  key: string;
  taskId: string;
  periodKey: string;
  status: CompletionStatus;
  completedAt?: string;
}

export interface DailyMetricEntry {
  key: string;
  date: string;
  metricId: string;
  value: number;
  updatedAt: string;
}

export interface DailyLog {
  date: string;
  sleepQuality?: number;
  energy?: number;
  nasalCongestion?: number;
  jawTension?: number;
  skinStatus?: number;
  notes?: string;
  updatedAt: string;
}

export interface Measurement {
  date: string;
  weightKg?: number;
  waistCm?: number;
  chestCm?: number;
  shoulderCm?: number;
  armCm?: number;
  trainingCompleted?: boolean;
  notes?: string;
}

export interface WeeklyReview {
  weekKey: string;
  compliancePercent: number;
  wins: string;
  problems: string;
  nextWeekAdjustment: string;
  createdAt: string;
}
