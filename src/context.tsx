import { createContext } from 'react';

export interface Auth0Context {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (options: RedirectLoginOptions) => Promise<void>;
  logout: (options: LogoutOptions) => void;
  getAccessToken: (options: GetTokenSilentlyOptions) => Promise<any>;
  onRedirecting?: () => React.Component;
}

export default createContext<Auth0Context>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (_: RedirectLoginOptions) => {
    throw new Error('Auth0Context was not initialized');
  },
  logout: (_: LogoutOptions) => {
    throw new Error('Auth0Context was not initialized');
  },
  getAccessToken: async (_: GetTokenSilentlyOptions) => {
    throw new Error('Auth0Context was not initialized');
  }
});
