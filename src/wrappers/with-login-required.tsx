import { parse } from 'query-string';
import React, { useEffect, useContext } from 'react';

import useAuth from '../hooks/use-auth';
import Auth0Context from '../context/auth0-context';
import { ReturnToAppState } from '../models/return-to';
import withWrapper, { IComponentProps } from '../utils/with-wrapper';

export interface RequireLoginProps extends IComponentProps {
  path: string;
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

  return { };
}

export default function withLoginRequired(ChildComponent: React.ComponentClass<any>): React.ReactNode {
  return withWrapper<RequireLoginProps>(ChildComponent, 'withLoginRequired', ({ path, ...rest }) => {
    const {
      isLoading, isAuthenticated, login
    } = useAuth();
    const context = useContext(Auth0Context);

    useEffect(() => {
      if (!context.client || isLoading || isAuthenticated) {
        return;
      }

      login({ appState: getReturnTo() });
    }, [context.client, isLoading, isAuthenticated, login, path]);

    return isAuthenticated === true
      ? (<ChildComponent {...rest} />) : ((context.handlers.onRedirecting && context.handlers.onRedirecting()) || null);
  });
}
