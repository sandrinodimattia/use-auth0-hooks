import { useState } from 'react';

export default () => {
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
  }
};