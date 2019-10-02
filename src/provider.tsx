import React, { useEffect, useState } from 'react';
import createClient from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

import Auth0Context from './context';
import { LoginOptions } from './models/login-options';
import { Auth0ProviderOptions } from './models/provider-options';
import { AccessTokenRequestOptions } from './models/access-token-options';

/**
 * Logic which will take care of cleaning up the state and optionally calling the redirect handler.
 */
const redirectAfterLogin = (appState: any, onRedirectCallback?: (appState: any) => void): void => {
  if (!window) {
    return;
  }

  // We want to remove the state and the code from the querystring.
  window.history.replaceState(
    {},
    document && document.title,
    window && window.location.pathname
  );

  // Allow the implementation of custom redirect logic.
  if (onRedirectCallback) {
    onRedirectCallback(appState);
  }
};


export interface ProviderState {
  error: Error | null;
  user: object | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export default function Auth0Provider({
  children,
  clientId,
  redirectUri,
  onRedirecting,
  onRedirectCallback,
  onLoginError,
  onAccessTokenError,
  ...props
}: Auth0ProviderOptions): React.ReactNode {
  const options = {
    client_id: clientId,
    redirect_uri: redirectUri,
    ...props
  };

  const initialState = {
    user: null,
    error: null,
    isAuthenticated: false,
    isLoading: true
  };

  const [client, setClient] = useState<Auth0Client>();
  const [state, setState] = useState<ProviderState>(initialState);

  useEffect(() => {
    const initAuth0 = async (): Promise<void> => {
      try {
        // Get the client.
        const initializedClient = await createClient(options);
        setClient(initializedClient);

        // If the user was redirect from Auth0, we need to handle the exchange or throw an error.
        if (window.location.search.includes('state=') || (window.location.search.includes('error=')
          || window.location.search.includes('code='))) {
          const { appState } = await initializedClient.handleRedirectCallback();
          redirectAfterLogin(appState, onRedirectCallback);
        }

        // Authentication success.
        const user = await initializedClient.getUser();
        setState({
          ...initialState,
          user,
          isLoading: false,
          isAuthenticated: !!user
        });
      } catch (err) {
        setState({
          ...initialState,
          isLoading: false,
          error: err
        });

        // Call a custom error handler if available.
        if (onLoginError) {
          onLoginError(err);
        }
      }
    };
    initAuth0();
  }, []);

  // These values will be available in the context.
  const contextValues = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: (opt: LoginOptions): Promise<void> => {
      if (!client) {
        throw new Error('Auth0Client was not initialized');
      }

      return client.loginWithRedirect(opt);
    },
    logout: (opt: LogoutOptions): void => {
      if (!client) {
        throw new Error('Auth0Client was not initialized');
      }

      client.logout(opt);
    },
    getAccessToken: (opt: AccessTokenRequestOptions): Promise<any> => {
      if (!client) {
        throw new Error('Auth0Client was not initialized');
      }

      return client.getTokenSilently(opt);
    },
    onRedirecting,
    onAccessTokenError
  };

  return (
    <Auth0Context.Provider value={contextValues}>
      {children}
    </Auth0Context.Provider>
  );
}
