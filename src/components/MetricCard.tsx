import { useMemo, useState } from 'react';
import { Minus, Plus, SlidersHorizontal } from 'lucide-react';
import type { DailyMetricDefinition, PersonalTargets } from '../types';
import { formatMetricValue, getMetricProgress, getMetricState, getMetricTarget, parseLocalizedNumber } from '../lib/format';
import { Modal } from './Modal';
import { CategoryBadge } from './Badge';

export function MetricCard({
  metric,
  value,
  targets,
  onChange,
}: {
  metric: DailyMetricDefinition;
  value: number;
  targets: PersonalTargets;
  onChange: (value: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(String(value || ''));
  const [saving, setSaving] = useState(false);
  const progress = getMetricProgress(value, metric, targets);
  const state = getMetricState(value, metric, targets);
  const target = getMetricTarget(metric, targets);

  const targetText = useMemo(() => {
    if ('target' in target && typeof target.target === 'number') return formatMetricValue(target.target, metric.unit);
    if ('min' in target && typeof target.min === 'number' && typeof target.max === 'number') {
      return `${formatMetricValue(target.min, metric.unit)}–${formatMetricValue(target.max, metric.unit)}`;
    }
    return '';
  }, [target, metric.unit]);

  const add = async (amount: number) => {
    const next = Math.min(metric.maximumAllowed, Math.max(metric.minimumAllowed, value + amount));
    await onChange(next);
  };

  const saveManual = async () => {
    const parsed = parseLocalizedNumber(input);
    if (parsed === null || parsed < metric.minimumAllowed || parsed > metric.maximumAllowed) return;
    setSaving(true);
    await onChange(parsed);
    setSaving(false);
    setEditing(false);
  };

  const stateLabel = state === 'complete' ? 'Đã đạt mục tiêu' : state === 'over' ? 'Đã vượt khoảng mục tiêu' : state === 'progress' ? 'Đang tiến triển' : 'Chưa ghi';

  return (
    <article className={`metric-card metric-${state}`}>
      <div className="metric-topline">
        <div><CategoryBadge category={metric.category} /><h3>{metric.title}</h3></div>
        <button className="icon-button" onClick={() => { setInput(String(value || '')); setEditing(true); }} aria-label={`Nhập ${metric.title}`}><SlidersHorizontal size={18} /></button>
      </div>
      <div className="metric-value-row">
        <strong>{formatMetricValue(value, metric.unit)}</strong>
        <span>Mục tiêu {targetText}</span>
      </div>
      <div className="progress-track" role="progressbar" aria-label={`Tiến độ ${metric.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="metric-status"><span>{stateLabel}</span><span>{Math.round(progress)}%</span></div>
      <div className="metric-actions">
        {metric.quickAddValues?.map((amount) => (
          <button key={amount} className="quick-add" onClick={() => add(amount)} aria-label={`Thêm ${formatMetricValue(amount, metric.unit)}`}><Plus size={15} />{formatMetricValue(amount, metric.unit)}</button>
        ))}
        {value > 0 && <button className="quick-add muted" onClick={() => add(-metric.step)} aria-label={`Giảm ${formatMetricValue(metric.step, metric.unit)}`}><Minus size={15} />Sửa</button>}
      </div>
      {metric.guidance && <p className="metric-guidance">{metric.guidance}</p>}

      <Modal open={editing} onClose={() => setEditing(false)} title={`Nhập ${metric.title}`}>
        <label className="field-label" htmlFor={`metric-${metric.id}`}>Giá trị ({metric.unit === 'minutes' ? 'phút' : metric.unit})</label>
        <input id={`metric-${metric.id}`} className="text-input" inputMode="decimal" value={input} onChange={(e) => setInput(e.target.value)} placeholder="0" />
        <p className="field-hint">Giới hạn {metric.minimumAllowed}–{metric.maximumAllowed}. Có thể dùng dấu phẩy hoặc dấu chấm.</p>
        <div className="modal-actions"><button className="button secondary" onClick={() => setEditing(false)}>Hủy</button><button className="button primary" onClick={saveManual} disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu'}</button></div>
      </Modal>
    </article>
  );
}
