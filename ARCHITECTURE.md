# Architecture

## Static frontend

GitHub Pages chỉ host file trong `dist/`. Không có backend.

## Persistence

- `localStorage`: settings và onboarding.
- IndexedDB/Dexie: task completions, daily metrics, daily logs, measurements, weekly reviews.

Mỗi metric dùng key `YYYY-MM-DD|METRIC_ID`, tránh tạo record trùng khi bấm quick-add nhiều lần.

## Privacy boundary

Public: code, task template, roadmap và knowledge base.

Private trên thiết bị: checklist, số đo, nhật ký và backup.

## Routing

Dùng `HashRouter`, tránh lỗi 404 khi refresh trên GitHub Pages.
