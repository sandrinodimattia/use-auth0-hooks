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
