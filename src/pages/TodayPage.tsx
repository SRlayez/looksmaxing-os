import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { BookOpenText, ChevronDown, ChevronUp, PauseCircle, PlayCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../app-context';
import { METRICS, MODULES, ROADMAP, TASKS } from '../data/content';
import { getLocalDateKey, getWeekdayNumber, formatVietnameseDate } from '../lib/date';
import { db, setMetricValue, setTaskCompletion } from '../storage/db';
import type { CompletionStatus, DailyLog } from '../types';
import { MetricCard } from '../components/MetricCard';
import { TaskCard } from '../components/TaskCard';
import { Toast } from '../components/Toast';

function isScheduledToday(type: string | undefined, weekday: number, schedule: ReturnType<typeof useApp>['settings']['schedule']) {
  if (type === 'training') return schedule.trainingDays.includes(weekday);
  if (type === 'posture') return schedule.postureDays.includes(weekday);
  if (type === 'weighIn') return schedule.weighInDays.includes(weekday);
  return false;
}

export function TodayPage() {
  const { settings, updateSettings } = useApp();
  const date = getLocalDateKey();
  const weekday = getWeekdayNumber();
  const week = ROADMAP.find((item) => item.weekNumber === settings.activeWeek) ?? ROADMAP[0];
  const module = MODULES.find((item) => item.slug === week.moduleSlug) ?? MODULES[0];
  const metricEntries = useLiveQuery(() => db.dailyMetrics.where('date').equals(date).toArray(), [date]) ?? [];
  const completions = useLiveQuery(() => db.taskCompletions.where('periodKey').equals(date).toArray(), [date]) ?? [];
  const existingLog = useLiveQuery(() => db.dailyLogs.get(date), [date]);
  const [showOptional, setShowOptional] = useState(false);
  const [showMoreCore, setShowMoreCore] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const activeMetrics = useMemo(() => METRICS.filter((metric) => metric.phaseStart <= settings.activeWeek).sort((a, b) => a.displayOrder - b.displayOrder), [settings.activeWeek]);
  const coreTasks = useMemo(() => TASKS.filter((task) => task.activeByDefault && task.priority === 'core' && task.frequency !== 'scheduled' && task.phaseStart <= settings.activeWeek), [settings.activeWeek]);
  const visibleCore = showMoreCore ? coreTasks : coreTasks.slice(0, 7);
  const scheduledTasks = useMemo(() => TASKS.filter((task) => task.frequency === 'scheduled' && task.phaseStart <= settings.activeWeek && isScheduledToday(task.scheduledType, weekday, settings.schedule)), [settings.activeWeek, settings.schedule, weekday]);
  const optionalTasks = useMemo(() => TASKS.filter((task) => task.priority === 'optional' && task.phaseStart <= settings.activeWeek), [settings.activeWeek]);

  const getStatus = (taskId: string): CompletionStatus => completions.find((item) => item.taskId === taskId)?.status ?? 'pending';
  const getMetricValue = (metricId: string) => metricEntries.find((item) => item.metricId === metricId)?.value ?? 0;

  const completedCore = coreTasks.filter((task) => ['completed', 'not_applicable'].includes(getStatus(task.id))).length;
  const corePercent = coreTasks.length ? Math.round((completedCore / coreTasks.length) * 100) : 0;

  const handleTask = async (taskId: string, status: CompletionStatus) => {
    try {
      await setTaskCompletion(taskId, date, status);
    } catch {
      setToast({ message: 'Không thể lưu nhiệm vụ. Hãy thử lại.', type: 'error' });
    }
  };

  const handleMetric = async (metricId: string, value: number) => {
    try {
      await setMetricValue(date, metricId, value);
    } catch {
      setToast({ message: 'Không thể lưu chỉ tiêu. Hãy thử lại.', type: 'error' });
    }
  };

  return (
    <div className="page today-page">
      <header className="hero-card">
        <div>
          <p className="eyebrow">{formatVietnameseDate()}</p>
          <h1>Chào {settings.displayName}</h1>
          <p>{settings.isPaused ? 'Lộ trình đang tạm dừng' : `Tuần ${week.weekNumber} · ${week.title}`}</p>
        </div>
        <div className="hero-progress" aria-label={`${corePercent}% việc cốt lõi hoàn thành`}>
          <div className="progress-ring" style={{ '--progress': `${corePercent * 3.6}deg` } as React.CSSProperties}><span>{corePercent}%</span></div>
          <small>{completedCore}/{coreTasks.length} việc cốt lõi</small>
        </div>
        <button className="hero-pause" onClick={() => updateSettings({ isPaused: !settings.isPaused })}>
          {settings.isPaused ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
          {settings.isPaused ? 'Tiếp tục' : 'Tạm dừng'}
        </button>
      </header>

      <section className="section-block">
        <div className="section-heading"><div><span className="section-number">01</span><h2>Việc cốt lõi</h2></div><span className="section-note">Làm trước, tối ưu sau</span></div>
        <div className="task-list">
          {visibleCore.map((task) => <TaskCard key={task.id} task={task} status={getStatus(task.id)} onChange={(status) => handleTask(task.id, status)} />)}
        </div>
        {coreTasks.length > 7 && <button className="text-button" onClick={() => setShowMoreCore((value) => !value)}>{showMoreCore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{showMoreCore ? 'Thu gọn' : `Xem thêm ${coreTasks.length - 7} việc duy trì`}</button>}
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="section-number">02</span><h2>Chỉ tiêu hôm nay</h2></div><span className="section-note">Theo dõi, không ám ảnh</span></div>
        {activeMetrics.length ? (
          <div className="metric-grid">
            {activeMetrics.map((metric) => <MetricCard key={metric.id} metric={metric} value={getMetricValue(metric.id)} targets={settings.personalTargets} onChange={(value) => handleMetric(metric.id, value)} />)}
          </div>
        ) : <div className="empty-card">Chỉ tiêu mới sẽ mở dần theo lộ trình.</div>}
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="section-number">03</span><h2>Theo lịch hôm nay</h2></div><span className="section-note">Chỉ hiện việc đến hạn</span></div>
        {scheduledTasks.length ? <div className="task-list">{scheduledTasks.map((task) => <TaskCard key={task.id} task={task} status={getStatus(task.id)} onChange={(status) => handleTask(task.id, status)} />)}</div> : <div className="empty-card">Hôm nay không có việc theo lịch. Đi bộ nhẹ hoặc nghỉ chủ động đều ổn.</div>}
      </section>

      <QuickLog date={date} initial={existingLog} onSaved={() => setToast({ message: 'Đã lưu nhật ký hôm nay.', type: 'success' })} />

      <section className="lesson-card">
        <div className="lesson-icon"><BookOpenText /></div>
        <div><p className="eyebrow">Bài học của tuần</p><h2>{module.title}</h2><p>{module.intro}</p><Link className="button secondary inline" to={`/roadmap/${module.slug}`}>Đọc trong 3 phút</Link></div>
      </section>

      <section className="section-block optional-section">
        <button className="accordion-button" onClick={() => setShowOptional((value) => !value)} aria-expanded={showOptional}>
          <span><Sparkles size={19} />Tối ưu thêm</span>{showOptional ? <ChevronUp /> : <ChevronDown />}
        </button>
        {showOptional && <div className="task-list optional-list">{optionalTasks.length ? optionalTasks.map((task) => <TaskCard key={task.id} task={task} status={getStatus(task.id)} onChange={(status) => handleTask(task.id, status)} compact />) : <div className="empty-card">Chưa có việc tối ưu trong tuần này.</div>}</div>}
      </section>

      <Link className="safety-banner" to="/safety"><ShieldAlert /><div><strong>Safety Center</strong><span>Kiểm tra phương pháp không nên tự thử và dấu hiệu cần đi khám.</span></div></Link>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function QuickLog({ date, initial, onSaved }: { date: string; initial?: DailyLog; onSaved: () => void }) {
  const [form, setForm] = useState({ sleepQuality: 0, energy: 0, nasalCongestion: 0, jawTension: 0, skinStatus: 0, notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setForm({
      sleepQuality: initial.sleepQuality ?? 0,
      energy: initial.energy ?? 0,
      nasalCongestion: initial.nasalCongestion ?? 0,
      jawTension: initial.jawTension ?? 0,
      skinStatus: initial.skinStatus ?? 0,
      notes: initial.notes ?? '',
    });
  }, [initial]);

  const update = (key: keyof typeof form, value: number | string) => setForm((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true);
    await db.dailyLogs.put({ date, ...form, updatedAt: new Date().toISOString() });
    setSaving(false);
    onSaved();
  };

  return (
    <section className="section-block quick-log">
      <div className="section-heading"><div><span className="section-number">04</span><h2>Check-in nhanh</h2></div><span className="section-note">Khoảng 30 giây</span></div>
      <div className="slider-grid">
        {[
          ['sleepQuality', 'Chất lượng ngủ'], ['energy', 'Năng lượng'], ['nasalCongestion', 'Nghẹt mũi'], ['jawTension', 'Căng hàm'], ['skinStatus', 'Tình trạng da'],
        ].map(([key, label]) => (
          <label className="slider-field" key={key}><span>{label}<strong>{form[key as keyof typeof form]}/10</strong></span><input type="range" min="0" max="10" value={form[key as keyof typeof form] as number} onChange={(e) => update(key as keyof typeof form, Number(e.target.value))} /></label>
        ))}
      </div>
      <label className="field-label" htmlFor="daily-notes">Ghi chú</label>
      <textarea id="daily-notes" className="text-area" rows={3} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Ví dụ: ngủ muộn, da hơi rát, buổi tập tốt…" />
      <button className="button primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu check-in'}</button>
    </section>
  );
}
