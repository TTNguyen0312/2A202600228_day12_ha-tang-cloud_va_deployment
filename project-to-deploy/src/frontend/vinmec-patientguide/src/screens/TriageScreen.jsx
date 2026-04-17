import { useState, useEffect, useRef } from 'react';
import { Shell, Bubble, TypingDots, BookingWidget } from '../components';
import { colors } from '../styles/tokens';
import { EMERGENCY_KEYWORDS, AI_QUESTIONS } from '../data/constants';
import { sendMessageToAgent } from '../services/agentApi';

const BOOKING_WIDGET_RE = /\{\{BOOKING_WIDGET::([a-z0-9-]+)\}\}/g;

function renderText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span style={{ whiteSpace: 'pre-line' }}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : part
      )}
    </span>
  );
}

function MessageContent({ text, onBooked }) {
  const parts = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(BOOKING_WIDGET_RE.source, 'g');

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`t-${lastIndex}`}>{renderText(text.slice(lastIndex, match.index))}</span>);
    }
    const deptId = match[1];
    parts.push(
      <BookingWidget key={`bw-${deptId}-${match.index}`} departmentId={deptId} onBooked={onBooked} />
    );
    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`t-${lastIndex}`}>{renderText(text.slice(lastIndex))}</span>);
  }

  if (parts.length === 0) {
    return renderText(text);
  }

  return <>{parts}</>;
}

export default function TriageScreen({ onEmergency, onSuggest, onEscalate, goHome }) {
  const [msgs, setMsgs] = useState([
    {
      id: 0,
      ai: true,
      text: 'Xin chào! Tôi là trợ lý AI sàng lọc triệu chứng.\n\nBạn đang gặp triệu chứng gì? Bạn có thể mô tả hoặc gửi ảnh triệu chứng.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState(
    () => new URLSearchParams(window.location.search).get('session_id')
  );
  const [image, setImage] = useState(null); // { preview: dataURL, b64: base64string }
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const addAIMsg = (text) => {
    setMsgs((p) => [...p, { id: Date.now() + 1, ai: true, text }]);
  };

  const addUserMsg = (text, imgPreview = null) => {
    setMsgs((p) => [...p, { id: Date.now(), ai: false, text, image: imgPreview }]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataURL = ev.target.result; // full data URI with correct MIME type
      setImage({ preview: dataURL, b64: dataURL });
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const clearImage = () => setImage(null);

  const send = async () => {
    const txt = input.trim();
    if (!txt && !image) return;
    if (typing) return;

    addUserMsg(txt, image?.preview ?? null);
    setInput('');
    const sentImage = image;
    setImage(null);
    setTyping(true);

    try {
      const data = await sendMessageToAgent({
        message: txt || 'Đây là ảnh triệu chứng của tôi.',
        session_id: sessionId,
        image: sentImage?.b64 ?? null,
      });

      if (data.session_id) {
        setSessionId(data.session_id);
        const params = new URLSearchParams(window.location.search);
        params.set('session_id', data.session_id);
        window.history.replaceState(null, '', `?${params.toString()}`);
      }

      setTyping(false);
      addAIMsg(data.reply || 'Không có phản hồi từ hệ thống.');
    } catch (error) {
      setTyping(false);
      addAIMsg('Xin lỗi, hiện tại chưa thể kết nối tới hệ thống.');
      console.error(error);
    }
  };

  return (
    <Shell
      title="Sàng lọc triệu chứng"
      subtitle="AI Triage"
      onBack={goHome}
      footer={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Image preview strip */}
          {image && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img
                src={image.preview}
                alt="preview"
                style={{ height: 56, width: 56, objectFit: 'cover', borderRadius: 10, border: `2px solid ${colors.teal}` }}
              />
              <button
                onClick={clearImage}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 18,
                  color: colors.g400,
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
                aria-label="Xóa ảnh"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input row */}
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            {/* Camera button */}
            <button
              onClick={() => fileRef.current?.click()}
              aria-label="Gửi ảnh"
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                border: `2px solid ${image ? colors.teal : colors.g200}`,
                flexShrink: 0,
                background: image ? colors.tealLight : colors.white,
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              📷
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Mô tả triệu chứng..."
              style={{
                flex: 1,
                border: `2px solid ${colors.g200}`,
                borderRadius: 14,
                padding: '12px 16px',
                fontSize: 15,
                background: colors.g100,
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = colors.teal)}
              onBlur={(e) => (e.target.style.borderColor = colors.g200)}
            />

            <button
              onClick={send}
              aria-label="Gửi"
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                border: 'none',
                flexShrink: 0,
                background: `linear-gradient(135deg, ${colors.teal}, ${colors.tealDark})`,
                color: colors.white,
                fontSize: 20,
                boxShadow: '0 4px 12px rgba(0,137,123,0.3)',
                cursor: 'pointer',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      }
    >
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
        {msgs.map((m) => (
          <Bubble key={m.id} isAI={m.ai}>
            {m.image && (
              <img
                src={m.image}
                alt="triệu chứng"
                style={{ maxWidth: '100%', borderRadius: 10, marginBottom: m.text ? 8 : 0, display: 'block' }}
              />
            )}
            {m.ai ? (
              <MessageContent text={m.text} onBooked={(apt) => {
                addAIMsg(`✅ Đặt lịch thành công! Mã lịch hẹn: ${apt.id}`);
              }} />
            ) : (
              renderText(m.text)
            )}
          </Bubble>
        ))}
        {typing && (
          <Bubble isAI>
            <TypingDots />
          </Bubble>
        )}
      </div>
    </Shell>
  );
}
