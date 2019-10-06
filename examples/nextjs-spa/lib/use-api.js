import React, { useEffect, useState } from 'react';
import { useAuth } from 'use-auth0-hooks';

function initialState(args) {
  return {
    response: null,
    error: null,
    isLoading: false,
    ...args
  };
}

export default (url, options) => {
  const { isLoading, error, accessToken, user } = useAuth({
    audience: options.audience,
    scope: options.scope
  });

  const [state, setState] = useState(() => initialState({
    isLoading
  }));


  useEffect(() => {
    if (error) {
      setState({
        error: new Error('Unable to retrieve access token')
      });
      return;
    }

    if (!user) {
      setState(initialState({
        error: new Error('The user is not signed in')
      }));
      return;
    }

    if (!accessToken) {
      setState(initialState({
        error: new Error('The user is not signed in')
      }));
      return;
    }
  
    const fetchData = async () => {
      try {
        setState(initialState({
          isLoading: true
        }));

        const res = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        setState(initialState({
          response: await res.json(),
          isLoading: false
        }));
      } catch (error) {
        setState(initialState({
          error
        }));
      }
    };
    fetchData();
  }, [user, accessToken, error, isLoading]);
  return state;
};