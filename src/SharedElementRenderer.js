import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { SharedElementClone } from "./SharedElementClone";
import {
  getSharedElementTransitionSourceConfig,
  getSharedElementTransitionTargetConfig,
  dissolveTransition
} from "./SharedElementTransition";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  hidden: {
    opacity: 0
  }
});

export class SharedElementRenderer extends Component {
  static propTypes = {
    source: PropTypes.any.isRequired,
    target: PropTypes.any.isRequired,
    hidePreSource: PropTypes.any.isRequired,
    hidePostTarget: PropTypes.any.isRequired,
    animValue: PropTypes.any.isRequired
  };

  state = {
    sourceLayout: undefined,
    targetLayout: undefined
  };

  componentWillUnmount() {
    const { source, target } = this.props;
    const { sourceLayout, targetLayout } = this.state;
    if (sourceLayout) source.releaseHiddenRefCount();
    if (targetLayout) target.releaseHiddenRefCount(false);
  }

  _renderAnimationClone = (clone, index = 0) => {
    const { style, component, isTarget } = clone;
    // const nativeContentType = contentTypeFromString(clone.nativeContentType);
    const key = `${isTarget ? "target" : "source"}${index + ""}`;
    return (
      <SharedElementClone key={key} element={component} style={{ ...style }} />
    );
  };

  _interpolate = (from, to, options) => {
    if (to === from) return to;
    const { animValue, hidePreSource, hidePostTarget } = this.props;
    if (options && options.type === "opacity") {
      return animValue.interpolate({
        inputRange: [0, 0, 1, 1],
        outputRange: [
          hidePreSource ? 0 : from,
          from,
          to,
          hidePostTarget ? 0 : to
        ]
      });
    } else if (options && options.clamp) {
      return animValue.interpolate({
        inputRange: [-0.1, 0, 1, 1.1],
        outputRange: [from, from, to, to]
      });
    } else {
      return animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [from, to]
      });
    }
  };

  renderAnimatedClones() {
    // console.log("renderAnimatedClones");
    const { source, target } = this.props;
    const transition = source.props.transition || dissolveTransition;
    const { sourceLayout, targetLayout } = this.state;
    const sourceStyle = StyleSheet.flatten([source.props.style]);
    const targetStyle = StyleSheet.flatten([target.props.style]);
    const sourceConfig = getSharedElementTransitionSourceConfig({
      source,
      sourceStyle,
      sourceLayout,
      target,
      targetLayout,
      targetStyle
    });

    const targetConfig = getSharedElementTransitionTargetConfig({
      source,
      sourceStyle,
      sourceLayout,
      target,
      targetLayout,
      targetStyle
    });
    return transition({
      from: sourceConfig,
      to: targetConfig,
      render: this._renderAnimationClone,
      interpolate: this._interpolate
    });
  }

  renderInitialClones() {
    const { source, target } = this.props;
    const { sourceLayout, targetLayout } = this.state;
    let sourceStyle = styles.hidden;
    let targetStyle = styles.hidden;
    if (sourceLayout) {
      sourceStyle = {
        position: "absolute",
        left: sourceLayout.x,
        top: sourceLayout.y,
        width: sourceLayout.width,
        height: sourceLayout.height
      };
    } else if (targetLayout) {
      targetStyle = {
        position: "absolute",
        left: targetLayout.x,
        top: targetLayout.y,
        width: targetLayout.width,
        height: targetLayout.height
      };
    }
    return [
      <SharedElementClone
        key="source0"
        element={source}
        style={sourceStyle}
        onMeasureElement={this.onMeasureSourceElement}
      />,
      <SharedElementClone
        key="target0"
        element={target}
        style={targetStyle}
        onMeasureElement={this.onMeasureTargetElement}
      />
    ];
  }

  render() {
    const { sourceLayout, targetLayout } = this.state;
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {sourceLayout && targetLayout
          ? this.renderAnimatedClones()
          : this.renderInitialClones()}
      </View>
    );
  }

  onMeasureSourceElement = sourceLayout => {
    const { source } = this.props;
    // console.log("onMeasureSourceElement: ", sourceLayout);
    this.setState({
      sourceLayout
    });
    source.addHiddenRefCount();
  };

  onMeasureTargetElement = targetLayout => {
    const { target } = this.props;
    // console.log("onMeasureTargetElement: ", targetLayout);
    this.setState({
      targetLayout
    });
    target.addHiddenRefCount();
  };
}

/*
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
