import { parse } from 'query-string';
import React, { useEffect, useContext, ReactElement } from 'react';

import useAuth from '../hooks/use-auth';
import Auth0Context from '../context/auth0-context';
import { ReturnToAppState } from '../models/return-to';
import withWrapper from '../utils/with-wrapper';

export interface RequireLoginProps {
  path?: string;
}

function getReturnTo(): ReturnToAppState {
  if (window && window.location) {
    return {
      returnTo: {
        pathname: window.location.pathname,
        query: parse(window.location.search)
      }
    };
  }

  return {};
}

export default function withLoginRequired<T extends {}>(
  ChildComponent: React.ComponentType<T>
): React.ComponentType<RequireLoginProps & T> {
  return withWrapper<RequireLoginProps, T>(
    ChildComponent,
    'withLoginRequired',
    ({ path, ...rest }): ReactElement<any> | null => {
      const { isLoading, isAuthenticated, login } = useAuth();
      const context = useContext(Auth0Context);

      useEffect(() => {
        if (!context.client || isLoading || isAuthenticated) {
          return;
        }

        login({ appState: getReturnTo() });
      }, [context.client, isLoading, isAuthenticated, login, path]);

      if (isAuthenticated) {
        // cast to T needed https://github.com/Microsoft/TypeScript/issues/28938
        return <ChildComponent {...(rest as T)} />;
      }

      return (
        (context.handlers.onRedirecting && context.handlers.onRedirecting())
        || null
      );
    }
  );
}
