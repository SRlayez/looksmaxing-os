import { useMemo, useState } from 'react';
import { BookOpen, Filter, Search, X } from 'lucide-react';
import { CategoryBadge, EvidenceBadge } from '../components/Badge';
import { CATEGORY_LABELS, LIBRARY } from '../data/content';
import { normalizeSearchText } from '../lib/format';
import type { EvidenceLevel, LibraryItem, TaskCategory } from '../types';
import { Modal } from '../components/Modal';

const typeLabels = { protocol: 'Protocol', explanation: 'Giải thích', myth: 'Myth', warning: 'Cảnh báo' } as const;

export function LibraryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<TaskCategory | 'all'>('all');
  const [evidence, setEvidence] = useState<EvidenceLevel | 'all'>('all');
  const [selected, setSelected] = useState<LibraryItem | null>(null);

  const filtered = useMemo(() => {
    const normalized = normalizeSearchText(query);
    return LIBRARY.filter((item) => {
      const haystack = normalizeSearchText([item.title, item.summary, ...item.tags, ...item.body].join(' '));
      return (!normalized || haystack.includes(normalized)) && (category === 'all' || item.category === category) && (evidence === 'all' || item.evidence === evidence);
    });
  }, [query, category, evidence]);

  return (
    <div className="page">
      <header className="page-header"><p className="eyebrow">Thư viện đã lọc</p><h1>Đọc đúng phần đang cần</h1><p>Mỗi bài có mức bằng chứng rõ. Nội dung cảnh báo không được biến thành task khuyến nghị.</p></header>
      <section className="library-toolbar">
        <label className="search-box"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm: chống nắng, mewing, man bun…" />{query && <button onClick={() => setQuery('')} aria-label="Xóa tìm kiếm"><X size={16} /></button>}</label>
        <div className="filter-row"><Filter size={18} /><select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory | 'all')} aria-label="Lọc chủ đề"><option value="all">Tất cả chủ đề</option>{Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><select value={evidence} onChange={(e) => setEvidence(e.target.value as EvidenceLevel | 'all')} aria-label="Lọc bằng chứng"><option value="all">Mọi mức bằng chứng</option><option value="A">A — Tốt</option><option value="B">B — Hợp lý</option><option value="C">C — Chưa chắc</option><option value="D">D — Tránh</option></select></div>
      </section>
      <div className="library-summary"><strong>{filtered.length}</strong><span>bài phù hợp</span></div>
      <div className="library-grid">
        {filtered.map((item) => <button key={item.id} className="library-card" onClick={() => setSelected(item)}><div className="library-card-top"><span className={`type-pill type-${item.type}`}>{typeLabels[item.type]}</span><EvidenceBadge level={item.evidence} /></div><BookOpen size={24} /><h2>{item.title}</h2><p>{item.summary}</p><div><CategoryBadge category={item.category} /></div></button>)}
      </div>
      {!filtered.length && <div className="empty-card">Không tìm thấy bài phù hợp. Thử bỏ bớt bộ lọc hoặc tìm bằng từ khác.</div>}
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title ?? ''}>
        {selected && <article className="article-modal"><div className="article-badges"><CategoryBadge category={selected.category} /><EvidenceBadge level={selected.evidence} /><span className={`type-pill type-${selected.type}`}>{typeLabels[selected.type]}</span></div><p className="article-lead">{selected.summary}</p>{selected.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="tag-list">{selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></article>}
      </Modal>
    </div>
  );
}
