import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const initialState = {
  session: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(
    authReducer,
    initialState
  );

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        dispatch({
          type: 'SET_SESSION',
          payload: null,
        });
      } else {
        dispatch({
          type: 'SET_SESSION',
          payload: data.session,
        });
      }

      dispatch({
        type: 'SET_LOADING',
        payload: false,
      });
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        dispatch({
          type: 'SET_SESSION',
          payload: newSession,
        });
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session: state.session,
        loading: state.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}