import {
  FunctionComponent,
  ComponentType,
  ReactElement
} from 'react';

interface INextPage {
  getInitialProps?(ctx: any): Promise<any>;
}

function getComponentName<TProps extends {}>(
  ChildComponent: ComponentType<TProps>
): string {
  return ChildComponent.displayName || ChildComponent.name || 'Component';
}

function tryGetInitialPropsMethod<TProps extends {}>(
  child: ComponentType<TProps>
): ((ctx: any) => Promise<any>) | undefined {
  const nextPage = child as INextPage;
  return nextPage && nextPage.getInitialProps;
}

export default function withWrapper<
  TPropsType extends {},
  TChildProps extends {}
>(
  ChildComponent: ComponentType<TChildProps>,
  name: string,
  render: (
    props: TPropsType
  ) => ReactElement<TChildProps> | null
): ComponentType<TChildProps & TPropsType> {
  const WrappedComponent: FunctionComponent<TChildProps & TPropsType> = (props) => render(props);

  // eslint-disable-next-line no-param-reassign
  WrappedComponent.displayName = `${name}(${getComponentName(ChildComponent)})`;

  // Helper for Next.js support (getInitialProps)
  const getInitialProps = tryGetInitialPropsMethod(ChildComponent);

  if (getInitialProps) {
    const WrappedComponentNext = WrappedComponent as INextPage;
    WrappedComponentNext.getInitialProps = async (args: any): Promise<any> => getInitialProps(args);
  }

  return WrappedComponent;
}
