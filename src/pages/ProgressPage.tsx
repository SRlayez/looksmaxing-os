import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Activity, CalendarDays, MoonStar, Plus, Scale, Target } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { db } from '../storage/db';
import { formatShortDate, getLocalDateKey } from '../lib/date';
import { parseLocalizedNumber } from '../lib/format';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';

export function ProgressPage() {
  const measurements = useLiveQuery(() => db.measurements.orderBy('date').toArray(), []) ?? [];
  const logs = useLiveQuery(() => db.dailyLogs.orderBy('date').toArray(), []) ?? [];
  const completionQuery = useLiveQuery(() => db.taskCompletions.toArray(), []);
  const completions = useMemo(() => completionQuery ?? [], [completionQuery]);
  const [showAdd, setShowAdd] = useState(false);
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const weightData = measurements.filter((item) => item.weightKg).map((item) => ({ date: formatShortDate(item.date), value: item.weightKg }));
  const sleepData = logs.filter((item) => item.sleepQuality !== undefined).map((item) => ({ date: formatShortDate(item.date), quality: item.sleepQuality, energy: item.energy }));

  const last7Compliance = useMemo(() => {
    const now = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now); date.setDate(now.getDate() - i); return date.toLocaleDateString('en-CA');
    });
    const relevant = completions.filter((item) => dates.includes(item.periodKey));
    if (!relevant.length) return 0;
    return Math.round((relevant.filter((item) => item.status === 'completed' || item.status === 'not_applicable').length / relevant.length) * 100);
  }, [completions]);

  const latestWeight = [...measurements].reverse().find((item) => item.weightKg)?.weightKg;
  const latestWaist = [...measurements].reverse().find((item) => item.waistCm)?.waistCm;
  const avgEnergy = logs.length ? Math.round(logs.reduce((sum, item) => sum + (item.energy ?? 0), 0) / logs.filter((item) => item.energy !== undefined).length * 10) / 10 : 0;

  const saveMeasurement = async () => {
    const w = weight ? parseLocalizedNumber(weight) : null;
    const waistValue = waist ? parseLocalizedNumber(waist) : null;
    if ((w !== null && (w < 20 || w > 250)) || (waistValue !== null && (waistValue < 30 || waistValue > 200))) return;
    const date = getLocalDateKey();
    const existing = await db.measurements.get(date);
    await db.measurements.put({ ...existing, date, weightKg: w ?? existing?.weightKg, waistCm: waistValue ?? existing?.waistCm });
    setShowAdd(false); setWeight(''); setWaist(''); setToast('Đã lưu số đo hôm nay.');
  };

  return (
    <div className="page">
      <header className="page-header action-header"><div><p className="eyebrow">Tiến độ</p><h1>Theo dõi xu hướng, không soi từng ngày</h1><p>Cân, eo, giấc ngủ và mức tuân thủ quan trọng hơn “beauty score”.</p></div><button className="button primary" onClick={() => setShowAdd(true)}><Plus size={18} />Thêm số đo</button></header>
      <div className="stat-grid">
        <Stat icon={Scale} label="Cân gần nhất" value={latestWeight ? `${latestWeight} kg` : 'Chưa có'} />
        <Stat icon={Target} label="Eo gần nhất" value={latestWaist ? `${latestWaist} cm` : 'Chưa có'} />
        <Stat icon={CalendarDays} label="Tuân thủ 7 ngày" value={`${last7Compliance}%`} />
        <Stat icon={Activity} label="Năng lượng TB" value={avgEnergy ? `${avgEnergy}/10` : 'Chưa có'} />
      </div>

      <div className="chart-grid">
        <ChartCard title="Cân nặng" subtitle="kg theo thời gian">
          {weightData.length ? <ResponsiveContainer width="100%" height={260}><AreaChart data={weightData}><defs><linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent)" stopOpacity={0.28}/><stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false}/><YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}/><Area type="monotone" dataKey="value" stroke="var(--accent)" fill="url(#weightFill)" strokeWidth={2.5}/></AreaChart></ResponsiveContainer> : <ChartEmpty />}
        </ChartCard>
        <ChartCard title="Chất lượng ngủ và năng lượng" subtitle="thang 0–10">
          {sleepData.length ? <ResponsiveContainer width="100%" height={260}><LineChart data={sleepData}><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false}/><YAxis domain={[0, 10]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}/><Line type="monotone" dataKey="quality" name="Ngủ" stroke="var(--accent)" strokeWidth={2.3} dot={false}/><Line type="monotone" dataKey="energy" name="Năng lượng" stroke="var(--warning)" strokeWidth={2.3} dot={false}/></LineChart></ResponsiveContainer> : <ChartEmpty />}
        </ChartCard>
      </div>

      <section className="section-block"><div className="section-heading"><div><span className="section-number">LOG</span><h2>Lịch sử số đo</h2></div></div>{measurements.length ? <div className="table-wrap"><table><thead><tr><th>Ngày</th><th>Cân</th><th>Eo</th><th>Ghi chú</th></tr></thead><tbody>{[...measurements].reverse().map((item) => <tr key={item.date}><td>{item.date}</td><td>{item.weightKg ? `${item.weightKg} kg` : '—'}</td><td>{item.waistCm ? `${item.waistCm} cm` : '—'}</td><td>{item.notes || '—'}</td></tr>)}</tbody></table></div> : <div className="empty-card">Chưa có số đo. Thêm cân hoặc eo để bắt đầu theo dõi.</div>}</section>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Thêm số đo hôm nay">
        <div className="form-grid"><label className="field-label">Cân nặng (kg)<input className="text-input" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="54,5" /></label><label className="field-label">Vòng eo (cm)<input className="text-input" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="68" /></label></div>
        <div className="modal-actions"><button className="button secondary" onClick={() => setShowAdd(false)}>Hủy</button><button className="button primary" onClick={saveMeasurement}>Lưu</button></div>
      </Modal>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Scale; label: string; value: string }) { return <article className="stat-card"><span><Icon /></span><div><small>{label}</small><strong>{value}</strong></div></article>; }
function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <article className="chart-card"><div><h2>{title}</h2><p>{subtitle}</p></div>{children}</article>; }
function ChartEmpty() { return <div className="chart-empty"><MoonStar /><p>Chưa đủ dữ liệu để vẽ biểu đồ.</p></div>; }
