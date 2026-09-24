'use client';

import React, { useEffect } from 'react';
import { themes, defaultThemeId, getTheme, type ThemeTokens } from '../../lib/theme-tokens';

function cssVarMap(tokens: ThemeTokens): Record<string, string> {
  const c = tokens.colors;
  return {
    '--color-primary': c.primary.DEFAULT,
    '--color-primary-hover': c.primary.hover,
    '--color-primary-light': c.primary.light,
    '--color-primary-contrast': c.primary.contrast,
    '--color-accent': c.accent.DEFAULT,
    '--color-accent-bg': c.accent.bg,
    '--color-info': c.info.DEFAULT,
    '--color-info-bg': c.info.bg,
    '--color-info-text': c.info.text,
    '--color-success': c.success.DEFAULT,
    '--color-success-bg': c.success.bg,
    '--color-success-text': c.success.text,
    '--color-danger': c.danger.DEFAULT,
    '--color-danger-bg': c.danger.bg,
    '--color-danger-text': c.danger.text,
    '--color-purple': c.purple.DEFAULT,
    '--color-purple-bg': c.purple.bg,
    '--color-purple-text': c.purple.text,
    '--color-bg-app': c.background.app,
    '--color-bg-surface': c.background.surface,
    '--color-bg-sidebar': c.background.sidebar,
    '--color-border': c.border,
    '--color-text-primary': c.text.primary,
    '--color-text-secondary': c.text.secondary,
    '--color-text-muted': c.text.muted,
  };
}

/**
 * Wrap the app (e.g. in app/layout.tsx) with this, passing the
 * logged-in tenant/org's theme id. It writes the client's colors
 * onto <html> as CSS variables, so every bg-primary,
 * text-danger, etc. class in the app repaints instantly —
 * no rebuild, no per-client bundle.
 */
export function ClientThemeProvider({
  clientThemeId,
  children,
}: {
  clientThemeId?: string | null;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const tokens = getTheme(clientThemeId);
    const root = document.documentElement;
    Object.entries(cssVarMap(tokens)).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute('data-theme', tokens.id);
  }, [clientThemeId]);

  return <>{children}</>;
}

export { themes, defaultThemeId };
