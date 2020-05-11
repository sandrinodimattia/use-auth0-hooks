"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const use_auth_1 = tslib_1.__importDefault(require("../hooks/use-auth"));
const with_wrapper_1 = tslib_1.__importDefault(require("../utils/with-wrapper"));
function withAuth(ChildComponent, options) {
    return with_wrapper_1.default(ChildComponent, 'withAuth', (_a) => {
        var props = tslib_1.__rest(_a, []);
        const auth = use_auth_1.default(options);
        return (react_1.default.createElement(ChildComponent, Object.assign({}, props, { auth: auth })));
    });
}
exports.default = withAuth;
//# sourceMappingURL=with-auth.js.map