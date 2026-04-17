import { colors } from '../styles/tokens';

export default function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: colors.tealAccent,
            display: 'inline-block',
            animation: `dots 1.2s infinite ${i * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}
