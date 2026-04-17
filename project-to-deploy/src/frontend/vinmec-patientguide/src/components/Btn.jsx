import { colors, gradients, shadows, radii, transition } from '../styles/tokens';

const variants = {
  primary: (disabled) => ({
    background: disabled ? colors.g200 : gradients.teal,
    color: disabled ? colors.g400 : colors.white,
    boxShadow: disabled ? 'none' : shadows.teal,
    padding: '14px 28px',
  }),
  danger: () => ({
    background: colors.coral,
    color: colors.white,
    padding: '14px 28px',
    boxShadow: shadows.coral,
  }),
  ghost: () => ({
    background: 'none',
    border: `2px solid ${colors.g200}`,
    color: colors.g600,
    padding: '12px 24px',
  }),
  link: () => ({
    background: 'none',
    color: colors.g400,
    padding: '8px 0',
    fontSize: 13,
    textDecoration: 'underline',
  }),
};

export default function Btn({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  style: sx,
  ...rest
}) {
  const variantStyle = (variants[variant] || variants.primary)(disabled);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        border: 'none',
        borderRadius: radii.md,
        fontWeight: 700,
        fontSize: 15,
        cursor: disabled ? 'default' : 'pointer',
        transition,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...variantStyle,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
