# 🏥 Hệ Thống Agent Phân Chuyên Khoa Bệnh Nhân

> **Mục tiêu:** Xây dựng hệ thống AI agent tự động phân tuyến bệnh nhân đến đúng chuyên khoa dựa trên mô tả triệu chứng — không chẩn đoán bệnh, chỉ gợi ý chuyên khoa phù hợp.

---

## 🎯 Chức Năng Chính: Phân Chuyên Khoa Từ Triệu Chứng

### Luồng xử lý cốt lõi

```
Bệnh nhân mô tả triệu chứng
        ↓
Intake Agent (thu thập & làm rõ)
        ↓
Triage Agent (phân tích & định tuyến)
        ↓
Kết quả: Chuyên khoa + Mức độ ưu tiên + Tóm tắt cho bác sĩ
```

---

### Bước 1 — Intake Agent (Thu Thập Triệu Chứng)

**Nhiệm vụ:**
- Nhận mô tả tự do từ bệnh nhân (text / voice)
- Hỏi thêm câu hỏi làm rõ theo cấu trúc:
  - Vị trí: *"Cơn đau ở đâu?"*
  - Thời gian: *"Triệu chứng xuất hiện từ bao giờ?"*
  - Mức độ: *"Đau từ 1–10 là bao nhiêu?"*
  - Đặc điểm: *"Liên tục hay từng cơn?"*
  - Tiền sử: *"Có bệnh nền hay đang dùng thuốc gì không?"*
- Chuyển ngôn ngữ tự nhiên → danh sách triệu chứng có cấu trúc (structured extraction)

**Output mẫu:**
```json
{
  "symptoms": ["đau ngực", "khó thở", "hồi hộp"],
  "duration": "2 giờ",
  "severity": 8,
  "history": ["tăng huyết áp"],
  "medications": ["amlodipine"]
}
```

---

### Bước 2 — Triage Agent (Phân Tích & Định Tuyến)

**Nhiệm vụ:**
- Map triệu chứng → chuyên khoa phù hợp (rule-based + LLM)
- Đánh giá mức độ khẩn cấp:
  - 🔴 **Khẩn cấp** — cần cấp cứu ngay
  - 🟡 **Ưu tiên** — khám trong ngày
  - 🟢 **Thông thường** — đặt lịch bình thường
- Gợi ý 1–3 chuyên khoa theo thứ tự ưu tiên, kèm lý do rõ ràng

**Output mẫu:**
```json
{
  "recommended_departments": [
    { "name": "Tim mạch", "priority": 1, "reason": "Đau ngực + khó thở cần loại trừ nhồi máu cơ tim" },
    { "name": "Hô hấp", "priority": 2, "reason": "Khó thở có thể do nguyên nhân phổi" }
  ],
  "urgency": "HIGH",
  "summary_for_doctor": "BN nam/nữ, đau ngực dữ dội mức 8/10 kèm khó thở xuất hiện 2 giờ, tiền sử THA đang dùng amlodipine."
}
```

---

### Bước 3 — Đầu Ra & Tích Hợp

- Hiển thị kết quả cho bệnh nhân (giao diện thân thiện)
- Gửi tóm tắt triệu chứng cho bác sĩ trước khi khám
- Tích hợp vào hệ thống đặt lịch / HIS (Hospital Information System)

---

## 🔧 Gợi Ý Kỹ Thuật

| Thành phần | Công nghệ gợi ý |
|---|---|
| LLM backbone | Claude / GPT-4o với system prompt y tế |
| Orchestration | LangChain / LlamaIndex / custom agent loop |
| Structured extraction | Function calling / JSON mode |
| Backend | Python (FastAPI) hoặc Node.js |
| Frontend demo | React / Next.js hoặc Streamlit |
| Database | PostgreSQL hoặc MongoDB |

### Safety Layer — BẮT BUỘC

- ⚠️ **Không chẩn đoán bệnh** — chỉ gợi ý chuyên khoa
- ⚠️ **Luôn có disclaimer** — khuyến nghị gặp bác sĩ
- ⚠️ **Fallback** — nếu không đủ thông tin → hỏi thêm hoặc chuyển bác sĩ tổng quát
- ⚠️ **Cờ khẩn cấp** — tự động cảnh báo khi phát hiện triệu chứng nguy hiểm tính mạng

