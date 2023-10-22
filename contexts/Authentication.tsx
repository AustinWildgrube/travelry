import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';

import { type AuthChangeEvent, type Provider, type Session } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';

import { getUserAccount } from '&/queries/user';
import { supabase } from '&/services/supabase';
import { useUserStore } from '&/stores/user';
import { type User } from '&/types/types';

type AuthContextProps = {
  register: (email: string, password: string, username: string, birthday: Date) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: Provider) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  user: User | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextProps>({
  register: async () => {},
  loginWithPassword: async () => {},
  loginWithOAuth: async () => {},
  logout: async () => {},
  isLoading: true,
  user: null,
});

export function useAuth(): AuthContextProps {
  if (!AuthContext) throw new Error('useAuth must be used within an AuthProvider');
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const segments = useSegments();
  const router = useRouter();

  const checkRouteAgainstSession = (session: Session | null): void => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/');
    } else if (session && inAuthGroup && segments[1] !== 'setup') {
      // router.replace('/setup');
      router.replace('/(tabs)/feed');
    }
  };

  const getInitialSession = async (): Promise<void> => {
    const { data: userSession, error } = await supabase.auth.getSession();

    if (error) console.warn(error);

    if (userSession && userSession.session) {
      setUser(await getUserAccount(userSession.session.user.id, userSession.session.user.id));
      checkRouteAgainstSession(userSession.session);
    }
  };

  const register = async (email: string, password: string, username: string, birthdate: Date): Promise<void> => {
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          birthdate: birthdate,
        },
      },
    });

    if (error) {
      if (error.message.includes('duplicate key value violates unique constraint "profiles_username_key"')) {
        Alert.alert('This Username Is Already Taken', 'Please choose a new username and try again.');
      } else if (error.message.includes('User already registered')) {
        Alert.alert('This Email Is Already Taken', 'Perhaps you need to reset your password and try again.');
      }

      setIsLoading(false);
      return;
    }

    router.replace('/setup');
    setIsLoading(false);
  };

  const loginWithPassword = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Oops!', 'It looks like something went wrong with your login attempt. Please verify your username and password and try again.');
    }

    setIsLoading(false);
  };

  const loginWithOAuth = async (provider: Provider): Promise<void> => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });

    if (error) console.warn(error);

    setIsLoading(false);
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();
    if (error) console.warn(error);

    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (session) setUser(await getUserAccount(session.user.id, session.user.id));
      checkRouteAgainstSession(session);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [segments]);

  return (
    <AuthContext.Provider
      value={{
        register,
        loginWithPassword,
        loginWithOAuth,
        logout,
        isLoading,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
