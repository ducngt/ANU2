# ANU2 V3.0 — Human–AI Joint Operational Workspace

Bản thử nghiệm V3.0 nâng cấp từ V2 theo ba thay đổi chính:

1. **Workspace theo vai trò**: Admin, lãnh đạo, quản lý, giảng viên, nhà nghiên cứu, sinh viên và cán bộ có dashboard/menu khác nhau.
2. **Human–AI joint work**: AI không được trình bày như chatbot/trợ lý; AI được phân công vào Work Item/Task, có capability + delegated actions + scope, chạy qua runtime và tạo evidence/trace.
3. **University Reality / Data Intake**: Admin nhập dữ liệu nhân sự, sinh viên, cơ sở vật chất, thiết bị và vật tư; dữ liệu người tạo hàng đợi để Admin tạo tài khoản và xác nhận role/scope.

## Demo accounts

- admin / Admin123!
- executive / Executive123!
- manager / Manager123!
- lecturer / Lecturer123!
- researcher / Research123!
- student / Student123!
- staff / Staff123!
- multirole / MultiRole123!

## Chạy thử

```bash
npm install
npm run check
npm start
```

Mở `http://localhost:8080`.

## Agent chạy thật

Mặc định V3 dùng provider mô phỏng để demo offline. Vào **AI & mô hình**, chọn OpenAI, nhập model và API key. API key chỉ giữ trong memory của tab hiện tại và không lưu vào LocalStorage/Audit. Khi đó các AI được phân công trong Work Item sẽ gọi model thật qua Model Gateway.

## Nhập dữ liệu

Bản thử nghiệm này hỗ trợ **CSV và JSON** trực tiếp trong browser. File Excel cần lưu thành CSV trước khi nhập. Có file mẫu trong `samples/`.

Pipeline:

`Upload → Parse → Normalize → Validate → Preview → Commit → Master Data → Provisioning Queue`

Nhân sự/sinh viên sau import **không tự động trở thành tài khoản**. Admin phải xác nhận tạo account/role/scope trong màn **Người dùng & phân quyền**.

## GitHub Pages

Workflow `.github/workflows/pages.yml` deploy static app trực tiếp lên GitHub Pages. Nếu repo dùng Pages workflow mặc định của GitHub thì có thể bỏ workflow tùy biến để tránh chạy hai cơ chế song song.

## Giới hạn của bản thử nghiệm

GitHub Pages là static hosting. Browser-side identity/authorization phù hợp để thử nghiệm UX/runtime nhưng **không phải security boundary cho production**. Triển khai thể chế cần backend authority, database, secret management và server-side policy enforcement.
