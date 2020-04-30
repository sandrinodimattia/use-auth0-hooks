import React, { useEffect, useState, useContext } from 'react';

import Auth0Context from './auth0-context';
import { ensureClient } from '../utils/auth0';
import UserContext, { IUserContext } from './user-context';

export interface UserProviderOptions {
  children: JSX.Element;
}

/**
 * Logic which will take care of cleaning up the state and optionally calling the redirect handler.
 */
function redirectAfterLogin(appState: any, onRedirectCallback?: (appState: any) => void): void {
  if (!window) {
    return;
  }

  if (onRedirectCallback) {
    onRedirectCallback(appState); 
  } else {
      // We want to remove the state and the code from the querystring.
    window.history.replaceState(
      {},
      document && document.title,
      window && window.location.pathname
    );
  }
}

function initialState(): IUserContext {
  return {
    user: null,
    error: null,
    isAuthenticated: false,
    isLoading: false
  };
}

export default function UserProvider({ children }: UserProviderOptions): JSX.Element {
  const { client, handlers } = useContext(Auth0Context);
  const [state, setState] = useState<IUserContext>(initialState);

  useEffect(() => {
    const executeCallback = async (): Promise<void> => {
      setState({
        ...initialState(),
        isLoading: true
      });

      if (client) {
        try {
          // If the user was redirect from Auth0, we need to handle the exchange or throw an error.
          if (window.location.search.includes('state=') || (window.location.search.includes('error=')
            || window.location.search.includes('code='))) {
            const { appState } = await ensureClient(client).handleRedirectCallback();
            redirectAfterLogin(appState, handlers.onRedirectCallback);
          }

          const user = await ensureClient(client).getUser();
          setState({
            ...initialState(),
            user,
            isAuthenticated: !!user
          });
        } catch (err) {
          setState({
            ...initialState(),
            error: err
          });

          // Call a custom error handler if available.
          if (handlers.onLoginError) {
            handlers.onLoginError(err);
          }
        }
      }
    };
    executeCallback();
  }, [client]);

  return (
    <UserContext.Provider value={state}>
      {children}
    </UserContext.Provider>
  );
}
