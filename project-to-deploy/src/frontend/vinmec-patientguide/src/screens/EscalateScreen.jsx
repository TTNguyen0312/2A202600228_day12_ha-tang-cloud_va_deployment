import { Shell, Btn } from '../components';
import { colors, shadows } from '../styles/tokens';

export default function EscalateScreen({ goHome }) {
  return (
    <Shell title="Chuyển nhân viên hỗ trợ" subtitle="Hỗ trợ trực tiếp">
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
          background: colors.amberLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 50,
          marginBottom: 24,
        }}>
          👩‍💼
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 800,
          color: colors.g800,
          marginBottom: 8,
        }}>
          Đã chuyển tiếp nhân viên
        </h2>

        <p style={{
          fontSize: 14,
          color: colors.g600,
          lineHeight: 1.7,
          maxWidth: 400,
          marginBottom: 28,
        }}>
          Yêu cầu của bạn đã được chuyển đến nhân viên hỗ trợ.
          Bạn sẽ nhận phản hồi trong vòng <strong>5 phút</strong>.
        </p>

        <div style={{
          background: colors.white,
          borderRadius: 16,
          padding: 20,
          width: '100%',
          maxWidth: 320,
          boxShadow: shadows.sm,
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 12, color: colors.g400, marginBottom: 10 }}>
            Hoặc gọi trực tiếp
          </div>
          <a
            href="tel:1900599920"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: colors.tealLight,
              color: colors.tealDark,
              borderRadius: 12,
              padding: 14,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            📞 1900 599 920
          </a>
        </div>

        <Btn variant="ghost" onClick={goHome}>
          ← Về trang chủ
        </Btn>
      </div>
    </Shell>
  );
}
