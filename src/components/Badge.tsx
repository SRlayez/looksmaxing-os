import { CATEGORY_LABELS, EVIDENCE_LABELS } from '../data/content';
import type { EvidenceLevel, TaskCategory } from '../types';

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  return <span className={`badge evidence evidence-${level.toLowerCase()}`}>{level} · {EVIDENCE_LABELS[level]}</span>;
}

export function CategoryBadge({ category }: { category: TaskCategory }) {
  return <span className={`badge category category-${category}`}>{CATEGORY_LABELS[category]}</span>;
}
