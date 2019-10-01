# use-auth0-hooks

An easy way to sign in with Auth0 in your React application (client-side) using React Hooks.

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
                  <button onClick={() => logout()}>Log out</button>
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

import { useAuth0, requireLogin } from 'use-auth0-hooks';

function Profile() {
  const { user } = useAuth0();

  return (
    <div>
      <h1>Profile</h1>
      <p>This is the profile page.</p>
      <pre>{JSON.stringify(user || { }, null, 2)}</pre>
    </div>
  );
}

export default requireLogin(Profile);
```

## Advanced Use Cases

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
const onError = (err) => {
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
        onError={onError}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </Auth0Provider>
    );
  }
}
```