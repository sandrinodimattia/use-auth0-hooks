"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const query_string_1 = require("query-string");
const react_1 = tslib_1.__importStar(require("react"));
const use_auth_1 = tslib_1.__importDefault(require("../hooks/use-auth"));
const auth0_context_1 = tslib_1.__importDefault(require("../context/auth0-context"));
const with_wrapper_1 = tslib_1.__importDefault(require("../utils/with-wrapper"));
function getReturnTo() {
    if (window && window.location) {
        return {
            returnTo: {
                pathname: window.location.pathname,
                query: query_string_1.parse(window.location.search)
            }
        };
    }
    return {};
}
function withLoginRequired(ChildComponent) {
    return with_wrapper_1.default(ChildComponent, 'withLoginRequired', (_a) => {
        var { path } = _a, rest = tslib_1.__rest(_a, ["path"]);
        const { isLoading, isAuthenticated, login } = use_auth_1.default();
        const context = react_1.useContext(auth0_context_1.default);
        react_1.useEffect(() => {
            if (!context.client || isLoading || isAuthenticated) {
                return;
            }
            login({ appState: getReturnTo() });
        }, [context.client, isLoading, isAuthenticated, login, path]);
        return isAuthenticated === true
            ? (react_1.default.createElement(ChildComponent, Object.assign({}, rest))) : ((context.handlers.onRedirecting && context.handlers.onRedirecting()) || null);
    });
}
exports.default = withLoginRequired;
//# sourceMappingURL=with-login-required.js.map