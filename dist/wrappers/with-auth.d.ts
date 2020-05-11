import React from 'react';
import { AccessTokenRequestOptions } from '../context/auth0-context';
export default function withAuth(ChildComponent: React.ComponentClass<any>, options?: AccessTokenRequestOptions): React.ReactNode;
