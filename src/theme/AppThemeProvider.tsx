import { PropsWithChildren, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { darkTheme, lightTheme } from './theme';

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();

  const theme = useMemo(
    () => (colorScheme === 'dark' ? darkTheme : lightTheme),
    [colorScheme]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
