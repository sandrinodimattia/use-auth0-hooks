export interface ReturnTo {
    pathname: string | null;
    query: object | null;
}
export interface ReturnToAppState {
    returnTo?: ReturnTo | null;
}
