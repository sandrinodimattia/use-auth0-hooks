"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const auth0_context_1 = tslib_1.__importDefault(require("./auth0-context"));
const auth0_1 = require("../utils/auth0");
const user_context_1 = tslib_1.__importDefault(require("./user-context"));
/**
 * Logic which will take care of cleaning up the state and optionally calling the redirect handler.
 */
function redirectAfterLogin(appState, onRedirectCallback) {
    if (!window) {
        return;
    }
    // We want to remove the state and the code from the querystring.
    window.history.replaceState({}, document && document.title, window && window.location.pathname);
    // Allow the implementation of custom redirect logic.
    if (onRedirectCallback) {
        onRedirectCallback(appState);
    }
}
function initialState() {
    return {
        user: null,
        error: null,
        isAuthenticated: false,
        isLoading: false
    };
}
function UserProvider({ children }) {
    const { client, handlers } = react_1.useContext(auth0_context_1.default);
    const [state, setState] = react_1.useState(initialState);
    react_1.useEffect(() => {
        const executeCallback = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            setState(Object.assign(Object.assign({}, initialState()), { isLoading: true }));
            if (client) {
                try {
                    // If the user was redirect from Auth0, we need to handle the exchange or throw an error.
                    if (window.location.search.includes('state=') || (window.location.search.includes('error=')
                        || window.location.search.includes('code='))) {
                        const { appState } = yield auth0_1.ensureClient(client).handleRedirectCallback();
                        redirectAfterLogin(appState, handlers.onRedirectCallback);
                    }
                    const user = yield auth0_1.ensureClient(client).getUser();
                    setState(Object.assign(Object.assign({}, initialState()), { user, isAuthenticated: !!user }));
                }
                catch (err) {
                    setState(Object.assign(Object.assign({}, initialState()), { error: err }));
                    // Call a custom error handler if available.
                    if (handlers.onLoginError) {
                        handlers.onLoginError(err);
                    }
                }
            }
        });
        executeCallback();
    }, [client]);
    return (react_1.default.createElement(user_context_1.default.Provider, { value: state }, children));
}
exports.default = UserProvider;
//# sourceMappingURL=user-provider.js.map