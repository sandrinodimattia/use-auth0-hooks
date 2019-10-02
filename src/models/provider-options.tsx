import { AccessTokenRequestOptions } from './access-token-options';

export interface Auth0ProviderOptions {
  children: React.ReactChildren;

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
  onRedirecting?: () => React.Component;

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
