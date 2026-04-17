# prototype-readme.md

## MedRoute AI — Prototype Overview

**Mô tả:** Hệ thống agent tự động phân chuyên khoa bệnh nhân dựa trên mô tả triệu chứng tự nhiên.
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

## 🔗 Hướng dẫn set up và chạy thử demo
Tạo file .env tại thư mục gốc (root) theo file .env.example
Tạo file .env tại thư mục src/frontend/vinmec-patientguide theo file .env.example
Chạy pip install -r requirements.txt

**Chạy frontend**:
cd .\src\frontend\vinmec-patientguide\
npm i
npm run dev

**Chạy backend**:
Đứng tại thư mục gốc (root)
python -m uvicorn src.backend.main:app --reload

**Khi frontend và backend cùng được khởi chạy thành công thì có thể demo tại http://localhost:5173/?session_id=-001**

## 👥 Phân Công

| Thành viên | Vai trò |
|---|---|
| Tiến | UI/UX, Flow Design, API Design, Agent Tools, Fullstack |
| Quang | LangGraph Agent, System Prompt, Slide |
| Minh | Frontend (React/Next.js) + Backend (FastAPI) |
| Lộc | Backend API, Session Management, Appointment Flow |
| Ngọc | Mock Data, Test Cases, Docs, Slide content |

## 📦 Tech Stack
- **Frontend:** React / Next.js, Tailwind CSS
- **Backend:** Python + FastAPI
- **AI:** LangGraph agent pipeline + Claude API
- **Infra:** localhost / ngrok