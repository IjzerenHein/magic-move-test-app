import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { SharedElementRenderer } from "./SharedElementRenderer";

export class SharedElementOverlay extends PureComponent {
  static propTypes = {
    scenes: PropTypes.any,
    startIndex: PropTypes.number,
    animValue: PropTypes.any
  };

  getSharedElements() {
    const { sourceScene, targetScene } = this.props;
    if (!sourceScene || !targetScene) return;
    const targetSharedElements = targetScene.getSharedElements();
    const sharedElements = sourceScene.getSharedElements().map(source => ({
      source,
      target: targetSharedElements.find(
        ({ props }) => props.sharedId === source.props.sharedId
      )
    }));
    return sharedElements.filter(({ target }) => target);
  }

  render() {
    const { animValue, hidePreSource, hidePostTarget } = this.props;
    const sharedElements = this.getSharedElements();
    // console.log("SharedRenderer: ", sharedElements);
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {sharedElements
          ? sharedElements.map(({ source, target }, index) => (
              <SharedElementRenderer
                key={"SharedElementRenderer" + index}
                source={source}
                target={target}
                hidePreSource={hidePreSource}
                hidePostTarget={hidePostTarget}
                animValue={animValue}
              />
            ))
          : undefined}
      </View>
    );
  }
}

/*

// Inventory phase
1. Get components from source
2. Get components from target
3. Determine shared element transitions

// Source pipeline
1. Measure source scene (cached)
2. Measure source component (in parallel)
3. Render source clone in overlay
4. Hide source clone in screen

// Target pipeline
1. Measure target scene (cached)
2. Measure target component (in parallel)
3. Render target clone in overlay
4. Hide target clone in screens

// Animate phase (upon completation of )
1. Call transition function
2. Update source & target styles




3. Measure source scene (cached)
4. Measure target scene (cached)
5. Measure source component
6. Measure target component

// Render phase
10. Render source clone
11. Hide source

*/
