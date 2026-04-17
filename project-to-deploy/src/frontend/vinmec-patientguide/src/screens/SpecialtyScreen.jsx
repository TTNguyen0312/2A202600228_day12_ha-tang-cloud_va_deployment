import { Shell, Btn, Bubble } from '../components';
import { colors, shadows, transition } from '../styles/tokens';
import { SPECIALTIES } from '../data/constants';

export default function SpecialtyScreen({ onSelect, onEscalate, goBack }) {
  return (
    <Shell
      title="Chọn chuyên khoa"
      subtitle="AI gợi ý dựa trên triệu chứng"
      onBack={goBack}
    >
      <div style={{ padding: '20px 0', flex: 1, overflowY: 'auto' }}>
        <Bubble isAI>
          Dựa trên triệu chứng, tôi gợi ý các chuyên khoa sau. Hãy chọn
          chuyên khoa phù hợp nhất với bạn:
        </Bubble>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: 12,
          marginTop: 20,
        }}>
          {SPECIALTIES.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              style={{
                background: colors.white,
                border: `2px solid ${colors.g200}`,
                borderRadius: 18,
                padding: '20px 18px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.teal;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,137,123,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.g200;
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{
                fontSize: 32,
                width: 56,
                height: 56,
                borderRadius: 16,
                background: colors.tealLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {s.icon}
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: colors.g800 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: colors.g400, marginTop: 3 }}>
                  {s.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 20 }}>
          <Btn variant="link" onClick={onEscalate}>
            Không tìm thấy phù hợp? Chuyển sang nhân viên hỗ trợ
          </Btn>
        </div>
      </div>
    </Shell>
  );
}
