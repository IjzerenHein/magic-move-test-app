import { createContext } from "react";

export const SceneContext = createContext(undefined);

/*
export function withSceneContext(WrappedComponent) {
  const comp = props => {
    return (
      <SceneContext.Consumer>
        {sceneContext => (
          <WrappedComponent {...props} sceneContext={sceneContext} />
        )}
      </SceneContext.Consumer>
    );
  };
  comp.propTypes = {
    ...(WrappedComponent.propTypes || {})
  };
  delete comp.propTypes.sceneContext;
  comp.defaultProps = WrappedComponent.defaultProps;
  return comp;
}
*/
