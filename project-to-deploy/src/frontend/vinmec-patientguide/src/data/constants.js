/* ─── Emergency keywords ─── */
export const EMERGENCY_KEYWORDS = [
  'đau ngực',
  'khó thở',
  'co giật',
  'bất tỉnh',
  'chảy máu nhiều',
  'đột quỵ',
  'ngừng thở',
];

/* ─── AI clarifying questions (max 3 rounds) ─── */
export const AI_QUESTIONS = [
  'Triệu chứng này xuất hiện từ khi nào?',
  'Mức độ đau/khó chịu từ 1–10?',
  'Bạn có đang dùng thuốc gì không?',
];

/* ─── Specialties ─── */
export const SPECIALTIES = [
  { id: 'noi',          name: 'Nội tổng quát',  icon: '🩺', desc: 'Khám tổng quát, sốt, mệt mỏi' },
  { id: 'than-kinh',    name: 'Thần kinh',      icon: '🧠', desc: 'Đau đầu, chóng mặt, tê bì' },
  { id: 'tim-mach',     name: 'Tim mạch',       icon: '❤️', desc: 'Huyết áp, nhịp tim, tức ngực' },
  { id: 'co-xuong-khop',name: 'Cơ xương khớp',  icon: '🦴', desc: 'Đau lưng, khớp, cột sống' },
  { id: 'tieu-hoa',     name: 'Tiêu hóa',       icon: '🫁', desc: 'Đau bụng, trào ngược, tiêu chảy' },
  { id: 'da-lieu',      name: 'Da liễu',        icon: '🧴', desc: 'Phát ban, dị ứng, mụn' },
];

/* ─── Doctors ─── */
export const DOCTORS = [
  { id: 1, name: 'BS. Nguyễn Văn An',  exp: '15 năm', rating: 4.9, avatar: '👨‍⚕️' },
  { id: 2, name: 'BS. Trần Thị Mai',   exp: '12 năm', rating: 4.8, avatar: '👩‍⚕️' },
  { id: 3, name: 'BS. Lê Hoàng Nam',   exp: '20 năm', rating: 5.0, avatar: '👨‍⚕️' },
];

/* ─── Time slots ─── */
export const TIME_SLOTS = [
  { id: 's1', time: '08:00', period: 'Sáng' },
  { id: 's2', time: '08:30', period: 'Sáng' },
  { id: 's3', time: '09:00', period: 'Sáng' },
  { id: 's4', time: '09:30', period: 'Sáng' },
  { id: 's5', time: '10:00', period: 'Sáng' },
  { id: 's6', time: '14:00', period: 'Chiều' },
  { id: 's7', time: '14:30', period: 'Chiều' },
  { id: 's8', time: '15:00', period: 'Chiều' },
  { id: 's9', time: '15:30', period: 'Chiều' },
];
