# ANU2 V3.0 Architecture

## Product surface

Giao diện nghiệp vụ không hiển thị thuật ngữ kiến trúc. Người dùng thấy công việc, dữ liệu, trạng thái, hành động cần thực hiện và phần việc AI đang cùng triển khai.

## Operational model

`Human Purpose → Work Item → Task → Agent Assignment → Delegated Authority → Execution → Evidence → Human/Policy Checkpoint → Outcome → Learning`

Mỗi Work Item có Human Owner và có thể có nhiều Agent assignments. Mỗi assignment giới hạn capability và action; runtime không cho Agent tự mở rộng quyền.

## Role-native workspaces

- System Admin: data intake, master data, accounts/roles, system work, AI/model, audit, advanced config.
- Executive: institution overview, work/decisions, research, data/indicators.
- Middle management: unit overview, work, people, research, data.
- Lecturer: teaching, research, knowledge, work.
- Researcher: research, evidence/knowledge, work.
- Student: learning, tasks, knowledge.
- Staff: operational work and data.

## University Reality / Master Data

- Person / Employee / Academic relation
- Student
- Organization
- Campus / Building / Room
- Asset
- Inventory

Import data first enters validation/preview and only valid rows enter master data. Personnel and student records generate account provisioning candidates.

## SBBS underneath

V3 vẫn giữ SBBS ở tầng kỹ thuật: reusable capability implementation, contracts, assemblies và components. Các thuật ngữ này không phải vocabulary của UI nghiệp vụ.
