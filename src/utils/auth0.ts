import { Auth0Client } from 'context/auth0-context';

export function ensureClient(client: Auth0Client | null | undefined): Auth0Client {
  if (!client) {
    throw new Error('Auth0Client was not initialized');
  }

  return client;
}

export const DEFAULT_SCOPE = 'openid profile email';

const dedupe = (arr: any): any => arr.filter((x: any, i: any) => arr.indexOf(x) === i);
export function getUniqueScopes(...scopes: string[]): string {
  const scopeString = scopes.filter(Boolean).join();
  return dedupe(scopeString.replace(/\s/g, ',').split(','))
    .join(' ')
    .trim();
}

export function getAccessTokenFromCache(client: Auth0Client, audience: string, scope: string): string | undefined {
  const cacheContainer: any = ensureClient(client);
  const { cache } = cacheContainer;
  const token = cache.get({
    scope: getUniqueScopes(DEFAULT_SCOPE, scope),
    audience: audience || 'default'
  });

  return token && token.access_token;
}
