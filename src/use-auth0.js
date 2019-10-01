import { useContext } from 'react';

import ctx from './context';

export default function useAuth0() {
  return useContext(ctx);
};