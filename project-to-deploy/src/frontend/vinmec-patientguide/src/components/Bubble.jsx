import { colors, gradients, shadows } from '../styles/tokens';

export default function Bubble({ isAI, children }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      marginBottom: 12,
      animation: 'fadeUp 0.3s ease',
    }}>
      {isAI && (
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          flexShrink: 0,
          marginRight: 10,
          background: gradients.teal,
          color: colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}>
          AI
        </div>
      )}
      <div style={{
        maxWidth: isAI ? '85%' : '70%',
        padding: '12px 16px',
        fontSize: 14,
        lineHeight: 1.65,
        borderRadius: 18,
        borderBottomLeftRadius: isAI ? 4 : 18,
        borderBottomRightRadius: isAI ? 18 : 4,
        background: isAI ? colors.white : gradients.teal,
        color: isAI ? colors.g800 : colors.white,
        boxShadow: shadows.sm,
      }}>
        {children}
      </div>
    </div>
  );
}
