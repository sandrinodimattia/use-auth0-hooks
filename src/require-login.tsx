import { parse } from 'query-string';
import React, { useEffect } from 'react';

import useAuth0 from './use-auth0';

export interface RequireLoginProps {
  children: React.ReactChildren;
  path: string;
  [key: string]: any;
}

export default function requireLogin(ChildComponent: React.ElementType) {
  return ({ children, path, ...rest }: RequireLoginProps) => {
    const {
      isLoading, isAuthenticated, login, onRedirecting
    } = useAuth0();

    useEffect(() => {
      if (isLoading || isAuthenticated) {
        return;
      }

      login({
        appState: {
          returnTo: { pathname: window.location.pathname, query: parse(window.location.search) }
        }
      });
    }, [isLoading, isAuthenticated, login, path]);

    return isAuthenticated === true ? (<ChildComponent {...rest} />) : ((onRedirecting && onRedirecting()) || null);
  };
}
