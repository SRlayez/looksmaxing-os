import { ArrowLeft, Ban, CheckCircle2, Eye, ListChecks, SearchCheck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EvidenceBadge } from '../components/Badge';
import { MODULES } from '../data/content';

const tabs = [
  { key: 'understand', title: 'Hiểu', icon: Eye },
  { key: 'do', title: 'Làm', icon: ListChecks },
  { key: 'track', title: 'Theo dõi', icon: SearchCheck },
  { key: 'avoid', title: 'Tránh', icon: Ban },
] as const;

export function ModulePage() {
  const { slug } = useParams();
  const module = MODULES.find((item) => item.slug === slug);
  if (!module) return <div className="page"><div className="empty-card"><h1>Không tìm thấy module</h1><Link to="/roadmap" className="button primary inline">Quay lại lộ trình</Link></div></div>;
  return (
    <div className="page module-page">
      <Link to="/roadmap" className="back-link"><ArrowLeft size={17} />Lộ trình</Link>
      <header className="page-header module-header"><p className="eyebrow">Tuần {module.weekNumber}</p><h1>{module.title}</h1><p>{module.intro}</p><EvidenceBadge level={module.weekNumber === 8 ? 'B' : 'A'} /></header>
      <div className="module-grid">
        {tabs.map(({ key, title, icon: Icon }) => (
          <section key={key} className={`module-panel module-${key}`}>
            <div className="module-panel-title"><span><Icon /></span><h2>{title}</h2></div>
            <ul>{module[key].map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul>
          </section>
        ))}
      </div>
      <div className="disclaimer-card"><strong>Giới hạn</strong><p>Module này là hướng dẫn self-care và theo dõi thói quen, không thay thế chẩn đoán hoặc điều trị y khoa.</p></div>
    </div>
  );
}
