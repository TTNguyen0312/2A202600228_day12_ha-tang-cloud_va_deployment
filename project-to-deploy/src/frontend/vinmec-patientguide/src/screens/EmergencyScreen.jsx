import { Shell, Btn } from '../components';
import { colors } from '../styles/tokens';

export default function EmergencyScreen({ goHome }) {
  return (
    <Shell title="Cảnh báo cấp cứu" subtitle="Khẩn cấp">
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
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: colors.coralLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 52,
          marginBottom: 28,
          animation: 'pulse 2s infinite',
        }}>
          🚨
        </div>

        <h2 style={{
          fontSize: 'clamp(22px, 3.5vw, 32px)',
          fontWeight: 800,
          color: colors.coral,
          marginBottom: 12,
        }}>
          CẢNH BÁO CẤP CỨU
        </h2>

        <p style={{
          fontSize: 15,
          color: colors.g600,
          lineHeight: 1.7,
          maxWidth: 400,
          marginBottom: 32,
        }}>
          Triệu chứng của bạn có dấu hiệu <strong>cần cấp cứu</strong>.
          <br />
          Vui lòng đến khoa Cấp cứu gần nhất hoặc gọi{' '}
          <strong>115</strong> ngay lập tức.
        </p>

        <Btn
          variant="danger"
          onClick={() => window.open('tel:115')}
          style={{ fontSize: 17, padding: '16px 36px', borderRadius: 16 }}
        >
          📞 Gọi 115 ngay
        </Btn>

        <div style={{ marginTop: 20 }}>
          <Btn variant="ghost" onClick={goHome}>
            ← Quay lại
          </Btn>
        </div>
      </div>
    </Shell>
  );
}
