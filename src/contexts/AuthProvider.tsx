import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { useSupabaseMutation } from '&/hooks/use-supabase';
import { getUserProfile, type UserProfile } from '&/queries/users';
import { supabase } from '&/services/supabase-client';

interface AuthContextProps {
  loading?: boolean;
  currentUser?: UserProfile | null;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logout?: () => void;
  registerWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  updateCurrentUser?: (fields: Partial<Omit<UserProfile, 'id' | 'email'>>) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { execute, error } = useSupabaseMutation();

  const setUserInitialState = async (): Promise<void> => {
    const user = supabase.auth.user();

    if (supabase.auth.session() && user !== null) {
      const profile = await getUserProfile(user.id);
      setCurrentUser(profile);
    } else {
      setCurrentUser(null);
    }

    setLoading(false);
  };

  const updateCurrentUser = async (fields: Partial<Omit<UserProfile, 'id' | 'email'>>): Promise<void> => {
    setCurrentUser(prevUser => (prevUser ? { ...prevUser, ...fields } : null));
  };

  const registerWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    setLoading(true);

    await execute(
      supabase.auth.signUp({
        email,
        password,
      }),
    );
  };

  const loginWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    setLoading(true);

    await execute(
      supabase.auth.signIn({
        email,
        password,
      }),
    );
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await execute(supabase.auth.signOut());
  };

  useEffect(() => {
    if (error) {
      Alert.alert(error.message);
    }

    (async () => {
      await setUserInitialState();
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, currentSession: Session | null) => {
        if (currentSession && currentSession.user) {
          const user = await getUserProfile(currentSession.user.id);
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }

        setLoading(false);
      },
    );

    return () => {
      authListener!.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        updateCurrentUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const useCurrentUser = (): UserProfile => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    throw new Error('useCurrentUser must be used in an authenticated screen');
  }

  return currentUser;
};
