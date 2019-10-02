import { parse } from 'query-string';
import React, { useEffect } from 'react';

import useAuth from '../hooks/use-auth';
import { ReturnToAppState } from '../models/return-to';
import { InternalAuth0Context } from '../models/provider-context';
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
      isLoading, isAuthenticated, login, onRedirecting
    } = useAuth() as InternalAuth0Context;

    useEffect(() => {
      if (isLoading || isAuthenticated) {
        return;
      }

      login({ appState: getReturnTo() });
    }, [isLoading, isAuthenticated, login, path]);

    return isAuthenticated === true ? (<ChildComponent {...rest} />) : ((onRedirecting && onRedirecting()) || null);
  });
}
