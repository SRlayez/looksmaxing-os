import { BookOpen, CalendarRange, ChartNoAxesCombined, Home, Settings, ShieldAlert, Sparkles } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../app-context';

const navItems = [
  { to: '/today', label: 'Hôm nay', icon: Home },
  { to: '/roadmap', label: 'Lộ trình', icon: CalendarRange },
  { to: '/progress', label: 'Tiến độ', icon: ChartNoAxesCombined },
  { to: '/library', label: 'Thư viện', icon: BookOpen },
  { to: '/settings', label: 'Cài đặt', icon: Settings },
];

function Navigation({ className }: { className: string }) {
  return (
    <nav className={className} aria-label="Điều hướng chính">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Icon size={21} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell() {
  const { settings } = useApp();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={20} /></span><div><strong>Looksmax OS</strong><small>Personal system</small></div></div>
        <Navigation className="side-nav" />
        <NavLink to="/safety" className="safety-shortcut"><ShieldAlert size={18} /><span>Safety Center</span></NavLink>
        <div className="sidebar-user"><span>{settings.displayName.slice(0, 1).toUpperCase()}</span><div><strong>{settings.displayName}</strong><small>Tuần {settings.activeWeek}</small></div></div>
      </aside>
      <main className="main-content"><Outlet /></main>
      <Navigation className="bottom-nav" />
    </div>
  );
}
