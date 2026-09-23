# ANU2 V5.2.1 — Persistent Multimodal Artifact Bytes

Hotfix cho V5.2: artifact metadata đã được lưu nhưng bytes tệp chỉ nằm trong RAM của tab, nên sau reload nút “AI xử lý tệp” báo FILE_BYTES_NOT_IN_SESSION.

V5.2.1 thay đổi:
- Lưu bytes tệp vào IndexedDB của trình duyệt, không chỉ giữ trong memory.
- Sau reload, MultimodalProcessor tự rehydrate File từ IndexedDB.
- Nếu artifact cũ từ V5.2 không có bytes, chọn lại đúng tệp một lần. Hệ thống nhận diện checksum và gắn bytes trở lại artifact cũ thay vì tạo bản ghi trùng.
- Metadata vẫn ở BrowserStore/localStorage; binary không đưa vào localStorage.
- Hiển thị bytesState: PERSISTED / SESSION_ONLY / MISSING / INLINE_TEXT.
- Không thay đổi cơ chế phân quyền AI, provenance, Work Item hay model provider.

Lưu ý: IndexedDB là storage cục bộ của trình duyệt, phù hợp thử nghiệm GitHub Pages. Production vẫn cần Object Storage/API phía server.
