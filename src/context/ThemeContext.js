import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const lightTheme = {
  background: '#F5F7FB',
  card: '#FFFFFF',
  text: '#222222',
  secondaryText: '#777777',
  border: '#DDDDDD',
  button: '#222222',
  buttonText: '#FFFFFF',
};

const darkTheme = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  secondaryText: '#AAAAAA',
  border: '#333333',
  button: '#000000',
  buttonText: '#FFFFFF',
};

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');

      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.log('Theme load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeTheme = async (mode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('theme', mode);
    } catch (error) {
      console.log('Theme save error:', error);
    }
  };

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        changeTheme,
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