module.exports = {
  publicRuntimeConfig: {
    apiBaseUrl: 'http://localhost:3001',
    auth0: {
      domain: 'sandrino-dev.auth0.com',
      clientId: '9f6ClmBt37ZGCXNqToPbefKmzVBSOLa2',
      redirectUri: 'http://localhost:3000/',
      postLogoutRedirectUri: 'http://localhost:3000/'
    }
  },
}