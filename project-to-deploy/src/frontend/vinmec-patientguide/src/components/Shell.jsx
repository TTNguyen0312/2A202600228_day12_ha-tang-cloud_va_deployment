import { colors, gradients } from '../styles/tokens';

/**
 * Full-height responsive shell with teal header, scrollable main area,
 * and optional sticky footer.
 */
export default function Shell({ title, subtitle, onBack, children, footer }) {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: colors.bg,
    }}>
      {/* ── Header ── */}
      <header style={{
        background: gradients.teal,
        color: colors.white,
        padding: '20px clamp(16px, 4vw, 48px) 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexShrink: 0,
      }}>
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Quay lại"
            style={{
              background: 'rgba(255,255,255,0.14)',
              border: 'none',
              color: colors.white,
              width: 38,
              height: 38,
              borderRadius: 12,
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>
        )}
        <div>
          <div style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 700,
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        padding: '0 clamp(12px, 3vw, 32px)',
      }}>
        {children}
      </main>

      {/* ── Footer ── */}
      {footer && (
        <div style={{
          flexShrink: 0,
          background: colors.white,
          borderTop: `1px solid ${colors.g200}`,
          padding: '12px clamp(16px, 4vw, 48px)',
        }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}
