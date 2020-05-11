import { Auth0Client } from 'context/auth0-context';
import { ITokenResponse } from 'context/access-token-context';
export declare function ensureClient(client: Auth0Client | null | undefined): Auth0Client;
export declare const DEFAULT_SCOPE = "openid profile email";
export declare function getUniqueScopes(...scopes: string[]): string;
export declare function getTokenFromCache(client: Auth0Client, audience: string, scope: string): ITokenResponse | undefined;
