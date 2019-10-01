import React, { useEffect } from 'react';
import createClient from '@auth0/auth0-spa-js';

import getState from './get-state';
import Auth0Context from './context';

const redirectAfterLogin = (appState, onRedirectCallback) => {
  if (!window) {
    return;
  }

  // We want to remove the state and the code from the querystring.
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );

  // Allow the implementation of custom redirect logic.
  if (onRedirectCallback) {
    onRedirectCallback(appState);
  }
}

const initAuth0 = async (state, options, onRedirectCallback, onError) => {
  try {
    const client = await createClient(options);
    state.setClient(client);
  
    // If the user was redirect from Auth0, we need to handle the exchange or throw an error.
    if (window.location.search.includes("state=") || (window.location.search.includes("error=") || window.location.search.includes("code="))) {
      const { appState } = await client.handleRedirectCallback();
      redirectAfterLogin(appState, onRedirectCallback);
    }
  
    const isAuthenticated = await client.isAuthenticated();
    state.setAuthenticated(isAuthenticated);
  
    if (isAuthenticated) {
      const user = await client.getUser();
      state.setUser(user);
    }

    state.setLoading(false);
  } catch (err) {
    state.setUser(null);
    state.setLoading(false);
    state.setAuthenticated(false);

    // Call a custom error handler if available.
    if (onError) {
      onError(err);
    } else {
      console.error(err);
    }
  }
};

export default function Auth0Provider({ children, clientId, redirectUri, onRedirecting, onRedirectCallback, onError, ...props }) {
  const state = getState();
  const options = {
    client_id: clientId,
    redirect_uri: redirectUri,
    ...props
  };

  useEffect(() => { 
    initAuth0(state, options, onRedirecting, onRedirectCallback, onError);
  }, []);

  // These values will be available in the context.
  const contextValues = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: (...p) => state.client.loginWithRedirect(...p),
    logout: (...p) => state.client.logout(...p),
    getAccessToken: (...p) => state.client.getTokenSilently(...p),
    onRedirecting
  };

  return (
    <Auth0Context.Provider value={contextValues}>
      {children}
    </Auth0Context.Provider>
  );
};