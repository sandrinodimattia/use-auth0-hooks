"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
function getComponentName(ChildComponent) {
    return ChildComponent.displayName || ChildComponent.name || 'Component';
}
function tryGetInitialPropsMethod(child) {
    const nextPage = child;
    return nextPage && nextPage.getInitialProps;
}
function withWrapper(ChildComponent, name, render) {
    const WrappedComponent = (props) => render(props);
    WrappedComponent.displayName = `${name}(${getComponentName(ChildComponent)})`;
    // Helper for Next.js support (getInitialProps)
    const getInitialProps = tryGetInitialPropsMethod(ChildComponent);
    if (getInitialProps) {
        const WrappedComponentNext = WrappedComponent;
        WrappedComponentNext.getInitialProps = (args) => tslib_1.__awaiter(this, void 0, void 0, function* () { return getInitialProps(args); });
    }
    return WrappedComponent;
}
exports.default = withWrapper;
//# sourceMappingURL=with-wrapper.js.map