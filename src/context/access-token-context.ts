export interface ITokenContext {
  /**
   * The current token.
   */
  token?: ITokenResponse | null;

  /**
   * If retrieving an token failed, this will contain the error.
   */
  error: Error | null;

  /**
   * Is the transaction still ongoing.
   */
  isLoading: boolean;
}

export interface ITokenResponse {
  /**
   * The current access token.
   */
  accessToken?: string | null;

  /**
   * The current id token.
   */
  idToken?: string | null;

  /**
   * The current expires in.
   */
  expiresIn?: string | null;
}
