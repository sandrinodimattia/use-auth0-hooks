import { useContext } from 'react';

import ctx from '../context';
import { Auth0Context } from '../models/provider-context';

export default function useAuth(): Auth0Context {
  return useContext(ctx);
}
