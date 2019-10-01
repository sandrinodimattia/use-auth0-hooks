import { useContext } from 'react';

import ctx, { Auth0Context } from './context';

export default function useAuth0(): Auth0Context {
  return useContext(ctx);
}
