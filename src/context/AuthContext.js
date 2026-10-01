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
    case 'SESSION_LOADING':
      return {
        ...state,
        loading: true,
      };

    case 'SESSION_READY':
      return {
        session: action.payload,
        loading: false,
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

      if (!mounted) {
        return;
      }

      dispatch({
        type: 'SESSION_READY',
        payload: error
          ? null
          : data.session,
      });
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch({
          type: 'SESSION_READY',
          payload: session,
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