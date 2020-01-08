import { ReactNode, ReactChildren, ComponentClass } from 'react';
export interface IComponentProps {
    [key: string]: any;
    children: ReactChildren;
}
interface RenderWrapper<TProps extends IComponentProps> {
    (props: TProps): ReactNode;
}
export default function withWrapper<TPropsType extends IComponentProps>(ChildComponent: ComponentClass<any>, name: string, render: RenderWrapper<TPropsType>): ReactNode;
export {};
