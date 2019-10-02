import React from 'react';

import withWrapper, { IComponentProps } from '../utils/with-wrapper';
import { AccessTokenRequestOptions } from '../models/access-token-options';
import useAccessToken, { AccessTokenResult } from '../hooks/use-access-token';

export interface ChildComponentProps {
  accessToken: AccessTokenResult;
}

export default function withAccessToken(ChildComponent: React.ComponentClass<ChildComponentProps>,
  options: AccessTokenRequestOptions): React.ReactNode {
  return withWrapper<IComponentProps>(ChildComponent, 'withAccessToken', ({ ...props }) => {
    const accessTokenResult = useAccessToken(options);

    return (
      <ChildComponent {...props} accessToken={accessTokenResult} />
    );
  });
}
