import {
  ReactNode,
  ReactChildren,
  FunctionComponent,
  ComponentClass
} from 'react';

interface INextPage {
  getInitialProps?(ctx: any): Promise<any>;
}

export interface IComponentProps {
  [key: string]: any;
  children: ReactChildren;
}

interface RenderWrapper<TProps extends IComponentProps> {
  (props: TProps): ReactNode;
}

function getComponentName(ChildComponent: ComponentClass<any>): string {
  return ChildComponent.displayName || ChildComponent.name || 'Component';
}

function tryGetInitialPropsMethod(
  child: ComponentClass<any>
): ((ctx: any) => Promise<any>) | undefined {
  const nextPage = child as INextPage;
  return nextPage && nextPage.getInitialProps;
}

export default function withWrapper<TPropsType extends IComponentProps>(
  ChildComponent: ComponentClass<any>,
  name: string,
  render: RenderWrapper<TPropsType>
): ReactNode {
  const WrappedComponent = (props: TPropsType): ReactNode => render(props);
  (WrappedComponent as FunctionComponent).displayName = `${name}(${getComponentName(
    ChildComponent
  )})`;

  // Helper for Next.js support (getInitialProps)
  const getInitialProps = tryGetInitialPropsMethod(ChildComponent);
  if (getInitialProps) {
    const WrappedComponentNext = WrappedComponent as INextPage;
    WrappedComponentNext.getInitialProps = async (args: any): Promise<any> => getInitialProps(args);
  }

  return WrappedComponent;
}
