import { Shell, Btn } from '../components';
import { colors, gradients, shadows } from '../styles/tokens';

export default function SuccessScreen({ doctor, specialty, slot, goHome }) {
  const details = [
    { label: 'Bác sĩ',      value: doctor?.name },
    { label: 'Chuyên khoa',  value: specialty?.name },
    { label: 'Giờ khám',     value: slot?.time },
    { label: 'Ngày',         value: new Date().toLocaleDateString('vi-VN') },
  ];

  return (
    <Shell title="Đặt lịch thành công" subtitle="Hoàn tất">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 0',
        textAlign: 'center',
        animation: 'scaleIn 0.4s ease',
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: gradients.tealSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 50,
          marginBottom: 24,
          boxShadow: `0 0 0 12px ${colors.tealLight}`,
        }}>
          ✅
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 800,
          color: colors.tealDark,
          marginBottom: 8,
        }}>
          Đặt lịch thành công!
        </h2>

        <p style={{ fontSize: 14, color: colors.g600, marginBottom: 28 }}>
          Chi tiết lịch hẹn của bạn:
        </p>

        <div style={{
          background: colors.white,
          borderRadius: 20,
          padding: '24px 28px',
          width: '100%',
          maxWidth: 380,
          boxShadow: shadows.md,
          textAlign: 'left',
        }}>
          {details.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < details.length - 1
                  ? `1px solid ${colors.g100}`
                  : 'none',
              }}
            >
              <span style={{ fontSize: 13, color: colors.g400 }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <Btn
            onClick={goHome}
            style={{ padding: '14px 40px', borderRadius: 16 }}
          >
            Về trang chủ
          </Btn>
        </div>
      </div>
    </Shell>
  );
}
