import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'sepia' | 'high-contrast';
export type Font = 'sans' | 'serif' | 'outfit';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('hn-theme') as Theme) || 'light';
  });

  const [font, setFont] = useState<Font>(() => {
    return (localStorage.getItem('hn-font') as Font) || 'sans';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hn-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font', font);
    localStorage.setItem('hn-font', font);
  }, [font]);

  return { theme, setTheme, font, setFont };
};
