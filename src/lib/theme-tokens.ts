export const crmTheme = {
  meta: {
    name: "Warm Industrial CRM",
    source: "Visual estimate from supplied compressed dashboard screenshot",
  },
  colors: {
    brand: {
      50: "#F8F0E8",
      100: "#F0DFCE",
      200: "#DEC0A1",
      300: "#C99C70",
      400: "#B67F48",
      500: "#A96B34",
      600: "#8F5228",
      700: "#75401F",
      800: "#5F3218",
      900: "#442313",
    },
    neutral: {
      0: "#FFFFFF",
      50: "#FBF8F3",
      100: "#F5EFE7",
      200: "#E7DED5",
      300: "#D5CAC0",
      500: "#8D827A",
      600: "#70665F",
      700: "#544B45",
      800: "#39312C",
      900: "#211B17",
    },
    status: {
      info: "#0E91B2",
      infoSoft: "#DDF5FA",
      success: "#169B62",
      successSoft: "#DFF6EA",
      warning: "#D68A22",
      warningSoft: "#FFF0D8",
      danger: "#D94C64",
      dangerSoft: "#FDE5EA",
      inspection: "#A43D8F",
      inspectionSoft: "#F6E2F2",
    },
  },
  semantic: {
    background: { app: "#FBF8F3", sidebar: "#FFFDFC", elevated: "#FFFFFF" },
    surface: { card: "#FFFFFF", subtle: "#F5EFE7", hero: "#F3E7DA" },
    text: { primary: "#211B17", secondary: "#70665F", tertiary: "#8D827A", inverse: "#FFFFFF" },
    border: { default: "#E7DED5", strong: "#D5CAC0", focus: "#A96B34" },
    action: { primary: "#75401F", primaryHover: "#5F3218", primaryText: "#FFFFFF" },
  },
  typography: {
    fontFamily: {
      sans: '"Manrope", "Inter", "Segoe UI", sans-serif',
    },
    fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    styles: {
      display: { fontSize: 30, lineHeight: 36, fontWeight: 800 },
      pageTitle: { fontSize: 24, lineHeight: 30, fontWeight: 800 },
      sectionTitle: { fontSize: 16, lineHeight: 22, fontWeight: 700 },
      cardValue: { fontSize: 18, lineHeight: 24, fontWeight: 800 },
      body: { fontSize: 13, lineHeight: 20, fontWeight: 400 },
      label: { fontSize: 12, lineHeight: 16, fontWeight: 600 },
      caption: { fontSize: 10, lineHeight: 14, fontWeight: 500 },
    },
  },
  spacing: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 },
  radii: { sm: 6, md: 8, lg: 12, xl: 16, pill: 999 },
  shadows: {
    subtle: "0 1px 2px rgba(33, 27, 23, 0.05)",
    card: "0 4px 16px rgba(77, 50, 32, 0.07)",
  },
  components: {
    sidebar: { width: 256, collapsedWidth: 80, activeBg: "#75401F", activeText: "#FFFFFF" },
    topbar: { height: 64 },
    card: { padding: 16, radius: 12, border: "#E7DED5", background: "#FFFFFF" },
    button: { height: 36, radius: 8 },
    input: { height: 36, radius: 8 },
    table: { headerHeight: 36, rowHeight: 52 },
  },
} as const;

export type CrmTheme = typeof crmTheme;

// Theme Tokens for backward compatibility
export const umaTechnoFab = {
  id: 'umaTechnoFab',
  name: 'Uma Techno Fab Manufacturing',
  colors: {
    primary: {
      DEFAULT: crmTheme.semantic.action.primary,
      hover: crmTheme.semantic.action.primaryHover,
      light: crmTheme.colors.brand[100],
      contrast: crmTheme.semantic.text.inverse,
    },
    accent: {
      DEFAULT: crmTheme.colors.brand[500],
      bg: crmTheme.colors.brand[50],
    },
    info: {
      DEFAULT: crmTheme.colors.status.info,
      bg: crmTheme.colors.status.infoSoft,
      text: crmTheme.colors.status.info,
    },
    success: {
      DEFAULT: crmTheme.colors.status.success,
      bg: crmTheme.colors.status.successSoft,
      text: crmTheme.colors.status.success,
    },
    danger: {
      DEFAULT: crmTheme.colors.status.danger,
      bg: crmTheme.colors.status.dangerSoft,
      text: crmTheme.colors.status.danger,
    },
    purple: {
      DEFAULT: crmTheme.colors.status.inspection,
      bg: crmTheme.colors.status.inspectionSoft,
      text: crmTheme.colors.status.inspection,
    },
    background: {
      app: crmTheme.semantic.background.app,
      surface: crmTheme.semantic.surface.card,
      sidebar: crmTheme.semantic.background.sidebar,
    },
    border: crmTheme.semantic.border.default,
    text: {
      primary: crmTheme.semantic.text.primary,
      secondary: crmTheme.semantic.text.secondary,
      muted: crmTheme.semantic.text.tertiary,
      inverse: crmTheme.semantic.text.inverse,
    },
  },
};

export type ThemeTokens = typeof umaTechnoFab;

export const themes = {
  umaTechnoFab,
};

export const defaultThemeId = 'umaTechnoFab';

export function getTheme(themeId?: string | null) {
  return umaTechnoFab;
}
