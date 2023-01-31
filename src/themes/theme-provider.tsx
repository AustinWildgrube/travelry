import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme } from '&/themes/themes';

export type Theme = typeof lightTheme | typeof darkTheme;

interface ThemeProviderValueProps {
  theme: Theme;
  isDarkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

export const ThemeProvider = createContext<ThemeProviderValueProps | undefined>(undefined);

export const ThemeProvider = ({ children }: any): JSX.Element => {
  const colorScheme = useColorScheme();

  const [isDarkMode, setDarkMode] = useState<boolean>(colorScheme === 'dark');

  useEffect(() => {
    setDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return <ThemeProvider.Provider value={{ theme, isDarkMode, setDarkMode }}>{children}</ThemeProvider.Provider>;
};

export const useTheme = (): ThemeProviderValueProps => {
  const context = useContext(ThemeProvider);

  if (context === undefined) {
    throw new Error('Try to use useTheme hook without a context provider');
  }

  return context;
};
