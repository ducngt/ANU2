# ANU2 V4.0 alpha 2

Alpha 2 tiếp tục V4 theo nguyên tắc nâng cấp không hồi quy từ V3/V4 alpha 1.

## Phạm vi alpha 2

- Real AI runtime thử nghiệm trên GitHub Pages với lựa chọn provider do **System Admin** cấu hình: Mock, OpenAI, OpenRouter, Google Gemini, hoặc endpoint OpenAI-compatible/custom.
- Có **Test connection**, trạng thái provider và lỗi rõ ràng. Khi chọn provider thật, lỗi không được âm thầm chuyển sang mock.
- API key chỉ giữ trong memory của tab hiện tại; không lưu LocalStorage, audit hay source.
- Khôi phục i18n ở cả **nội dung trang làm việc**, không chỉ menu: VI / EN / 中文 (zh-CN).
- Thêm tài khoản demo `rector / Rector123!` và mở rộng Rector/Vice Rector ở scope `ANU` với data scope `*`; màn Dữ liệu hiển thị dữ liệu toàn trường.
- Thêm **Đơn vị tổ chức** vào University Reality và Import Center. Mỗi đơn vị có mã, loại, đơn vị cấp trên, sứ mệnh, chức năng, nhiệm vụ/trách nhiệm và vai trò quản lý.
- Có file mẫu `samples/organizations.csv`.

## Tài khoản demo

- admin / Admin123!
- rector / Rector123!
- executive / Executive123!
- manager / Manager123!
- lecturer / Lecturer123!
- researcher / Research123!
- student / Student123!
- staff / Staff123!
- multirole / MultiRole123!

## Kiểm thử

```bash
npm install
npm run check
```

Alpha 2 hiện có 13 test bao gồm regression V3/V4 foundation, organization import, Rector/Vice Rector full scope, i18n catalogs và real-provider no-silent-fallback.

## Lưu ý về runtime AI trên GitHub Pages

Alpha 2 phục vụ **thử nghiệm** bằng BYOK trong browser. Provider phải cho phép request từ browser. Với triển khai thể chế, cần đưa Provider Adapter/Agent Runtime sang backend hoặc serverless gateway để giữ bí mật credential, policy và audit ở phía server.

## Hướng tiếp theo

Alpha 3: delegation chi tiết theo Work/Task (capability/action/resource/time scope), human checkpoints và multi-agent orchestration có kiểm soát.
