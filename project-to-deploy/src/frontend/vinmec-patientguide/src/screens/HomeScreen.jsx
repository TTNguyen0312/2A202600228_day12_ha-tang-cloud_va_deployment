import { Shell, Btn } from '../components';
import { colors } from '../styles/tokens';

const VALUE_PROPS = [
  { title: 'Miễn phí',      desc: 'Sàng lọc không mất phí' },
  { title: 'AI thông minh',  desc: 'Phân tích chính xác' },
  { title: 'Nhanh chóng',    desc: 'Kết quả trong 2 phút' },
];

export default function HomeScreen({ onStart }) {
  return (
    <Shell title="HealthCare AI" subtitle="Sàng lọc triệu chứng thông minh">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 6vw, 64px) 0',
        textAlign: 'center',
        animation: 'fadeUp 0.5s ease',
      }}>
        <div style={{ fontSize: 'clamp(56px, 12vw, 96px)', marginBottom: 24 }}>
          🩺
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 800,
          color: colors.g800,
          lineHeight: 1.25,
          marginBottom: 12,
        }}>
          Tư vấn triệu chứng
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 1.8vw, 18px)',
          color: colors.g600,
          lineHeight: 1.6,
          maxWidth: 460,
          marginBottom: 36,
        }}>
          Mô tả triệu chứng của bạn — AI sẽ phân tích và gợi ý chuyên khoa
          phù hợp, giúp bạn đặt lịch khám nhanh chóng.
        </p>

        <Btn
          onClick={onStart}
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            padding: '16px 40px',
            borderRadius: 16,
          }}
        >
          Bắt đầu tư vấn →
        </Btn>

        <div style={{
          marginTop: 48,
          display: 'flex',
          gap: 'clamp(24px, 4vw, 48px)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {VALUE_PROPS.map((f, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.teal }}>
                {f.title}
              </div>
              <div style={{ fontSize: 12, color: colors.g400, marginTop: 2 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
