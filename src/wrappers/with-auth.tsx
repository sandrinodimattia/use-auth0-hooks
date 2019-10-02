import React from 'react';

import useAuth from '../hooks/use-auth';
import withWrapper, { IComponentProps } from '../utils/with-wrapper';

export default function withAuth(ChildComponent: React.ComponentClass<any>): React.ReactNode {
  return withWrapper<IComponentProps>(ChildComponent, 'withAuth', ({ ...props }) => {
    const {
      isLoading,
      isAuthenticated,
      login,
      user
    } = useAuth();

    return (
      <ChildComponent {...props} auth={{
        user,
        isAuthenticated,
        isLoading,
        login
      }} />
    );
  });
}
