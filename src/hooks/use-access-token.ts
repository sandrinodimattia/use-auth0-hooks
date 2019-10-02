import { useState, useEffect } from 'react';

import useAuth from './use-auth';
import { InternalAuth0Context } from '../models/provider-context';
import { AccessTokenRequestOptions } from '../models/access-token-options';

export interface AccessTokenResult {
  error: Error | null;
  value: string | null;
  audience: string;
  scope: string;
}

export default function useAccessToken(options: AccessTokenRequestOptions): AccessTokenResult {
  const { isAuthenticated, getAccessToken, onAccessTokenError } = useAuth() as InternalAuth0Context;

  const initialState = {
    audience: options.audience,
    scope: options.scope,
    value: null,
    error: null
  };
  const [accessTokenResult, setAccessTokenResult] = useState<AccessTokenResult>({ ...initialState });

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessToken({
            audience: options.audience,
            scope: options.scope
          });
          setAccessTokenResult({
            ...initialState,
            value: accessToken
          });
        } catch (e) {
          if (onAccessTokenError) {
            onAccessTokenError(e, options);
          }

          setAccessTokenResult({
            ...initialState,
            error: e
          });
        }
      } else {
        setAccessTokenResult({
          ...initialState
        });
      }
    };
    fetchData();
  }, [isAuthenticated]);

  return accessTokenResult;
}
