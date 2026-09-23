# V3.0 Acceptance Test

## Role UX

- Login từng tài khoản demo.
- Xác nhận menu/dashboard khác nhau giữa Admin, Executive, Manager, Lecturer, Researcher, Student, Staff.
- Multirole switch context phải đổi workspace và scope; không union quyền giữa contexts.

## Human–AI work

- Tạo Work Item.
- Phân công ít nhất 2 AI vào cùng Work Item.
- Mỗi AI chỉ nhận capability/action nằm trong profile được phép.
- Chạy READY assignments; kết quả được lưu vào Work Item outputs.
- Trace phải có human owner, agent, assignment, capabilities, actions, model.
- Nếu chọn OpenAI + key, runtime gọi model thật; mock vẫn chạy offline.

## Import / master data

- Import `samples/personnel.csv`.
- Preview hiển thị valid/error trước commit.
- Commit tạo master personnel + provisioning queue.
- Admin xác nhận tạo account từ queue.
- Import student, facilities, assets; master data tăng đúng.
- Record thiếu email phải bị đánh dấu lỗi với personnel/student.

## Security boundaries

- System Admin không được coi là institutional decision authority.
- API key không được persist.
- Browser authorization được ghi rõ là demo/reference only.
