import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokens } from '../theme/tokens';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('lifekit-theme');

        if (savedTheme === 'dark' || savedTheme === 'light') {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.log('Theme load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const changeTheme = async (newTheme) => {
    setThemeState(newTheme);

    try {
      await AsyncStorage.setItem('lifekit-theme', newTheme);
    } catch (error) {
      console.log('Theme save error:', error);
    }
  };

  const colors =
    theme === 'dark'
      ? tokens.colors.dark
      : tokens.colors.light;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        setTheme: changeTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}