import { createContext } from 'react';
import * as Auth0ClientTypes from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

export type Auth0Client = Auth0ClientTypes.default;

export interface AccessTokenRequestOptions {
  /**
   * API identifier of your API.
   */
  audience: string;

  /**
   * The scopes you want to request.
   */
  scope: string;
}

export interface LoginOptions {
  /**
   * The URL where Auth0 will redirect your browser to with
   * the authentication result. It must be whitelisted in
   * the "Allowed Callback URLs" field in your Auth0 Application's
   * settings.
   */
  redirect_uri?: string;
  /**
   * Used to store state before doing the redirect
   */
  appState?: any;

  /**
   * - `'page'`: displays the UI with a full page view
   * - `'popup'`: displays the UI with a popup window
   * - `'touch'`: displays the UI in a way that leverages a touch interface
   * - `'wap'`: displays the UI with a "feature phone" type interface
   */
  display?: 'page' | 'popup' | 'touch' | 'wap';
  /**
   * - `'none'`: do not prompt user for login or consent on reauthentication
   * - `'login'`: prompt user for reauthentication
   * - `'consent'`: prompt user for consent before processing request
   * - `'select_account'`: prompt user to select an account
   */
  prompt?: 'none' | 'login' | 'consent' | 'select_account';
  /**
   * Maximum allowable elasped time (in seconds) since authentication.
   * If the last time the user authenticated is greater than this value,
   * the user must be reauthenticated.
   */
  max_age?: string;
  /**
   * The space-separated list of language tags, ordered by preference.
   * For example: `'fr-CA fr en'`.
   */
  ui_locales?: string;
  /**
   * Previously issued ID Token.
   */
  id_token_hint?: string;
  /**
   * The user's email address or other identifier. When your app knows
   * which user is trying to authenticate, you can provide this parameter
   * to pre-fill the email box or select the right session for sign-in.
   */
  login_hint?: string;
  acr_values?: string;
  /**
   * The default scope to be used on authentication requests.
   * `openid profile email` is always added to all requests.
   */
  scope?: string;
  /**
   * The default audience to be used for requesting API access.
   */
  audience?: string;
  /**
   * The name of the connection configured for your application.
   * If null, it will redirect to the Auth0 Login Page and show
   * the Login Widget.
   */
  connection?: string;
  /**
   * If you need to send custom parameters to the Authorization Server,
   * make sure to use the original parameter name.
   */
  [key: string]: any;
}

export interface LogoutOptions {
  /**
   * The URL where Auth0 will redirect your browser to after the logout.
   *
   * > Note that if the `client_id` parameter is included, the
   * `returnTo` URL that is provided must be listed in the
   * Application's "Allowed Logout URLs" in the Auth0 dashboard.
   * However, if the `client_id` parameter is not included, the
   * `returnTo` URL must be listed in the "Allowed Logout URLs" at
   * the account level in the Auth0 dashboard.
   */
  returnTo?: string;
  /**
   * The `client_id` of your application.
   */
  client_id?: string;
  /**
   * When supported by the upstream identity provider,
   * forces the user to logout of their identity provider
   * and from Auth0.
   * [Read more about how federated logout works at Auth0](https://auth0.com/docs/logout/guides/logout-idps)
   */
  federated?: boolean;
}

export interface IAuth0Context {
  /**
   * The current user.
   */
  client?: Auth0Client;

  /**
   * Sign in.
   */
  login: (options: LoginOptions) => Promise<void>;

  /**
   * Sign out.
   */
  logout: (options: LogoutOptions) => void;

  /**
   * Handlers which allow the developer to plug in their own logic.
   */
  handlers: {

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
  };
}

export default createContext<IAuth0Context>({
  client: undefined,
  login: (): Promise<void> => {
    throw new Error('Auth0Client was not initialized');
  },
  logout: () => {
    throw new Error('Auth0Client was not initialized');
  },
  handlers: {

  }
});
