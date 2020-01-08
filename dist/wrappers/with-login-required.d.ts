import React from 'react';
import { IComponentProps } from '../utils/with-wrapper';
export interface RequireLoginProps extends IComponentProps {
    path: string;
}
export default function withLoginRequired(ChildComponent: React.ComponentClass<any>): React.ReactNode;
