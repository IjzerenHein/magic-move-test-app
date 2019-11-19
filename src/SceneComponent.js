import React, { Component } from "react";
import { Animated, StyleSheet } from "react-native";
import { SceneContext } from "./SceneContext";

const styles = StyleSheet.create({
  hidden: {
    opacity: 0
  }
});

const animations = {
  fadeInUp: {
    opacity: 0,
    //scale: 1.5
    translateY: 100
  },
  fadeOut: {
    opacity: 0,
    exit: true
  },
  fadeIn: {
    opacity: 0
  }
};

const IDENTITY = {
  opacity: 1,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotate: "0deg",
  rotateX: "0deg",
  rotateY: "0deg",
  rotateZ: "0deg"
};

export class SceneComponent extends Component {
  state = {
    hiddenSourceRefCount: 0,
    hiddenTargetRefCount: 0
  };

  componentDidMount() {
    if (this._sceneContext && this.props.sharedId) {
      // console.log("componentDidMount: ", this.props.sharedId);
      this._sceneContext.addSharedElement(this);
    }
  }

  componentWillUnmount() {
    if (this._sceneContext && this.props.sharedId) {
      // console.log("componentWillUnmount: ", this.props.sharedId);
      this._sceneContext.removeSharedElement(this);
    }
  }

  getAnimatedStyle() {
    let { animation, style } = this.props;
    const { hiddenRefCount } = this.state;
    if (!animation || !this._sceneContext)
      return hiddenRefCount ? [style, styles.hidden] : style;
    const { animValue } = this._sceneContext.props;

    if (typeof animation === "function") {
      return animation(animValue);
    } else if (typeof animation === "string") {
      animation = [animation];
    }

    const props = {};
    animation.forEach(anim => {
      if (typeof anim === "string") {
        if (!animations[anim])
          throw new Error(`Invalid animation ${anim} specified`);
        anim = animations[anim];
      }
      Object.keys(anim).forEach(key => {
        const idVal = IDENTITY[key];
        if (idVal === undefined) return;
        props[key] = props[key] || [idVal, idVal, idVal];
        const idx = anim.exit ? 2 : 0;
        props[key][idx] = anim[key];
      });
    });
    // console.log("PROPS: ", props);
    const newStyle = StyleSheet.flatten([style]);
    Object.keys(props).forEach(key => {
      const val = animValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: props[key]
      });
      if (key === "opacity") {
        newStyle[key] = val;
      } else {
        newStyle.transform = newStyle.transform || [];
        const obj = {};
        obj[key] = val;
        newStyle.transform.push(obj);
      }
    });
    return hiddenRefCount ? [newStyle, styles.hidden] : newStyle;
  }

  render() {
    const { children } = this.props;
    return (
      <SceneContext.Consumer>
        {sceneContext => {
          this._sceneContext = sceneContext;
          return (
            <Animated.View style={this.getAnimatedStyle()}>
              {children}
            </Animated.View>
          );
        }}
      </SceneContext.Consumer>
    );
  }

  addHiddenRefCount(target) {
    if (target) {
      this.setState({
        hiddenTargetRefCount: this.state.hiddenTargetRefCount + 1
      });
    } else {
      this.setState({
        hiddenSourceRefCount: this.state.hiddenSourceRefCount + 1
      });
    }
  }

  releaseHiddenRefCount(target) {
    if (target) {
      this.setState({
        hiddenTargetRefCount: this.state.hiddenTargetRefCount - 1
      });
    } else {
      this.setState({
        hiddenSourceRefCount: this.state.hiddenSourceRefCount - 1
      });
    }
  }

  async measure() {
    const style = StyleSheet.flatten([this.props.style]);
    return {
      width: style.width,
      height: style.height,
      x: style.left,
      y: style.top,
      scaleX: 1,
      scaleY: 1
    };
  }
}
