import { useContext, useEffect, useState } from 'react';

import UserContext from '../context/user-context';
import { IAccessTokenContext } from '../context/access-token-context';
import { getAccessTokenFromCache, ensureClient } from '../utils/auth0';
import Auth0Context, { LoginOptions, AccessTokenRequestOptions } from '../context/auth0-context';

export interface UseAuthResult {
  /**
   * The current user.
   */
  user: any;

  /**
   * The access token.
   */
  accessToken?: string | null;

  /**
   * If the transaction failed, this will contain the error.
   */
  error: Error | null;

  /**
   * Is the transaction still ongoing.
   */
  isLoading: boolean;

  /**
   * Is the user authenticated.
   */
  isAuthenticated: boolean;

  /**
   * Sign in.
   */
  login: (options: LoginOptions) => Promise<void>;

  /**
   * Sign out.
   */
  logout: (options: LogoutOptions) => void;
}

function initialState(): IAccessTokenContext {
  return {
    accessToken: null,
    error: null,
    isLoading: false
  };
}

export default function useAuth(accessTokenRequest?: AccessTokenRequestOptions): UseAuthResult {
  const {
    isAuthenticated,
    isLoading,
    error,
    user
  } = useContext(UserContext);
  const {
    client,
    login,
    logout,
    handlers
  } = useContext(Auth0Context);

  // If no access token is needed we can just stop here.
  if (!accessTokenRequest) {
    return {
      user,
      error,
      isAuthenticated,
      isLoading,
      login,
      logout
    };
  }

  // The following will holde the additional state for this hook.
  // We'll try to fetch the access token from the cache first if available.
  const [state, setState] = useState<IAccessTokenContext>((): IAccessTokenContext => ({
    ...initialState(),
    accessToken: client && getAccessTokenFromCache(client, accessTokenRequest.audience, accessTokenRequest.scope),
    isLoading: !!accessTokenRequest
  }));

  useEffect(() => {
    // We are not ready to fetch an access_token yet.
    if (!client || isLoading || !isAuthenticated) {
      return;
    }

    // Access token is already available in this instance, no need to re-fetch it.
    if (state.accessToken) {
      return;
    }

    // Try to fetch the access token from the cache in a synchronous way.
    const cachedAccessToken = getAccessTokenFromCache(client, accessTokenRequest.audience, accessTokenRequest.scope);
    if (cachedAccessToken) {
      setState({
        ...initialState(),
        accessToken: cachedAccessToken
      });
      return;
    }

    // We were not able to get the access token from cache, so now we'll just start a transaction
    const getToken = async (): Promise<void> => {
      try {
        setState({
          ...initialState(),
          isLoading: true
        });

        // We will fetch the token in a silent way.
        setState({
          ...initialState(),
          accessToken: await ensureClient(client).getTokenSilently({
            audience: accessTokenRequest.audience,
            scope: accessTokenRequest.scope
          })
        });
      } catch (e) {
        // An error occured.
        if (handlers.onAccessTokenError) {
          handlers.onAccessTokenError(e, accessTokenRequest);
        }

        setState({
          ...initialState(),
          error: e
        });
      }
    };
    getToken();
  }, [isAuthenticated, isLoading]);

  return {
    user,
    error: error || state.error,
    isAuthenticated,
    isLoading: isLoading || state.isLoading,
    accessToken: state.accessToken,
    login,
    logout
  };
}
