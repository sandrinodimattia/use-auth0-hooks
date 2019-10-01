import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import useAuth0 from './use-auth0';

export default function requireLogin(ChildComponent) {
  return ({ children, path, ...rest }) => {
    const { pathname, query } = useRouter();
    const { isLoading, isAuthenticated, login, onRedirecting } = useAuth0();
  
    useEffect(() => {
      if (isLoading || isAuthenticated) {
        return;
      }
  
      login({
        appState: {
          returnTo: { pathname, query }
        }
      });
    }, [isLoading, isAuthenticated, login, path]);
  
    return isAuthenticated === true ? <ChildComponent {...rest} /> : ((onRedirecting && onRedirecting()) || null);
  };
}