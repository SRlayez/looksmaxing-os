import { Link } from 'react-router-dom';
export function NotFoundPage() { return <div className="page"><div className="empty-card not-found"><span>404</span><h1>Trang không tồn tại</h1><p>Đường dẫn có thể đã thay đổi hoặc bị nhập sai.</p><Link className="button primary inline" to="/today">Quay về Hôm nay</Link></div></div>; }
