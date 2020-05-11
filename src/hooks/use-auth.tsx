import { useContext, useEffect, useState } from 'react';

import UserContext from '../context/user-context';
import { ITokenContext, ITokenResponse } from '../context/access-token-context';
import { getTokenFromCache, ensureClient } from '../utils/auth0';
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
   * The token.
   */
  token?: ITokenResponse | null;

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

function initialState(): ITokenContext {
  return {
    token: null,
    error: null,
    isLoading: false
  };
}

export default function useAuth(tokenRequest?: AccessTokenRequestOptions): UseAuthResult {
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

  // If no token is needed we can just stop here.
  if (!tokenRequest) {
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
  // We'll try to fetch the token from the cache first if available.
  const [state, setState] = useState<ITokenContext>((): ITokenContext => ({
      ...initialState(),
      token: client && getTokenFromCache(client, tokenRequest.audience, tokenRequest.scope),
      isLoading: !!tokenRequest
    })
  );

  useEffect(() => {
    // We are not ready to fetch a token yet.
    if (!client || isLoading || !isAuthenticated) {
      return;
    }

    // Token is already available in this instance, no need to re-fetch it.
    if (state.token) {
      return;
    }

    // Try to fetch the token from the cache in a synchronous way.
    const cachedToken = getTokenFromCache(client, tokenRequest.audience, tokenRequest.scope);
    if (cachedToken) {
      setState({
        ...initialState(),
        token: cachedToken
      });
      return;
    }

    // We were not able to get the token from cache, so now we'll just start a transaction
    const getToken = async (): Promise<void> => {
      try {
        setState({
          ...initialState(),
          isLoading: true
        });

        // We will fetch the token in a silent way.
        setState({
          ...initialState(),
          token: await ensureClient(client).getTokenSilently({
            audience: tokenRequest.audience,
            scope: tokenRequest.scope
          })
        });
      } catch (e) {
        // An error occured.
        if (handlers.onAccessTokenError) {
          handlers.onAccessTokenError(e, tokenRequest);
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
    token: state.token,
    accessToken: state.token && state.token.accessToken,
    login,
    logout
  };
}
