"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const user_context_1 = tslib_1.__importDefault(require("../context/user-context"));
const auth0_1 = require("../utils/auth0");
const auth0_context_1 = tslib_1.__importDefault(require("../context/auth0-context"));
function initialState() {
    return {
        token: null,
        error: null,
        isLoading: false
    };
}
function useAuth(tokenRequest) {
    const { isAuthenticated, isLoading, error, user } = react_1.useContext(user_context_1.default);
    const { client, login, logout, handlers } = react_1.useContext(auth0_context_1.default);
    // If no token is needed we can just stop here.
    if (!tokenRequest) {
        return {
            user,
            error,
            isAuthenticated,
            isLoading,
            login,
            logout
        };
    }
    // The following will holde the additional state for this hook.
    // We'll try to fetch the token from the cache first if available.
    const [state, setState] = react_1.useState(() => (Object.assign(Object.assign({}, initialState()), { token: client && auth0_1.getTokenFromCache(client, tokenRequest.audience, tokenRequest.scope), isLoading: !!tokenRequest })));
    react_1.useEffect(() => {
        // We are not ready to fetch a token yet.
        if (!client || isLoading || !isAuthenticated) {
            return;
        }
        // Token is already available in this instance, no need to re-fetch it.
        if (state.token) {
            return;
        }
        // Try to fetch the token from the cache in a synchronous way.
        const cachedToken = auth0_1.getTokenFromCache(client, tokenRequest.audience, tokenRequest.scope);
        if (cachedToken) {
            setState(Object.assign(Object.assign({}, initialState()), { token: cachedToken }));
            return;
        }
        // We were not able to get the token from cache, so now we'll just start a transaction
        const getToken = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                setState(Object.assign(Object.assign({}, initialState()), { isLoading: true }));
                // We will fetch the token in a silent way.
                setState(Object.assign(Object.assign({}, initialState()), { token: yield auth0_1.ensureClient(client).getTokenSilently({
                        audience: tokenRequest.audience,
                        scope: tokenRequest.scope
                    }) }));
            }
            catch (e) {
                // An error occured.
                if (handlers.onAccessTokenError) {
                    handlers.onAccessTokenError(e, tokenRequest);
                }
                setState(Object.assign(Object.assign({}, initialState()), { error: e }));
            }
        });
        getToken();
    }, [isAuthenticated, isLoading]);
    return {
        user,
        error: error || state.error,
        isAuthenticated,
        isLoading: isLoading || state.isLoading,
        token: state.token,
        accessToken: state.token && state.token.accessToken,
        login,
        logout
    };
}
exports.default = useAuth;
//# sourceMappingURL=use-auth.js.map