import React from 'react';

import useAuth from '../hooks/use-auth';
import { AccessTokenRequestOptions } from '../context/auth0-context';
import withWrapper, { IComponentProps } from '../utils/with-wrapper';

export default function withAuth(
  ChildComponent: React.ComponentClass<any>,
  options?: AccessTokenRequestOptions
): React.ReactNode {
  return withWrapper<IComponentProps>(ChildComponent, 'withAuth', ({ ...props }) => {
    const auth = useAuth(options);

    return (
      <ChildComponent {...props} auth={auth} />
    );
  });
}
