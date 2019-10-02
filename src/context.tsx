import { createContext } from 'react';

import { Auth0Context } from './models/provider-context';

export default createContext<Auth0Context>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {
    throw new Error('Auth0Context was not initialized');
  },
  logout: () => {
    throw new Error('Auth0Context was not initialized');
  }
});
