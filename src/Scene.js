import React, { Component } from "react";
import { Animated } from "react-native";
import { SceneContext } from "./SceneContext";
import PropTypes from "prop-types";

export class Scene extends Component {
  static propTypes = {
    component: PropTypes.any,
    animValue: PropTypes.any,
    // sourceSceneRef: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number
  };

  _sharedElements = [];

  render() {
    const { component, animValue, width } = this.props;
    //console.log("Scene.render: ", animValue, component, width);
    return (
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          /*opacity: animValue.interpolate({
            inputRange: [0, 1, 2, 3],
            outputRange: [1, 1, 0.8, 0.8]
          }),*/
          transform: [
            {
              translateX: animValue.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [width, 0, 0]
              })
            },
            {
              scale: animValue.interpolate({
                inputRange: [0, 1, 2, 3],
                outputRange: [1, 1, 0.9, 0.8]
              })
            }
          ]
        }}
      >
        <SceneContext.Provider value={this}>
          {React.createElement(component)}
        </SceneContext.Provider>
      </Animated.View>
    );
  }

  /*
  componentDidUpdate(prevProps, prevState) {
    if (this.props.sourceSceneRef && !prevProps.sourceSceneRef) {
      this._showSharedElementTransitions();
    } else if (!this.props.sourceSceneRef && prevProps.sourceSceneRef) {
      this._hideSharedElementTransitions();
    }
  }

  _showSharedElementTransitions() {
  }

  _hideSharedElementTransitions() {}*/

  getSharedElements() {
    return this._sharedElements;
  }

  addSharedElement(child) {
    // console.log("Scene.addSharedElement: ", child.props.sharedId);
    this._sharedElements.push(child);
  }

  removeSharedElement(child) {
    // console.log("Scene.removeSharedElement: ", child.props.sharedId);
    const idx = this._sharedElements.indexOf(child);
    if (idx >= 0) {
      this._sharedElements.splice(idx, 1);
    }
  }
}
