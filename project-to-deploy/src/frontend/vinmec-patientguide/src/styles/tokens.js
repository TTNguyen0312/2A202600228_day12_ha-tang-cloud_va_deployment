/* ─── Colors ─── */
export const colors = {
  teal:       '#00897B',
  tealDark:   '#00695C',
  tealDeep:   '#004D40',
  tealLight:  '#E0F2F1',
  tealAccent: '#4DB6AC',

  coral:      '#E53935',
  coralLight: '#FFEBEE',

  amber:      '#FF8F00',
  amberLight: '#FFF3E0',

  bg:         '#F6F8F7',
  white:      '#FFFFFF',

  g100: '#F0F4F3',
  g200: '#E0E5E3',
  g300: '#C5CCC9',
  g400: '#9CA8A5',
  g600: '#5F6B68',
  g800: '#2D3532',
};

/* ─── Gradients ─── */
export const gradients = {
  teal:  `linear-gradient(135deg, ${colors.teal}, ${colors.tealDark})`,
  tealSoft: `linear-gradient(135deg, ${colors.tealLight}, ${colors.tealAccent}33)`,
};

/* ─── Shadows ─── */
export const shadows = {
  sm: '0 1px 4px rgba(0,0,0,0.06)',
  md: '0 4px 16px rgba(0,0,0,0.08)',
  lg: '0 8px 32px rgba(0,0,0,0.1)',
  teal: '0 4px 14px rgba(0,137,123,0.3)',
  tealSm: '0 4px 12px rgba(0,137,123,0.15)',
  coral: '0 4px 14px rgba(229,57,53,0.3)',
};

/* ─── Radii ─── */
export const radii = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 20,
  full: '50%',
};

/* ─── Transitions ─── */
export const transition = 'all 0.2s ease';
