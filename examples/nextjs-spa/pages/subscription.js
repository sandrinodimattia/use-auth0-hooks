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

export default function Subscription() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <div>
      <h1>TV Subscription</h1>
      <p>
        This page will show information about your current TV subscription.
      </p>
      {
        isAuthenticated && 
        <>
          <h3>Total Shows for {user.email}</h3>
          <MyShows />
        </>
      }
      {
        !isLoading && !isAuthenticated && 
        <>
          <p style={{color: 'red'}}>You need to be authenticated before we can show your TV subscription information.</p>
        </>
      }
    </div>
  );
}