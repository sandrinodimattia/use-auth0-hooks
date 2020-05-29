import createClient from '@auth0/auth0-spa-js';
import React, { useEffect, useState } from 'react';

import Auth0Context, {
  Auth0Client,
  LoginOptions,
  LogoutOptions,
  AccessTokenRequestOptions
} from './auth0-context';
import UserProvider from './user-provider';
import { ensureClient } from '../utils/auth0';

export interface Auth0ProviderOptions {
  children: JSX.Element;

  /**
   * Your Auth0 domain.
   */
  domain: string;

  /**
   * The client_id of your Auth0 Single Page Application.
   */
  clientId: string;

  /**
   * Where the user should be redirected after signing in to Auth0 (Allowed Redirect URI).
   */
  redirectUri: string;

  /**
   * This method allows you to render a component while the user is  being redirected to Auth0.
   */
  onRedirecting?: () => JSX.Element;

  /**
   * This method will be called after the user has been signed in, allowing you to redirect them to some page.
   */
  onRedirectCallback?: (appState: any) => void;

  /**
   * Called when the login fails.
   */
  onLoginError?: (error: Error) => void;

  /**
   * Called when we fail to retrieve an access token.
   */
  onAccessTokenError?: (error: Error, options: AccessTokenRequestOptions) => void;

  /**
   * Any other setting you want to send to the Auth0 SPA SDK.
   */
  [key: string]: any;
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
}: Auth0ProviderOptions): JSX.Element {
  const [client, setClient] = useState<Auth0Client>();
  useEffect(() => {
    const initAuth0 = async (): Promise<void> => {
      try {
        setClient(await createClient({
          client_id: clientId,
          redirect_uri: redirectUri,
          ...props
        }));
      } catch (err) {
        if (onLoginError) {
          onLoginError(err);
        }
      }
    };
    initAuth0();
  }, []);

  const value = {
    client,
    login: (opt: LoginOptions): Promise<void> => ensureClient(client).loginWithRedirect(opt),
    logout: (opt: LogoutOptions): void => ensureClient(client).logout(opt),
    getAccessToken: (opt: AccessTokenRequestOptions): Promise<any> => ensureClient(client).getTokenSilently(opt),
    handlers: {
      onRedirecting,
      onRedirectCallback,
      onLoginError,
      onAccessTokenError
    }
  };

  return (
    <Auth0Context.Provider value={value}>
      <UserProvider>
        {children}
      </UserProvider>
    </Auth0Context.Provider>
  );
}
