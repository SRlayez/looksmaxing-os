import { CheckCircle2, ChevronRight, Circle, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../app-context';
import { ROADMAP } from '../data/content';

export function RoadmapPage() {
  const { settings, updateSettings } = useApp();
  return (
    <div className="page">
      <header className="page-header"><p className="eyebrow">Lộ trình 12 tuần</p><h1>Tiến từng lớp, không nhồi tất cả cùng lúc</h1><p>Mỗi tuần chỉ thêm một nhóm thói quen mới. Các nền tảng cũ được duy trì dần.</p></header>
      <div className="roadmap-list">
        {ROADMAP.map((week) => {
          const done = week.weekNumber < settings.activeWeek;
          const active = week.weekNumber === settings.activeWeek;
          return (
            <article key={week.id} className={`roadmap-card ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              <div className="roadmap-marker">{done ? <CheckCircle2 /> : active ? <PlayCircle /> : <Circle />}</div>
              <div className="roadmap-content">
                <div className="roadmap-title-row"><div><span>Tuần {week.weekNumber}</span><h2>{week.title}</h2></div>{active && <span className="status-pill">Đang làm</span>}</div>
                <p>{week.shortDescription}</p>
                <div className="roadmap-goals">{week.goals.map((goal) => <span key={goal}>{goal}</span>)}</div>
                <details><summary>Tiêu chí hoàn thành</summary><ul>{week.completionCriteria.map((item) => <li key={item}>{item}</li>)}</ul></details>
                <div className="roadmap-actions">
                  <Link className="button secondary inline" to={`/roadmap/${week.moduleSlug}`}>Mở module <ChevronRight size={16} /></Link>
                  {!active && <button className="text-button" onClick={() => updateSettings({ activeWeek: week.weekNumber })}>Chuyển tới tuần này</button>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
