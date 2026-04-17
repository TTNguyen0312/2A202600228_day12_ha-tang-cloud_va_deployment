# 📋 Phân Công Công Việc — Hackathon

## 🏷️ Tên Đề Tài
**MedRoute AI — Hệ Thống Agent Tự Động Phân Chuyên Khoa Bệnh Nhân**
> Ứng dụng AI agent phân tuyến bệnh nhân đến đúng chuyên khoa dựa trên mô tả triệu chứng tự nhiên, hỗ trợ giảm tải cho bộ phận tiếp nhận bệnh viện.

---

## 🛠️ Tech Stack

**Frontend**
- React / Next.js — giao diện chat & hiển thị kết quả
- Tailwind CSS — styling 
- Axios — gọi API backend

**Backend**
- Python + FastAPI — API server chính
- LangGraph — orchestration agent pipeline

**Khác**
- JSON — định dạng trao đổi dữ liệu giữa các tầng
- Git / GitHub — quản lý source code & phối hợp nhóm
- Localhost / ngrok — deploy demo live

---

## ✅ To-Do List — Các Đầu Việc Phải Hoàn Thành

### 🖥️ Demo Live
- [✅] Backend API chạy ổn định, không crash
- [✅] Frontend kết nối thành công với backend
- [✅] Luồng chat nhập triệu chứng → nhận kết quả chuyên khoa hoạt động end-to-end
- [✅] Hiển thị đúng: tên chuyên khoa, mức độ ưu tiên (🔴🟡🟢), lý do gợi ý
- [✅] Disclaimer y tế hiển thị trên UI
- [✅] (Testing) 3 kịch bản demo đã test kỹ và chạy mượt (Ngọc chuẩn bị sẵn input)
- [✅] (Testing) Có xử lý edge case: input mơ hồ → agent hỏi lại

### 📊 Slide Thuyết Trình
- [✅] Slide hoàn chỉnh (10–12 slides)
- [✅] Cấu trúc: Vấn đề → Giải pháp → Demo → Kiến trúc → Roadmap → Kết luận
- [✅] Có system architecture diagram
- [✅] Có hình ảnh / screenshot UI thực tế
- [✅] Font, màu sắc đồng nhất, không lỗi chính tả

### 📄 Tài Liệu Kỹ Thuật
- [✅] Mô tả bài toán và giải pháp (1 trang)
- [✅] System architecture diagram
- [✅] Mô tả từng agent (Intake Agent, Triage Agent) và luồng xử lý
- [✅] Danh sách API endpoints (`POST /api/chat`, `POST /api/triage`)
- [✅] Tech stack và lý do lựa chọn
- [✅] README hướng dẫn cài đặt & chạy project

---

## 👥 Phân Công Theo Thành Viên
> ⏰ **Thời gian còn lại: < 12 tiếng**

| Thành viên | Vai trò | Kỹ năng |
|---|---|---|
| Tiến | UI/UX Design, Flow Design, API Design, Agent Developer (Tools, System Prompt), Fullstack Developer |
| Quang | AI Agent Set Up and Developer, (System Prompt, Langgraph Set Up), Demo Slide |
| Minh | Fullstack Developer (Frontend: React/Next.js, Backend: Python/FastAPI) |
| Lộc | Backend Developer + Agent Developer (Python/FastAPI, System Prompt, Appointment Booking Flow) |
| Ngọc | Mock-up Data Design + Evaluation Metrics + Test Cases Design, Docs, Demo Slide |

---

### 🎨 Tiến — UI/UX Design, Flow Design, API Design, Agent Developer (Tools, System Prompt), Fullstack Developer

**🔴 Ưu tiên 1 — Chức năng chính (làm ngay)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 1 | Thiết kết Flow cho hệ thống, hoàn thiện Flow Diagram | Phối hợp với Minh |
| 2 | Hoàn thiện mockup màn hình chat nhập triệu chứng | Màn hình quan trọng nhất của demo |
| 3 | Thiết kế màn hình kết quả: chuyên khoa + mức độ khẩn cấp + lý do | Cần rõ ràng, trực quan với 🔴🟡🟢 |
| 4 | Chuẩn bị bản mẫu UI gửi cho Minh implement |   |
| 5 | Phát triển các tools cho agent: data look up tools, appointment booking tools | Tính năng quan trọng |
| 6 | Tích hợp các tool vào System Prompt và Langgraph | Phối hợp với Quang |
| 7 | Thiết kế API cho hệ thống |  |
| 8 | Integrate Frontend và Backend |  |
| 9 | Trình bày phần demo |  |

**🟡 Ưu tiên 2 — Chức năng mở rộng (nếu còn thời gian)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 10 | Xây dựng luồng phân tích ảnh triệu chứng (phát ban, vết thương) cho Agent | Phối hợp với Lộc |

---

### 🤖 Quang — AI Agent Set Up and Developer, (System Prompt, Langgraph Set Up), Demo Slide

**🔴 Ưu tiên 1 — Chức năng chính (làm ngay)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 1 | Xây dựng Langgraph Agent | Tính năng quan trọng |
| 2 | Xây dựng baseline cho System Prompt: phân tích & map chuyên khoa | Tính năng quan trọng |
| 3 | Viết & tối ưu system prompt — không chẩn đoán, chỉ gợi ý khoa | Phối hợp với Tiến | |
| 4 | Chuẩn bị Slide Demo | Phối Hợp với Ngọc |
| 5 | Chuẩn bị 3 kịch bản test sẵn cho demo live | Xem bảng kịch bản cuối file |

