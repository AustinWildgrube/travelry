import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';

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
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { execute } = useSupabaseMutation();

  const setUserInitialState = async (): Promise<void> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { user } = session;
      setCurrentUser(await getUserProfile(user.id));
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
      supabase.auth.signInWithPassword({
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
    (async () => {
      await setUserInitialState();
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, currentSession: Session | null) => {
        if (currentSession && currentSession.user) {
          setCurrentUser(await getUserProfile(currentSession.user.id));
        } else {
          setCurrentUser(null);
          router.replace('/sign-in');
        }

        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
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
