# Next.js Example

https://nextjs-spa-auth0-demo.now.sh

This example shows how to use this library with Next.js with a variety of things:

 - Pages where authentication is required or optional
 - Fetching access tokens for an API
 - Calling an API
 - Signing in and signing out

## Getting Started

Before you can get started with this example you'll need to configure and run an instance of the [TV Shows API](../tv-shows-api)

### Creating an application

Create a new "**Single Page Application**" in your [Auth0 account](https://manage.auth0.com/) under Applications and set the following:

 - Allowed Callback URLs: **http://localhost:3000**
 - Allowed Web Origins: **http://localhost:3000**
 - Allowed Logout URLs: **http://localhost:3000**

Take note of the application's Client ID and the domain once the application has been created.

### Next.js Configuration

Update your `next.config.js` file with your Auth0 account settings:

```
module.exports = {
  env: {
    API_BASE_URL: 'http://localhost:3001',
    AUTH0_DOMAIN: 'YOU.auth0.com',
    AUTH0_CLIENT_ID: 'YOUR_AUTH0_CLIENT_ID',
    REDIRECT_URI: 'http://localhost:3000/',
    POST_LOGOUT_REDIRECT_URI: 'http://localhost:3000/'
  }
}
```

### Running

Run the following commands to try the example application:

```bash
npm install
npm run dev
```
