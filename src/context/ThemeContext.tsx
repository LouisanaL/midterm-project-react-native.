// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

export const lightColors = {
  background: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  primary: '#1A56DB',
  primaryLight: '#EBF0FF',
  primaryDark: '#1040B0',
  secondary: '#64748B',
  accent: '#0EA5E9',
  text: '#0F1729',
  textSecondary: '#374151',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  success: '#059669',
  successLight: '#ECFDF5',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  saved: '#F59E0B',
  savedLight: '#FFFBEB',
  card: '#FFFFFF',
  cardShadow: 'rgba(15, 23, 42, 0.08)',
  inputBackground: '#F8FAFC',
  inputBorder: '#CBD5E1',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  headerBackground: '#FFFFFF',
  shadow: '#0F1729',
  tagBackground: '#EBF5FF',
  tagText: '#1A56DB',
  salaryBackground: '#F0FDF4',
  salaryText: '#059669',
  removeButton: '#FEF2F2',
  removeButtonText: '#DC2626',
  divider: '#F1F5F9',
  overlay: 'rgba(15, 23, 42, 0.5)',
  skeleton: '#E2E8F0',
  onboarding1: '#1A56DB',
  onboarding2: '#0EA5E9',
  onboarding3: '#059669',
};

export const darkColors = {
  background: '#080D1A',
  surface: '#111827',
  surfaceElevated: '#1A2235',
  primary: '#4F83F4',
  primaryLight: '#1A2848',
  primaryDark: '#3B6DE0',
  secondary: '#94A3B8',
  accent: '#38BDF8',
  text: '#F0F4FF',
  textSecondary: '#CBD5E1',
  textMuted: '#4B5A6F',
  border: '#1E2D45',
  borderLight: '#151E2E',
  error: '#F87171',
  errorLight: '#1F0A0A',
  success: '#34D399',
  successLight: '#052E1C',
  warning: '#FBBF24',
  warningLight: '#1C1500',
  saved: '#FCD34D',
  savedLight: '#1C1500',
  card: '#111827',
  cardShadow: 'rgba(0, 0, 0, 0.4)',
  inputBackground: '#0D1524',
  inputBorder: '#1E2D45',
  tabBar: '#0D1524',
  tabBarBorder: '#1E2D45',
  headerBackground: '#111827',
  shadow: '#000000',
  tagBackground: '#152040',
  tagText: '#7EB0FF',
  salaryBackground: '#052E1C',
  salaryText: '#34D399',
  removeButton: '#1F0A0A',
  removeButtonText: '#F87171',
  divider: '#151E2E',
  overlay: 'rgba(0, 0, 0, 0.7)',
  skeleton: '#1A2235',
  onboarding1: '#4F83F4',
  onboarding2: '#38BDF8',
  onboarding3: '#34D399',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);