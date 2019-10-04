import React from 'react';
import { useAuth, useAccessToken } from 'use-auth0-hooks';

export default (url, options) => {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { isLoading: isAuthLoading, isAuthenticated  } = useAuth();
  const accessToken = useAccessToken({
    audience: options.audience,
    scope: options.scope
  });

  React.useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setError(new Error('Not authenticated'));
      return;
    }

    if (accessToken.error) {
      setError(new Error('Unable to retrieve access token'));
      return;
    }

    if (!accessToken.value) {
      return;
    }
  
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${accessToken.value}`
          }
        });
        const json = await res.json();
        setResponse(json);
        setIsLoading(false)
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [accessToken]);
  return { response, error, isLoading };
};