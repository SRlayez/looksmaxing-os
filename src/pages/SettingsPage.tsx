import { useRef, useState } from 'react';
import { Download, RotateCcw, Trash2, Upload } from 'lucide-react';
import { useApp } from '../app-context';
import { DEFAULT_SETTINGS } from '../data/content';
import { db } from '../storage/db';
import { createBackup, parseBackup, restoreBackup } from '../storage/backup';
import { saveSettings } from '../storage/settings';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import type { AppSettings, PersonalTargets } from '../types';

const days = [{ n: 1, label: 'T2' }, { n: 2, label: 'T3' }, { n: 3, label: 'T4' }, { n: 4, label: 'T5' }, { n: 5, label: 'T6' }, { n: 6, label: 'T7' }, { n: 7, label: 'CN' }];

export function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetText, setResetText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const updateTarget = (key: keyof PersonalTargets, value: number) => {
    updateSettings((current) => ({ ...current, personalTargets: { ...current.personalTargets, [key]: value } }));
  };

  const toggleDay = (type: keyof AppSettings['schedule'], day: number) => {
    updateSettings((current) => {
      const list = current.schedule[type];
      return { ...current, schedule: { ...current.schedule, [type]: list.includes(day) ? list.filter((item) => item !== day) : [...list, day].sort() } };
    });
  };

  const exportData = async () => {
    const data = await createBackup(settings);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `looksmax-os-backup-${new Date().toLocaleDateString('en-CA')}.json`; anchor.click();
    URL.revokeObjectURL(url);
    setToast({ message: 'Đã xuất bản sao dữ liệu.', type: 'success' });
  };

  const importData = async (file: File) => {
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('File quá lớn');
      const parsed = parseBackup(await file.text());
      await restoreBackup(parsed);
      saveSettings(parsed.settings);
      updateSettings(parsed.settings);
      setToast({ message: 'Đã khôi phục dữ liệu. Tải lại trang để đồng bộ hoàn toàn.', type: 'success' });
    } catch {
      setToast({ message: 'File backup không hợp lệ hoặc không thể khôi phục.', type: 'error' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const resetAll = async () => {
    if (resetText !== 'XÓA DỮ LIỆU') return;
    await db.delete();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="page">
      <header className="page-header"><p className="eyebrow">Cài đặt</p><h1>Cá nhân hóa mục tiêu và dữ liệu</h1><p>Dữ liệu được lưu trong trình duyệt trên thiết bị này. Hãy export định kỳ.</p></header>

      <section className="settings-section"><h2>Hồ sơ và giao diện</h2><div className="settings-grid"><label className="field-label">Tên hiển thị<input className="text-input" value={settings.displayName} onChange={(e) => updateSettings({ displayName: e.target.value })} /></label><label className="field-label">Chủ đề<select className="text-input" value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value as AppSettings['theme'] })}><option value="system">Theo hệ thống</option><option value="light">Sáng</option><option value="dark">Tối</option></select></label><label className="field-label">Tuần hiện tại<input className="text-input" type="number" min="0" max="12" value={settings.activeWeek} onChange={(e) => updateSettings({ activeWeek: Math.max(0, Math.min(12, Number(e.target.value))) })} /></label><label className="toggle-row"><input type="checkbox" checked={settings.reducedMotion} onChange={(e) => updateSettings({ reducedMotion: e.target.checked })} /><span>Giảm chuyển động</span></label></div></section>

      <section className="settings-section"><div className="settings-title-row"><h2>Mục tiêu hằng ngày</h2><button className="text-button" onClick={() => updateSettings((current) => ({ ...current, personalTargets: DEFAULT_SETTINGS.personalTargets }))}><RotateCcw size={16} />Khôi phục mặc định</button></div><div className="target-grid">
        <TargetInput label="Chất lỏng" unit="ml" value={settings.personalTargets.dailyFluidMl} onChange={(v) => updateTarget('dailyFluidMl', v)} />
        <TargetInput label="Bước chân" unit="bước" value={settings.personalTargets.dailySteps} onChange={(v) => updateTarget('dailySteps', v)} />
        <RangeInputs label="Calo" unit="kcal" min={settings.personalTargets.dailyCaloriesMin} max={settings.personalTargets.dailyCaloriesMax} onMin={(v) => updateTarget('dailyCaloriesMin', v)} onMax={(v) => updateTarget('dailyCaloriesMax', v)} />
        <RangeInputs label="Protein" unit="g" min={settings.personalTargets.dailyProteinMinG} max={settings.personalTargets.dailyProteinMaxG} onMin={(v) => updateTarget('dailyProteinMinG', v)} onMax={(v) => updateTarget('dailyProteinMaxG', v)} />
        <RangeInputs label="Giấc ngủ" unit="phút" min={settings.personalTargets.dailySleepMinMinutes} max={settings.personalTargets.dailySleepMaxMinutes} onMin={(v) => updateTarget('dailySleepMinMinutes', v)} onMax={(v) => updateTarget('dailySleepMaxMinutes', v)} />
        <TargetInput label="Rau + trái cây" unit="khẩu phần" value={settings.personalTargets.dailyProduceServings} onChange={(v) => updateTarget('dailyProduceServings', v)} />
      </div></section>

      <section className="settings-section"><h2>Lịch trong tuần</h2><SchedulePicker label="Tập luyện" selected={settings.schedule.trainingDays} onToggle={(day) => toggleDay('trainingDays', day)} /><SchedulePicker label="Routine tư thế" selected={settings.schedule.postureDays} onToggle={(day) => toggleDay('postureDays', day)} /><SchedulePicker label="Cân sáng" selected={settings.schedule.weighInDays} onToggle={(day) => toggleDay('weighInDays', day)} /></section>

      <section className="settings-section"><h2>Backup và quyền riêng tư</h2><p className="settings-copy">Code website có thể public trên GitHub, nhưng nhật ký cá nhân chỉ nằm trong trình duyệt. Xóa dữ liệu trình duyệt có thể làm mất nhật ký.</p><div className="settings-actions"><button className="button secondary" onClick={exportData}><Download size={18} />Xuất JSON</button><button className="button secondary" onClick={() => fileRef.current?.click()}><Upload size={18} />Nhập JSON</button><input ref={fileRef} hidden type="file" accept="application/json" onChange={(e) => { const file = e.target.files?.[0]; if (file) importData(file); }} /></div></section>

      <section className="settings-section danger-zone"><h2>Vùng nguy hiểm</h2><p>Xóa toàn bộ checklist, nhật ký, số đo và cài đặt trên thiết bị này.</p><button className="button danger" onClick={() => setResetOpen(true)}><Trash2 size={18} />Xóa toàn bộ dữ liệu</button></section>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Xóa toàn bộ dữ liệu?">
        <p>Hành động này không thể hoàn tác. Hãy export backup trước.</p><label className="field-label">Nhập <strong>XÓA DỮ LIỆU</strong> để xác nhận<input className="text-input" value={resetText} onChange={(e) => setResetText(e.target.value)} /></label><div className="modal-actions"><button className="button secondary" onClick={() => setResetOpen(false)}>Hủy</button><button className="button danger" disabled={resetText !== 'XÓA DỮ LIỆU'} onClick={resetAll}>Xóa vĩnh viễn</button></div>
      </Modal>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function TargetInput({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (value: number) => void }) { return <label className="target-input"><span>{label}</span><div><input type="number" min="0" value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} /><small>{unit}</small></div></label>; }
function RangeInputs({ label, unit, min, max, onMin, onMax }: { label: string; unit: string; min: number; max: number; onMin: (v: number) => void; onMax: (v: number) => void }) { const invalid = min > max; return <div className={`range-inputs ${invalid ? 'invalid' : ''}`}><span>{label}</span><div><label>Từ<input type="number" min="0" value={min} onChange={(e) => onMin(Math.max(0, Number(e.target.value)))} /></label><span>—</span><label>Đến<input type="number" min="0" value={max} onChange={(e) => onMax(Math.max(0, Number(e.target.value)))} /></label><small>{unit}</small></div>{invalid && <em>Giá trị tối thiểu không được lớn hơn tối đa.</em>}</div>; }
function SchedulePicker({ label, selected, onToggle }: { label: string; selected: number[]; onToggle: (day: number) => void }) { return <div className="schedule-row"><strong>{label}</strong><div>{days.map((day) => <button key={day.n} className={selected.includes(day.n) ? 'selected' : ''} onClick={() => onToggle(day.n)} aria-pressed={selected.includes(day.n)}>{day.label}</button>)}</div></div>; }
