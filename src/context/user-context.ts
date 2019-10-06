import { createContext } from 'react';

export interface IUserContext {
  /**
   * The current user.
   */
  user: any;

  /**
   * If the sign in failed, this will contain the error.
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
}

export default createContext<IUserContext>({
  user: null,
  error: null,
  isLoading: false,
  isAuthenticated: false
});
