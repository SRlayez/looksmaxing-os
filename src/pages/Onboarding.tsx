import { useState } from 'react';
import { ArrowRight, Check, Database, Sparkles } from 'lucide-react';
import { useApp } from '../app-context';

export function Onboarding() {
  const { settings, updateSettings } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(settings.displayName);
  const [weight, setWeight] = useState('');

  const finish = () => {
    updateSettings({ displayName: name.trim() || 'Hiệp', onboardingCompleted: true, activeWeek: 0 });
  };

  const screens = [
    <div className="onboarding-panel" key="intro"><span className="onboarding-icon"><Sparkles /></span><p className="eyebrow">Chào mừng</p><h1>Looksmax OS</h1><p>Hệ thống giúp bạn cải thiện ngoại hình bằng từng bước nhỏ, không có beauty score và không nhồi mọi thứ trong một ngày.</p><ul className="onboarding-points"><li><Check />Checklist rõ ràng</li><li><Check />Lộ trình mở dần theo tuần</li><li><Check />Cảnh báo các mẹo rủi ro</li></ul></div>,
    <div className="onboarding-panel" key="profile"><span className="onboarding-icon"><Sparkles /></span><p className="eyebrow">Thiết lập nhanh</p><h1>Cá nhân hóa dashboard</h1><label className="field-label">Tên hiển thị<input className="text-input" value={name} onChange={(e) => setName(e.target.value)} /></label><label className="field-label">Cân nặng hiện tại — tùy chọn<input className="text-input" inputMode="decimal" placeholder="54,5 kg" value={weight} onChange={(e) => setWeight(e.target.value)} /></label><p className="field-hint">Số cân sẽ không được tải lên mạng. Bạn có thể thêm lại trong trang Tiến độ.</p></div>,
    <div className="onboarding-panel" key="privacy"><span className="onboarding-icon"><Database /></span><p className="eyebrow">Quyền riêng tư</p><h1>Dữ liệu ở trên thiết bị</h1><p>Website không có tài khoản, server hay tracker. Checklist, nhật ký và số đo được lưu trong trình duyệt hiện tại.</p><div className="privacy-box"><strong>Lưu ý</strong><p>Xóa dữ liệu trình duyệt có thể làm mất nhật ký. Hãy dùng Export JSON trong Cài đặt để backup.</p></div></div>,
  ];

  return (
    <main className="onboarding-page"><div className="onboarding-card">{screens[step]}<div className="onboarding-footer"><div className="onboarding-dots">{screens.map((_, index) => <span key={index} className={index === step ? 'active' : ''} />)}</div>{step < screens.length - 1 ? <button className="button primary" onClick={() => setStep((value) => value + 1)}>Tiếp tục <ArrowRight size={18} /></button> : <button className="button primary" onClick={finish}>Bắt đầu Tuần 0 <ArrowRight size={18} /></button>}</div></div></main>
  );
}