**🟡 Ưu tiên 2 — Chức năng mở rộng (nếu còn thời gian)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 6 | Hỗ trợ hoàn thiện UI | Phối hợp với Quang |

---

### 💻 Minh — Fullstack Developer (Frontend: React/Next.js, Backend: Python/FastAPI)

**🔴 Ưu tiên 1 — Chức năng chính (làm ngay)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 1 | Thiết kế Flow cho hệ thống | Phối hợp với Tiến |
| 1 | Build chat interface - nhập triệu chứng bằng lời | Phối hợp với Tiến |
| 2 | Build màn hình hiển thị kết quả phân khoa | Phối hợp với Tiến |
| 3 | Kết nối frontend ↔ backend API (đồng bộ schema với Lộc) | Thống nhất format JSON trong 2 tiếng đầu |
| 4 | Xử lý loading state & error handling | Tránh màn hình trắng khi demo |
| 5 | Hỗ trợ Lộc dựng API nếu cần thêm người | BE + FE đều làm được |

**🟡 Ưu tiên 2 — Chức năng mở rộng (nếu còn thời gian)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 6 | Build màn hình đặt lịch khám (chọn ngày, giờ, bác sĩ) | UI đơn giản, mock data |

---

### ⚙️ Lộc — Backend Developer + Agent Developer (Python/FastAPI, System Prompt, Appointment Booking Flow)

**🔴 Ưu tiên 1 — Chức năng chính (làm ngay)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 1 | Dựng baseline API server FastAPI: `POST /api/chat`, `POST /api/triage` | Skeleton xong trong giờ đầu |
| 2 | Integrate Backend và Frontend | Phối hợp với Tiến |
| 3 | Thiết kế & thống nhất request/response JSON schema với Minh | Ưu tiên cao nhất — làm ngay đầu giờ |
| 4 | Xây dựng session management - lưu lịch sử hội thoại | Cần cho multi-turn conversation |
| 5 | Thiết kế các luồng bổ sung (appointment view / phân tích ảnh) | Phối hợp với Tiến |

**🟡 Ưu tiên 2 — Chức năng mở rộng (nếu còn thời gian)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 6 | Xây dựng luồng phân tích ảnh triệu chứng (phát ban, vết thương) cho Agent | Phối hợp với Tiến |
| 7 | Thiết kế và xây dựng lại UI xem bác sĩ, lịch khám và book lịch khám | |

---

### 📊 Ngọc — Mock-up Data Design + Evaluation Metrics + Test Cases Design, Docs, Demo Slide 

**🔴 Ưu tiên 1 — Chức năng chính (làm ngay)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 1 | Xây dựng mock up database: triệu chứng, chuyên khoa,... | 8–10 chuyên khoa phổ biến, tham khảo ICD-10 — gửi cho Tiến |
| 2 | Chuẩn bị 15–20 ca bệnh mẫu đa dạng để test agent | Bao gồm ca khẩn cấp, thông thường, mơ hồ |
| 3 | Test thủ công toàn bộ luồng — nhập triệu chứng & kiểm tra kết quả | Báo cáo lỗi / kết quả sai cho Quang & Lộc |
| 4 | Soạn nội dung slide (text outline) gửi cho Quang design | Cấu trúc: Vấn đề → Giải pháp → Demo → Kiến trúc → Roadmap |
| 5 | Soạn tài liệu kỹ thuật (không cần code — mô tả luồng, kiến trúc) | Phối hợp với Quang & Lộc để lấy thông tin kỹ thuật |

**🟡 Ưu tiên 2 — Chức năng mở rộng (nếu còn thời gian)**

| # | Công việc | Ghi chú |
|---|-----------|---------|
| 6 | Chuẩn bị thêm test cases cho tính năng gửi ảnh triệu chứng | Mô tả ca bệnh + ảnh mẫu tương ứng |
| 7 | Nghiên cứu quy trình đặt lịch khám thực tế tại bệnh viện VN | Làm cơ sở cho tính năng mở rộng |

---

## 🗺️ Lộ Trình Tính Năng

### Chức năng chính:
> Tư vấn và phân chuyên khoa dựa trên mô tả triệu chứng bằng lời

```
Bệnh nhân nhập triệu chứng bằng text/ảnh
        ↓
Agent hỏi làm rõ (multi-turn)
        ↓
Agent phân tích → gợi ý chuyên khoa
        ↓
Nếu user đồng ý đặt lịch khám, Agent lấy và hiển thị danh sách bác sĩ của khoa đó
         ↓
Sau khi user chọn bác sĩ, Agent trả về các lịch khám còn trống của bác sĩ đó
         ↓
User chọn và đặt lịch
         ↓
Hiển thị kết quả trực quan trên UI
```

## 🎯 3 Kịch Bản Demo Live

| # | Input bệnh nhân | Kết quả mong đợi |
|---|-----------------|-----------------|
| 🔴 | *"Đau ngực dữ dội lan lên vai trái, khó thở, đổ mồ hôi được 1 tiếng"* | Tim mạch / Cấp cứu — **KHẨN CẤP** |
| 🟡 | *"Đau đầu liên tục 3 ngày, buồn nôn, sợ ánh sáng"* | Thần kinh — **Ưu tiên** |
| 🔵 | *"Tôi thấy mệt mỏi"* (mơ hồ) | Agent hỏi làm rõ → sau đó phân khoa |

---
