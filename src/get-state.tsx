import { useState } from 'react';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

export default (): IProviderState => {
  const [user, setUser] = useState();
  const [client, setClient] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  return {
    user,
    setUser,
    client,
    setClient,
    isLoading,
    setLoading,
    isAuthenticated,
    setAuthenticated
  };
};

export interface IProviderState {
  user: object;
  setUser: React.Dispatch<object>;
  client: Auth0Client;
  setClient: React.Dispatch<Auth0Client>;
  isLoading: boolean;
  setLoading: React.Dispatch<boolean>;
  isAuthenticated: boolean;
  setAuthenticated: React.Dispatch<boolean>;
}
