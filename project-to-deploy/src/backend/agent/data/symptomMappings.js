/**
 * ─── SYMPTOM → SPECIALTY MAPPING ───
 *
 * This powers the AI triage engine. Each entry maps a set of symptom
 * keywords to one or more suggested specialties, ordered by relevance.
 *
 * urgency: 'emergency' | 'high' | 'normal' | 'low'
 */
const symptomMappings = [
  /* ── Emergency (routed to ER immediately) ── */
  {
    id: 'sym-em-01',
    keywords: ['đau ngực', 'tức ngực dữ dội', 'đau ngực lan ra tay'],
    urgency: 'emergency',
    suggestedDepartments: ['dept-cap-cuu', 'dept-tim-mach'],
    triageNote: 'Có thể nhồi máu cơ tim. Cần cấp cứu ngay.',
  },
  {
    id: 'sym-em-02',
    keywords: ['khó thở', 'không thở được', 'ngừng thở', 'thở gấp'],
    urgency: 'emergency',
    suggestedDepartments: ['dept-cap-cuu'],
    triageNote: 'Suy hô hấp cấp. Cần cấp cứu ngay.',
  },
  {
    id: 'sym-em-03',
    keywords: ['co giật', 'động kinh', 'lên cơn co giật'],
    urgency: 'emergency',
    suggestedDepartments: ['dept-cap-cuu', 'dept-than-kinh'],
    triageNote: 'Cơn co giật. Cần can thiệp cấp cứu.',
  },
  {
    id: 'sym-em-04',
    keywords: ['bất tỉnh', 'ngất xỉu', 'mất ý thức', 'hôn mê'],
    urgency: 'emergency',
    suggestedDepartments: ['dept-cap-cuu'],
    triageNote: 'Mất ý thức. Cần cấp cứu ngay.',
  },
  {
    id: 'sym-em-05',
    keywords: ['chảy máu nhiều', 'xuất huyết', 'máu không cầm'],
    urgency: 'emergency',
    suggestedDepartments: ['dept-cap-cuu'],
    triageNote: 'Xuất huyết nặng. Cần cấp cứu ngay.',
  },
  {
    id: 'sym-em-06',
    keywords: ['đột quỵ', 'méo miệng', 'liệt nửa người', 'không nói được đột ngột'],
    urgency: 'emergency',
    suggestedDepartments: ['dept-cap-cuu', 'dept-than-kinh'],
    triageNote: 'Nghi ngờ đột quỵ. Golden hour — cần cấp cứu tối khẩn.',
  },

  /* ── High urgency ── */
  {
    id: 'sym-hi-01',
    keywords: ['sốt cao', 'sốt trên 39', 'sốt không hạ', 'sốt kéo dài'],
    urgency: 'high',
    suggestedDepartments: ['dept-noi', 'dept-nhi'],
    triageNote: 'Sốt cao cần được khám sớm trong ngày.',
    followUpQuestions: ['Sốt bao nhiêu độ?', 'Sốt từ khi nào?', 'Có kèm phát ban không?'],
  },
  {
    id: 'sym-hi-02',
    keywords: ['đau bụng dữ dội', 'đau bụng quằn quại', 'đau bụng cấp'],
    urgency: 'high',
    suggestedDepartments: ['dept-tieu-hoa', 'dept-cap-cuu'],
    triageNote: 'Đau bụng cấp có thể cần can thiệp ngoại khoa.',
    followUpQuestions: ['Đau vị trí nào?', 'Có nôn/tiêu chảy không?', 'Có sốt kèm theo?'],
  },

  /* ── Normal urgency ── */
  {
    id: 'sym-no-01',
    keywords: ['đau đầu', 'nhức đầu', 'đau nửa đầu', 'migraine'],
    urgency: 'normal',
    suggestedDepartments: ['dept-than-kinh'],
    triageNote: 'Đau đầu cần đánh giá nguyên nhân.',
    followUpQuestions: ['Đau đầu từ khi nào?', 'Mức độ đau 1–10?', 'Có buồn nôn/nhìn mờ không?'],
  },
  {
    id: 'sym-no-02',
    keywords: ['chóng mặt', 'xây xẩm', 'hoa mắt', 'mất thăng bằng'],
    urgency: 'normal',
    suggestedDepartments: ['dept-than-kinh', 'dept-tmh'],
    triageNote: 'Chóng mặt có thể do thần kinh hoặc tiền đình.',
    followUpQuestions: ['Chóng mặt khi nào?', 'Có ù tai không?', 'Có buồn nôn?'],
  },
  {
    id: 'sym-no-03',
    keywords: ['tê bì', 'tê tay', 'tê chân', 'mất cảm giác'],
    urgency: 'normal',
    suggestedDepartments: ['dept-than-kinh', 'dept-co-xuong-khop'],
    triageNote: 'Tê bì có thể do thần kinh ngoại biên hoặc chèn ép rễ thần kinh.',
    followUpQuestions: ['Tê ở vùng nào?', 'Tê liên tục hay từng cơn?', 'Có đau kèm theo?'],
  },
  {
    id: 'sym-no-04',
    keywords: ['đau lưng', 'đau cột sống', 'đau thắt lưng'],
    urgency: 'normal',
    suggestedDepartments: ['dept-co-xuong-khop'],
    triageNote: 'Đau lưng cần đánh giá cơ xương khớp.',
    followUpQuestions: ['Đau từ khi nào?', 'Đau lan xuống chân không?', 'Có chấn thương gần đây?'],
  },
  {
    id: 'sym-no-05',
    keywords: ['đau khớp', 'sưng khớp', 'cứng khớp', 'đau gối', 'đau vai'],
    urgency: 'normal',
    suggestedDepartments: ['dept-co-xuong-khop'],
    triageNote: 'Triệu chứng cơ xương khớp cần khám chuyên khoa.',
    followUpQuestions: ['Khớp nào bị đau?', 'Có sưng đỏ không?', 'Cứng khớp buổi sáng bao lâu?'],
  },
  {
    id: 'sym-no-06',
    keywords: ['đau bụng', 'đau dạ dày', 'trào ngược', 'ợ nóng', 'ợ chua'],
    urgency: 'normal',
    suggestedDepartments: ['dept-tieu-hoa'],
    triageNote: 'Triệu chứng tiêu hóa cần đánh giá.',
    followUpQuestions: ['Đau ở vị trí nào?', 'Đau sau ăn hay lúc đói?', 'Có đi ngoài bất thường?'],
  },
  {
    id: 'sym-no-07',
    keywords: ['tiêu chảy', 'đi ngoài nhiều lần', 'phân lỏng'],
    urgency: 'normal',
    suggestedDepartments: ['dept-tieu-hoa', 'dept-noi'],
    triageNote: 'Tiêu chảy cần đánh giá mức độ mất nước.',
    followUpQuestions: ['Bao nhiêu lần/ngày?', 'Có máu trong phân?', 'Có sốt kèm?'],
  },
  {
    id: 'sym-no-08',
    keywords: ['phát ban', 'nổi mẩn', 'ngứa', 'dị ứng da', 'nổi mề đay'],
    urgency: 'normal',
    suggestedDepartments: ['dept-da-lieu'],
    triageNote: 'Triệu chứng da liễu cần khám.',
    followUpQuestions: ['Phát ban ở vùng nào?', 'Có ngứa không?', 'Có tiếp xúc chất lạ?'],
  },
  {
    id: 'sym-no-09',
    keywords: ['mụn', 'mụn trứng cá', 'mụn viêm', 'mụn mủ'],
    urgency: 'low',
    suggestedDepartments: ['dept-da-lieu'],
    triageNote: 'Mụn trứng cá cần điều trị da liễu.',
    followUpQuestions: ['Mụn ở vùng nào?', 'Đã điều trị gì chưa?', 'Mụn xuất hiện bao lâu?'],
  },
  {
    id: 'sym-no-10',
    keywords: ['huyết áp cao', 'tăng huyết áp', 'huyết áp'],
    urgency: 'normal',
    suggestedDepartments: ['dept-tim-mach'],
    triageNote: 'Cần kiểm soát huyết áp.',
    followUpQuestions: ['Huyết áp đo được bao nhiêu?', 'Đang dùng thuốc huyết áp?', 'Có đau đầu/chóng mặt?'],
  },
  {
    id: 'sym-no-11',
    keywords: ['đánh trống ngực', 'tim đập nhanh', 'rối loạn nhịp', 'hồi hộp'],
    urgency: 'normal',
    suggestedDepartments: ['dept-tim-mach'],
    triageNote: 'Triệu chứng tim mạch cần đánh giá.',
    followUpQuestions: ['Xảy ra khi nào?', 'Kéo dài bao lâu?', 'Có khó thở kèm?'],
  },
  {
    id: 'sym-no-12',
    keywords: ['ho', 'ho kéo dài', 'ho có đờm', 'ho khan'],
    urgency: 'normal',
    suggestedDepartments: ['dept-noi', 'dept-tmh'],
    triageNote: 'Ho cần đánh giá nguyên nhân hô hấp hoặc TMH.',
    followUpQuestions: ['Ho bao lâu rồi?', 'Có đờm màu gì?', 'Có sốt kèm?'],
  },
  {
    id: 'sym-no-13',
    keywords: ['viêm xoang', 'nghẹt mũi', 'chảy mũi', 'đau mặt'],
    urgency: 'normal',
    suggestedDepartments: ['dept-tmh'],
    triageNote: 'Triệu chứng TMH cần khám.',
    followUpQuestions: ['Nghẹt 1 bên hay 2 bên?', 'Có chảy mũi sau?', 'Có đau đầu kèm?'],
  },
  {
    id: 'sym-no-14',
    keywords: ['đau mắt', 'mờ mắt', 'nhìn mờ', 'đỏ mắt', 'cộm mắt'],
    urgency: 'normal',
    suggestedDepartments: ['dept-mat'],
    triageNote: 'Triệu chứng mắt cần khám nhãn khoa.',
    followUpQuestions: ['Mờ 1 mắt hay 2 mắt?', 'Mờ đột ngột hay từ từ?', 'Có đau mắt không?'],
  },
  {
    id: 'sym-no-15',
    keywords: ['mệt mỏi', 'uể oải', 'kiệt sức', 'không có năng lượng'],
    urgency: 'low',
    suggestedDepartments: ['dept-noi'],
    triageNote: 'Mệt mỏi kéo dài cần đánh giá tổng quát.',
    followUpQuestions: ['Mệt từ khi nào?', 'Có sụt cân không?', 'Giấc ngủ thế nào?'],
  },

  /* ── Pediatric ── */
  {
    id: 'sym-no-16',
    keywords: ['trẻ sốt', 'con sốt', 'bé sốt', 'em bé sốt'],
    urgency: 'high',
    suggestedDepartments: ['dept-nhi'],
    triageNote: 'Trẻ em sốt cần khám nhi sớm.',
    followUpQuestions: ['Bé bao nhiêu tuổi?', 'Sốt bao nhiêu độ?', 'Có phát ban không?'],
  },
  {
    id: 'sym-no-17',
    keywords: ['trẻ ho', 'con ho', 'bé ho', 'trẻ khò khè'],
    urgency: 'normal',
    suggestedDepartments: ['dept-nhi'],
    triageNote: 'Triệu chứng hô hấp trẻ em.',
    followUpQuestions: ['Bé bao nhiêu tuổi?', 'Ho bao lâu?', 'Có khò khè/khó thở?'],
  },

  /* ── OB/GYN ── */
  {
    id: 'sym-no-18',
    keywords: ['đau bụng kinh', 'rối loạn kinh nguyệt', 'kinh nguyệt không đều', 'ra máu bất thường'],
    urgency: 'normal',
    suggestedDepartments: ['dept-san'],
    triageNote: 'Triệu chứng phụ khoa cần khám.',
    followUpQuestions: ['Chu kỳ kinh thế nào?', 'Đau mức độ nào?', 'Có dùng thuốc tránh thai?'],
  },
  {
    id: 'sym-no-19',
    keywords: ['mang thai', 'có thai', 'thai kỳ', 'bầu'],
    urgency: 'normal',
    suggestedDepartments: ['dept-san'],
    triageNote: 'Cần khám thai định kỳ.',
    followUpQuestions: ['Thai bao nhiêu tuần?', 'Có triệu chứng bất thường?', 'Đã khám thai lần nào?'],
  },
];

export default symptomMappings;
