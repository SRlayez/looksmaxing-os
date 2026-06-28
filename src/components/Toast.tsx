import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span>{message}</span>
      <button className="icon-button" onClick={onClose} aria-label="Đóng thông báo"><X size={16} /></button>
    </div>
  );
}
