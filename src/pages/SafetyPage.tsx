import { AlertTriangle, ArrowLeft, Ban, CircleHelp, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAFETY_ITEMS } from '../data/content';

export function SafetyPage() {
  return (
    <div className="page safety-page">
      <Link to="/today" className="back-link"><ArrowLeft size={17} />Hôm nay</Link>
      <header className="safety-hero"><span><AlertTriangle /></span><div><p className="eyebrow">Safety Center</p><h1>Không đánh đổi sức khỏe lấy vài mm khó đo</h1><p>Phần này tách rõ thứ không nên tự thử và lúc nào cần người hành nghề phù hợp.</p></div></header>
      <div className="safety-grid">
        {SAFETY_ITEMS.map((group, index) => <section key={group.title} className={`safety-card ${index === 0 ? 'danger-card' : ''}`}><div className="safety-card-title">{index === 0 ? <Ban /> : index === 1 ? <CircleHelp /> : <Stethoscope />}<h2>{group.title}</h2></div><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}
      </div>
      <section className="emergency-card"><h2>Cần xử lý khẩn khi</h2><ul><li>Khó thở rõ.</li><li>Sưng mặt, môi hoặc lưỡi sau sản phẩm.</li><li>Đau mắt kèm giảm thị lực.</li><li>Hàm khóa không đóng hoặc mở được sau chấn thương.</li></ul></section>
      <div className="disclaimer-card"><strong>Tuyên bố giới hạn</strong><p>Website là công cụ giáo dục và theo dõi cá nhân, không thay thế chẩn đoán hoặc điều trị y khoa.</p></div>
    </div>
  );
}
