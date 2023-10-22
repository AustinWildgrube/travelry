import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';

import { GluestackUIProvider } from '&/components/core';
import { AuthContext } from '&/contexts/Authentication';

import { config } from '&/gluestack-ui.config';

import '@testing-library/jest-native/extend-expect';

export const register = jest.fn();
export const loginWithPassword = jest.fn();
export const loginWithOAuth = jest.fn();
export const logout = jest.fn();

const TestProviders = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>
        <GluestackUIProvider config={config.theme}>
          <AuthContext.Provider
            value={{
              register,
              loginWithPassword,
              loginWithOAuth,
              logout,
              isLoading: false,
              user: null,
            }}>
            {children}
          </AuthContext.Provider>
        </GluestackUIProvider>
      </ActionSheetProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui, options = null) => render(ui, { wrapper: TestProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
