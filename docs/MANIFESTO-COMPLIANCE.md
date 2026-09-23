# ANU2 V3.0 — Manifesto / HANDOFF Compliance

| Nguyên tắc | Hiện thực trong V3 thử nghiệm |
|---|---|
| Operational workspace, không architecture showcase | Dashboard/menu theo active role; thuật ngữ kiến trúc chỉ còn trong Admin > Cấu hình nâng cao |
| One identity, multiple roles, active context | Identity assignments + context switch; workspace thay theo role/scope |
| Human Agency | Work Item luôn có Human Owner; AI chỉ thực hiện assignment được ủy quyền |
| Capability != Authority | Agent profile xác định capability; assignment chỉ được delegate subset capability/action |
| Multi-agent work | Một Work Item có nhiều Agent assignments và runtime thực hiện từng nhiệm vụ |
| Agent identity / owner / accountability | Agent seed có id, owner, accountableRole, capabilities, defaultActions, status |
| Safe authority boundary | Runtime từ chối capability/action không nằm trong Agent profile; AI không có approve/commit mặc định |
| Evidence / audit | Output lưu assignment/capabilities/actions; trace và audit ghi human + AI + work + model |
| University Reality | Master data cho personnel, students, facilities, assets, inventory |
| Trusted data intake | Import CSV/JSON qua normalize → validate → preview → commit; dòng lỗi không vào master data |
| Identity provisioning from reality data | Personnel/student import tạo provisioning queue; Admin phải xác nhận tạo account/role/scope |
| Technology replaceable | BrowserStore + ModelGateway là adapter; GitHub Pages chỉ là reference runtime |
| AI chạy thật khi được cấu hình | Model Gateway gọi OpenAI khi user chọn provider + key; mock provider cho offline test |