### Ví Dụ System Prompt

```
Bạn là hệ thống hỗ trợ phân chuyên khoa tại bệnh viện.
Nhiệm vụ của bạn là phân tích triệu chứng và gợi ý chuyên khoa phù hợp.
KHÔNG được chẩn đoán bệnh cụ thể.
Luôn nhắc bệnh nhân đây chỉ là gợi ý ban đầu, cần gặp bác sĩ để được khám chính xác.
Ưu tiên an toàn: khi có triệu chứng nguy hiểm, luôn cảnh báo cấp cứu ngay.
```

---

## 🚀 Hướng Mở Rộng Sau Hackathon

### Giai Đoạn 1 — Tăng Độ Chính Xác

- **Fine-tune model** trên dữ liệu bệnh viện thực tế (ICD-10, phác đồ điều trị Việt Nam)
- **Multimodal input:** Bệnh nhân chụp ảnh vết thương, phát ban → phân tích hình ảnh
- **Feedback loop:** Bác sĩ xác nhận / điều chỉnh kết quả → cải thiện model liên tục
- **Tích hợp ontology y tế:** SNOMED CT, MedDRA để hiểu triệu chứng chuyên sâu hơn

### Giai Đoạn 2 — Mở Rộng Trải Nghiệm

- **Chatbot đa kênh:** Zalo OA, app bệnh viện, web portal, Messenger
- **Voice input:** Hỗ trợ bệnh nhân cao tuổi nói thay vì gõ (Speech-to-Text)
- **Đa ngôn ngữ:** Tiếng Việt + tiếng Anh + phương ngữ vùng miền
- **Hồ sơ bệnh nhân:** Ghi nhớ tiền sử, thuốc đang dùng, dị ứng → tư vấn cá nhân hóa

### Giai Đoạn 3 — Hệ Sinh Thái Bệnh Viện

- **Đặt lịch thông minh:** Sau phân khoa → tự động gợi ý slot trống của bác sĩ phù hợp
- **Pre-visit summary:** Tóm tắt triệu chứng gửi bác sĩ trước khi khám, tiết kiệm thời gian
- **Theo dõi sau khám:** Nhắc uống thuốc, hỏi tiến triển, cảnh báo tái khám
- **Dashboard bệnh viện:** Phân tích xu hướng bệnh theo mùa / khu vực / nhân khẩu học
- **Tích hợp HIS / EMR:** Kết nối hệ thống quản lý bệnh viện hiện có

---

## 📋 Demo Hackathon — Kịch Bản Gợi Ý

**Kịch bản 1 — Khẩn cấp:**
> Bệnh nhân: *"Tôi đau ngực dữ dội, lan lên vai trái, kèm khó thở và đổ mồ hôi từ 1 tiếng trước"*
> → Agent: 🔴 **KHẨN CẤP** — Chuyên khoa **Tim mạch / Cấp cứu** — Gọi 115 ngay

**Kịch bản 2 — Thông thường:**
> Bệnh nhân: *"Tôi bị đau đầu liên tục 3 ngày, kèm buồn nôn và sợ ánh sáng"*
> → Agent: 🟡 **Ưu tiên** — Chuyên khoa **Thần kinh** (có thể migraine)

**Kịch bản 3 — Cần làm rõ:**
> Bệnh nhân: *"Tôi thấy mệt mỏi"*
> → Agent hỏi thêm: *"Bạn có thể mô tả rõ hơn — mệt mỏi kèm sốt, khó thở, hay đau ở đâu không?"*

---

## ⚠️ Lưu Ý Quan Trọng

1. **Pháp lý:** Hệ thống là công cụ hỗ trợ, không thay thế bác sĩ — ghi rõ disclaimer
2. **Bảo mật:** Dữ liệu sức khỏe thuộc nhóm dữ liệu nhạy cảm — cần mã hóa & tuân thủ quy định
3. **Bias:** Kiểm tra model không phân biệt đối xử theo giới tính, tuổi tác, dân tộc
4. **Ngưỡng an toàn:** Luôn ưu tiên cảnh báo over-triage hơn under-triage trong y tế
