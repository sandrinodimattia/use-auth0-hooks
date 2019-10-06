# use-auth0-hooks

An easy way to sign in with Auth0 in your React application (client-side) using React Hooks.

Highlights:

 - Support hooks and class based components
 - Pluggable architecture where you can add your error handlers and take action when redirecting
 - Sign in
 - Sign out
 - Request access tokens for your APIs, with automated handling of expired tokens.
 - Require the user to be signed in or make it optional, depending on the page you're on.
 - Built with TypeScript
 - Makes use of `@auth0/auth0-spa-js` which uses the Authorization Code grant with PKCE (instead of Implicit)

## Installation

Using [npm](https://npmjs.org):

```sh
npm install use-auth0-hooks
```

Using [yarn](https://yarnpkg.com):

```sh
yarn add use-auth0-hooks
```

## Getting Started

### Next.js

Wrap your application with the `Auth0Provider` (under `/pages/_app.js`):

```js
import App from 'next/app';
import Router from 'next/router';

import { Auth0Provider } from 'use-auth0-hooks';

/**
 * Create a page which wraps the Auth0 provider.
 */
export default class Root extends App {
  render () {
    const { Component, pageProps } = this.props;
    return (
      <Auth0Provider
        domain={'sandrino-dev.auth0.com'}
        clientId={'9f6ClmBt37ZGCXNqToPbefKmzVBSOLa2'}
        redirectUri={'http://localhost:3000/'}>
          <Component {...pageProps} />
      </Auth0Provider>
    );
  }
}
```

You can then create a `NavBar` component with the necessary buttons:

```js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'

import { useAuth0 } from 'use-auth0-hooks';

export default function NavBar() {
  const { pathname, query } = useRouter();
  const { isAuthenticated, isLoading, login, logout } = useAuth0();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href='/about'>
              <a>About</a>
            </Link>
          </li>
          {!isLoading && (
            isAuthenticated ? (
              <>
                <li>
                  <Link href='/profile'>
                    <a>Profile</a>
                  </Link>
                </li>
                <li>
                  <button onClick={() => logout({ returnTo: 'http://localhost:3000' })}>Log out</button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => login({ appState: { returnTo: { pathname, query } } })}>
                  Log in
                </button>
              </li>
            )
          )}
        </ul>
      </nav>

      ...
    </header>
  );
};
```

And finally you can create pages which require authentication:

```js
import React from 'react';

import { withAuth, withLoginRequired } from 'use-auth0-hooks';

function Profile({ auth }) {
  const { user } = auth;
  return (
    <div>
      <h1>Profile</h1>
      <p>This is the profile page.</p>
      <pre>{JSON.stringify(user || { }, null, 2)}</pre>
    </div>
  );
}

export default withLoginRequired(
  withAuth(Profile)
);
```

## Advanced Use Cases

### Calling an API

You can use hooks or high order components to get an access token for your API:

```js
import { useAuth, useAccessToken } from 'use-auth0-hooks';

export function SomePage() {
  const { accessToken } = useAuth({
    audience: 'https://api.mycompany.com/',
    scope: 'read:things'
  });

  const { response, isLoading } = callMyApi(`https://localhost/api/my/shows`, accessToken);
  if (isLoading) {
    return (
      <div>Loading your subscriptions ...</div>
    );
  }

  return (
    <div>API call response: {response}</div>
  );
}
```

Or you can also use it in class based components:

```js
import { Component } from 'react';
import fetch from 'isomorphic-unfetch';

import { withAuth } from 'use-auth0-hooks';

class MyTvShows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myShows: null,
      myShowsError: null
    };
  }

  async fetchUserData() {
    const { myShows, myShowsError } = this.state;
    if (myShows || myShowsError) {
      return;
    }

    const { accessToken } = this.props.auth;
    if (!accessToken) {
      return;
    }

    const res = await fetch(`${process.env.API_BASE_URL}/api/my/shows`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (res.status >= 400) {
      this.setState({
        myShowsError: res.statusText || await res.json()
      })
    } else {
      const { shows } = await res.json();
      this.setState({
        myShows: shows.map(entry => entry.show)
      })
    }
  }
  
  async componentDidMount () {
    await this.fetchUserData();
  }

  async componentDidUpdate() {
    await this.fetchUserData();
  }

  render() {
    const { auth } = this.props;
    const { myShows, myShowsError } = this.state;
    return (
      <div>
        {
          myShows && (
            <div>
              <h1>My Favourite TV Shows ({auth.user.email})</h1>
              <p>This is rendered on the client side.</p>
              {myShowsError && <pre>Error loading my shows: {myShowsError}</pre>}
              <ul>
                {state.myShows && state.myShows.map(show => (
                  <li key={show.id}>
                    {show.name}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </div>
    );
  }
};

export default withAuth(MyTvShows, {
  audience: 'https://api/tv-shows',
  scope: 'read:shows'
});
```

### Deep Links

When a user clicks the login button on a specific page you'll probably want to send them back to that page after the login is complete. In order to do this you'll want to store the current URL in the application state:

```js
const { pathname, query } = useRouter();
const { login } = useAuth0();

return (    
  <button onClick={() => login({ appState: { returnTo: { pathname, query } } })}>
    Log in
  </button>
);
```

And then you'll just provide a method which will be called after the login completed (ie: to redirect the user back to the page they were one):

```js
import App from 'next/app';
import Router from 'next/router';

import Layout from '../components/layout';
import { Auth0Provider } from '../components/auth';

/**
 * Where to send the user after they have signed in.
 */
const onRedirectCallback = appState => {
  if (appState && appState.returnTo) {
    Router.push({
      pathname: appState.returnTo.pathname,
      query: appState.returnTo.query
    })
  }
};

/**
 * Create a page which wraps the Auth0 provider.
 */
export default class Root extends App {
  render () {
    const { Component, pageProps } = this.props;
    return (
      <Auth0Provider
        ...
        onRedirectCallback={onRedirectCallback}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </Auth0Provider>
    );
  }
}
```

### Before Login

When redirecting to the login page you'll end up in a state where the login page is still loading and the current page is still showing. You can render a message to explain that the user is being redirected.

```js
/**
 * When redirecting to the login page you'll end up in this state where the login page is still loading.
 * You can render a message to show that the user is being redirected.
 */
const onRedirecting = () => {
  return (
    <div>
      <h1>Signing you in</h1>
      <p>
        In order to access this page you will need to sign in.
        Please wait while we redirect you to the login page...
      </p>
    </div>
  );
};

/**
 * Create a page which wraps the Auth0 provider.
 */
export default class Root extends App {
  render () {
    const { Component, pageProps } = this.props;
    return (
      <Auth0Provider
        ...
        onRedirecting={onRedirecting}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </Auth0Provider>
    );
  }
}
```

### Error Handling

If for some reason the login fails (eg: an Auth0 Rule returns an error), you'll want to handle this in your application. One way to do this is to redirect to an error page:

```js
/**
 * When signing in fails for some reason, we want to show it here.
 * @param {Error} err 
 */
const onLoginError = (err) => {
  Router.push({
    pathname: '/oops',
    query: {
      message: err.error_description || err.message
    }
  })
};

/**
 * Create a page which wraps the Auth0 provider.
 */
export default class Root extends App {
  render () {
    const { Component, pageProps } = this.props;
    return (
      <Auth0Provider
        ...
        onLoginError={onLoginError}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </Auth0Provider>
    );
  }
}
```

You can also be notified when retrieving an new access token is not possible:

```js
const onAccessTokenError = (err, options) => {
  console.error('Failed to retrieve access token: ', err);
};

/**
 * Create a page which wraps the Auth0 provider.
 */
export default class Root extends App {
  render () {
    const { Component, pageProps } = this.props;
    return (
      <Auth0Provider
        ...
        onAccessTokenError={onAccessTokenError}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </Auth0Provider>
    );
  }
}
```