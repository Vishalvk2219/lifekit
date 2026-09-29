import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { tokens } from '../theme/tokens';

const ThemeContext = createContext(null);

const initialState = {
  theme: 'light',
  loading: true,
};

function themeReducer(state, action) {
  switch (action.type) {
    case 'LOAD_THEME':
      return {
        theme: action.payload,
        loading: false,
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    default:
      return state;
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(
    themeReducer,
    initialState
  );

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme =
          await AsyncStorage.getItem(
            'lifekit-theme'
          );

        const theme =
          savedTheme === 'dark' ||
          savedTheme === 'light'
            ? savedTheme
            : 'light';

        dispatch({
          type: 'LOAD_THEME',
          payload: theme,
        });
      } catch (error) {
        dispatch({
          type: 'LOAD_THEME',
          payload: 'light',
        });
      }
    }

    loadTheme();
  }, []);

  async function setTheme(newTheme) {
    dispatch({
      type: 'SET_THEME',
      payload: newTheme,
    });

    try {
      await AsyncStorage.setItem(
        'lifekit-theme',
        newTheme
      );
    } catch (error) {
      // The UI still uses the selected theme.
    }
  }

  const colors =
    state.theme === 'dark'
      ? tokens.colors.dark
      : tokens.colors.light;

  // Wait until AsyncStorage has been checked.
  // This prevents the light-theme flash.
  if (state.loading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        colors,
        setTheme,
        loading: state.loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}