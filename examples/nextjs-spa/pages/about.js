import React from 'react';

import useApi from '../lib/use-api';
import { useAuth } from 'use-auth0-hooks';

function MyShows() {
  const { response, error, isLoading } = useApi(`${process.env.API_BASE_URL}/api/my/shows`, {
    audience: 'https://api/tv-shows',
    scope: 'read:shows'
  });

  if (isLoading) {
    return (
      <div>Loading your subscriptions ...</div>
    );
  }

  if (error) {
    return (
      <div>Could not load subscriptions: {error.message}</div>
    );
  }

  return (
    <div>You have subscribed to a total of {response && response.shows && response.shows.length} shows...</div>
  );
}

export default function About() {
  const auth = useAuth();

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
      <h3>My Shows</h3>
      <MyShows />
    </div>
  );
}