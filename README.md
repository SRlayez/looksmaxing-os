# Looksmax OS

Website cá nhân giúp quản lý lộ trình looksmax 12 tuần theo hướng sức khỏe, an toàn và dễ duy trì. Giao diện ưu tiên điện thoại, dữ liệu lưu cục bộ trên thiết bị và không cần backend.

## Tính năng

- Onboarding 3 bước.
- Dashboard hằng ngày gồm:
  - Việc cốt lõi.
  - Chỉ tiêu định lượng: nước, bước chân, calo, protein, ngủ, rau quả.
  - Nhiệm vụ theo lịch.
  - Check-in chủ quan.
  - Tối ưu thêm.
- Lộ trình 12 tuần và module riêng theo chủ đề.
- Thư viện đã lọc theo chủ đề, loại nội dung và mức bằng chứng.
- Safety Center.
- Theo dõi cân, eo, chất lượng ngủ, năng lượng và compliance.
- Dark mode.
- Export/import dữ liệu JSON.
- Hoạt động hoàn toàn trên GitHub Pages.

## Công nghệ

- React + Vite + TypeScript strict.
- React Router với `HashRouter`.
- Dexie/IndexedDB để lưu dữ liệu.
- Zod để kiểm tra backup và settings.
- Recharts cho biểu đồ.
- Vitest + Testing Library.

## Chạy local

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal.

## Kiểm tra dự án

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run preview
```

## Deploy GitHub Pages

1. Tạo repository mới trên GitHub.
2. Push toàn bộ thư mục này lên branch `main`.
3. Vào **Settings → Pages**.
4. Chọn **Source: GitHub Actions**.
5. Workflow `.github/workflows/deploy.yml` sẽ tự lint, test, build và deploy.

Website dùng `HashRouter` và `base: './'`, nên không cần biết trước tên repository.

## Dữ liệu nằm ở đâu?

- Cài đặt: `localStorage`.
- Checklist, metric, nhật ký và số đo: IndexedDB database `looksmax_os_db`.
- Không có server, tài khoản hoặc analytics.

Xóa dữ liệu trình duyệt có thể làm mất nhật ký. Hãy dùng **Cài đặt → Xuất JSON** để backup định kỳ.

## Chỉnh mục tiêu

Vào **Cài đặt → Mục tiêu hằng ngày** để sửa:

- Lượng chất lỏng.
- Số bước.
- Khoảng calo.
- Khoảng protein.
- Khoảng thời lượng ngủ.
- Khẩu phần rau quả.

## Chỉnh lịch

Vào **Cài đặt → Lịch trong tuần** để chọn ngày:

- Tập luyện.
- Routine tư thế.
- Cân sáng.

## Chỉnh nội dung

Nội dung chính nằm ở:

- `src/data/content.ts`: task, metric, roadmap, module, library và safety.
- `src/content/LOOKSMAX_MASTER_PLAN_HIEP_v1.md`: tài liệu master gốc để tham chiếu.

Khi thêm task mới:

1. Dùng ID duy nhất.
2. Chọn đúng `phaseStart`.
3. Không biến phương pháp `D` hoặc `avoid` thành task khuyến nghị.
4. Luôn thêm `stopRule` nếu hành động có khả năng kích ứng hoặc đau.

## Quyền riêng tư

Có thể public source code và nội dung lên GitHub. Không commit:

- Ảnh cá nhân.
- File backup JSON.
- Kết quả khám.
- Token hoặc API key.

## Troubleshooting

### Trang trắng sau deploy

- Kiểm tra GitHub Pages đang dùng **GitHub Actions**.
- Mở tab Actions và xem bước build/deploy có pass không.
- Không đổi `base: './'` nếu chưa hiểu cấu hình Pages.

### Dữ liệu không lưu

- Không dùng chế độ duyệt web chặn hoàn toàn storage.
- Kiểm tra trình duyệt có cho phép IndexedDB/localStorage không.
- Export dữ liệu trước khi xóa cache.

### Import backup lỗi

- Chỉ dùng file JSON do website xuất.
- File tối đa 10 MB.
- Không chỉnh tay cấu trúc backup nếu không cần thiết.

## Giới hạn

Website là công cụ self-care và theo dõi cá nhân, không thay thế chẩn đoán hoặc điều trị y khoa.
