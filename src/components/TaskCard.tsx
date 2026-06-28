import { Check, Circle, Clock3, MinusCircle } from 'lucide-react';
import type { CompletionStatus, TaskDefinition } from '../types';
import { CategoryBadge, EvidenceBadge } from './Badge';

export function TaskCard({ task, status, onChange, compact = false }: {
  task: TaskDefinition;
  status: CompletionStatus;
  onChange: (status: CompletionStatus) => void;
  compact?: boolean;
}) {
  const done = status === 'completed';
  const na = status === 'not_applicable';
  return (
    <article className={`task-card ${done ? 'done' : ''} ${na ? 'not-applicable' : ''} ${compact ? 'compact' : ''}`}>
      <button className="task-toggle" onClick={() => onChange(done ? 'pending' : 'completed')} aria-label={`${done ? 'Bỏ hoàn thành' : 'Hoàn thành'}: ${task.title}`}>
        {done ? <Check size={18} /> : <Circle size={20} />}
      </button>
      <div className="task-content">
        <div className="task-title-row"><h3>{task.title}</h3>{task.estimatedMinutes ? <span className="task-time"><Clock3 size={14} />{task.estimatedMinutes} phút</span> : null}</div>
        <div className="task-meta"><CategoryBadge category={task.category} /><EvidenceBadge level={task.evidence} /></div>
        {task.stopRule && <p className="task-stop">Dừng khi: {task.stopRule}</p>}
      </div>
      {task.conditionalLabel && (
        <button className={`na-button ${na ? 'active' : ''}`} onClick={() => onChange(na ? 'pending' : 'not_applicable')} aria-label={`${task.conditionalLabel}: ${task.title}`}>
          <MinusCircle size={16} /><span>{task.conditionalLabel}</span>
        </button>
      )}
    </article>
  );
}
