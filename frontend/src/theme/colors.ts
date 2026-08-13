// Central colour palette — mirrors the web app's Bootstrap / custom colours
const Colors = {
  primary:       '#2563EB',
  primaryDark:   '#1E40AF',
  primaryLight:  '#EFF6FF',
  secondary:     '#64748B',
  success:       '#16A34A',
  successLight:  '#DCFCE7',
  danger:        '#DC2626',
  dangerLight:   '#FEE2E2',
  warning:       '#D97706',
  warningLight:  '#FEF3C7',
  purple:        '#7C3AED',
  purpleLight:   '#EDE9FE',
  orange:        '#EA580C',
  orangeLight:   '#FED7AA',
  background:    '#F5F7FB',
  white:         '#FFFFFF',
  card:          '#FFFFFF',
  border:        '#E2E8F0',
  textPrimary:   '#1E293B',
  textSecondary: '#64748B',
  textMuted:     '#94A3B8',
  sidebarBg:     '#1E3A8A',
  sidebarActive: '#2563EB',
  navbarBg:      '#FFFFFF',
} as const;

export type ColorKey = keyof typeof Colors;
export default Colors;
