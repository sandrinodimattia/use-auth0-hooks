import React from 'react';
import { useAuth, useAccessToken } from 'use-auth0-hooks';

export default function About() {
  const auth = useAuth();
  const accessToken = useAccessToken({
    audience: 'urn:books',
    scope: 'read:books'
  });

  return (
    <div>
      <h1>About</h1>
      <p>
        This is the about page.
      </p>
      <h2>Hooks Demo</h2>
      <p>
        On this page we're fetching the authentication information and the access token using <strong>React Hooks</strong>.
      </p>
      <h3>Authentication</h3>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
      <h3>Access Token</h3>
      <pre>{JSON.stringify(accessToken, null, 2)}</pre>
    </div>
  );
}