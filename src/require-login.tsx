import { parse } from 'query-string';
import React, { Component, useEffect } from 'react';

import useAuth0 from './use-auth0';

export interface RequireLoginProps {
  children: React.ReactChildren;
  path: string;
  [key: string]: any;
}

interface NextPage {
  getInitialProps?(ctx: any): Promise<any>;
}

function getDisplayName(ChildComponent: React.ComponentClass<any>): string {
  return ChildComponent.displayName || ChildComponent.name || 'Component';
}

function getReturnTo(): any {
  if (window && window.location) {
    return {
      pathname: window.location.pathname,
      query: parse(window.location.search)
    };
  }

  return null;
}

function getInitialPropsMethod(ChildComponent: React.ComponentClass<any>): ((ctx: any) => Promise<any>) | undefined {
  const ChildComponentNext = ChildComponent as NextPage;
  return ChildComponentNext && ChildComponentNext.getInitialProps;
}

export default function WithLoginRequired(ChildComponent: React.ComponentClass<any>): React.ReactNode {
  const WrappedComponent = ({ path, ...rest }: RequireLoginProps): React.ReactNode => {
    const {
      isLoading, isAuthenticated, login, onRedirecting
    } = useAuth0();

    useEffect(() => {
      if (isLoading || isAuthenticated) {
        return;
      }

      login({
        appState: {
          returnTo: getReturnTo()
        }
      });
    }, [isLoading, isAuthenticated, login, path]);

    return isAuthenticated === true ? (<ChildComponent {...rest} />) : ((onRedirecting && onRedirecting()) || null);
  };

  // Add a displayname to the component.
  (WrappedComponent as React.FunctionComponent).displayName = `WithLoginRequired(${getDisplayName(
    Component
  )})`;

  // Helper for Next.js support (getInitialProps)
  const getInitialProps = getInitialPropsMethod(ChildComponent);
  if (getInitialProps) {
    const WrappedComponentNext = WrappedComponent as NextPage;
    WrappedComponentNext.getInitialProps = async (args: any): Promise<any> => getInitialProps(args);
  }

  return WrappedComponent;
}
