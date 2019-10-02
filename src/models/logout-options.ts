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