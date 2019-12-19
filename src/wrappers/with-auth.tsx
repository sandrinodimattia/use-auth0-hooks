import React from 'react';
import useAuth from '../hooks/use-auth';
import { AccessTokenRequestOptions } from '../context/auth0-context';
import withWrapper from '../utils/with-wrapper';

export default function withAuth<TChildProps>(
  ChildComponent: React.ComponentType<TChildProps>,
  options?: AccessTokenRequestOptions
): React.ComponentType<TChildProps> {
  return withWrapper(ChildComponent, 'withAuth', ({ ...props }) => {
    const auth = useAuth(options);

    return (
      <ChildComponent {...props as TChildProps} auth={auth} />
    );
  });
}
