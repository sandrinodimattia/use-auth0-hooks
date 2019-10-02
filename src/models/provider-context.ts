import { LoginOptions } from './login-options';
import { LogoutOptions } from './logout-options';
import { AccessTokenRequestOptions } from './access-token-options';

export interface Auth0Context {
  /**
   * The current user.
   */
  user: any;

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

export interface InternalAuth0Context extends Auth0Context {
  /**
   * Get an access token.
   */
  getAccessToken: (options: AccessTokenRequestOptions) => Promise<any>;

  /**
   * This method allows you to render a component while the user is  being redirected to Auth0.
   */
  onRedirecting?: () => React.Component;

  /**
  * Called when we fail to retrieve an access token.
  */
  onAccessTokenError?: (error: Error, options: AccessTokenRequestOptions) => void;
}
