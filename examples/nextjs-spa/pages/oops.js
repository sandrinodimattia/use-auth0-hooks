import React from 'react';
import { useRouter } from 'next/router';

export default function Oops() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <div>
      <h1>Oops</h1>
      <p>
        An error occured when signing in!
      </p>
      <pre>
        {message || 'Unknown Error'}
      </pre>
    </div>
  );
}