import React, { Component, createRef } from "react";
import { View, Animated, PanResponder } from "react-native";
import { Scene } from "./Scene";
import { SharedElementsRenderer } from "./SharedElementsRenderer";

const DEBUG = false;

export class Router extends Component {
  state = {
    sceneIndex: 0,
    scenes: [],
    animValue: new Animated.Value(0),
    width: 0,
    height: 0
  };

  constructor(props) {
    super(props);
    let deltaX = 0;
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // console.log("onStartShouldSetPanResponder");
        return this.state.sceneIndex ? true : false;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        // console.log("onStartShouldSetPanResponderCapture");
        return this.state.sceneIndex ? true : false;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // console.log("onMoveShouldSetPanResponder");
        return this.state.sceneIndex ? true : false;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // console.log("onMoveShouldSetPanResponderCapture");
        return this.state.sceneIndex ? true : false;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // console.log("onPanResponderGrant");
        const newScenes = { ...this.state.scenes };
        newScenes[this.state.sceneIndex - 1] = {
          ...newScenes[this.state.sceneIndex - 1],
          renderSharedElements: true
        };
        this.setState({
          scenes: newScenes
        });
        deltaX = 0;
      },
      onPanResponderMove: (evt, gestureState) => {
        const { animValue, sceneIndex, width } = this.state;
        deltaX = gestureState.dx;
        const val = sceneIndex - Math.max(0, deltaX / width);
        //console.log("onPanResponderMove: ", deltaX, ", val: ", val);
        animValue.setValue(val);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // console.log("onPanResponderRelease: ", deltaX);
        const sceneIndex =
          this.state.sceneIndex - (deltaX >= this.state.width / 2 ? 1 : 0);
        this._animate(sceneIndex);
        this.setState({
          sceneIndex
        });
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // console.log("onPanResponderTerminate");
        // Another component has become the responder, so this gesture
        // should be cancelled
        const { sceneIndex } = this.state;
        this._animate(sceneIndex);
        this.setState({
          sceneIndex
        });
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // console.log("onShouldBlockNativeResponder");
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }

  render() {
    const { scenes, width, height } = this.state;
    return (
      <View
        {...this.props}
        onLayout={this.onLayout}
        {...this._panResponder.panHandlers}
      >
        {scenes.map(({ component, setRef, animValue }, index) => {
          return (
            <Scene
              ref={setRef}
              key={"scene" + index}
              component={component}
              animValue={animValue}
              width={width}
              height={height}
            />
          );
        })}
        {scenes
          .map(({ renderSharedElements, ref, animValue }, index) => {
            const prevRef = index > 0 ? scenes[index - 1].ref : undefined;
            // console.log("Yo: ", renderSharedElements, ref, prevRef);
            if (renderSharedElements && ref && prevRef) {
              return (
                <SharedElementsRenderer
                  key={"sharedElementScene" + index}
                  sourceScene={prevRef}
                  targetScene={ref}
                  animValue={animValue}
                  hidePreSource={true}
                  hidePostTarget={true}
                />
              );
            }
            return undefined;
          })
          .filter(result => result)}
      </View>
    );
  }

  onLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({
        width,
        height
      });
    }
  };

  push(component) {
    let { scenes, sceneIndex, animValue } = this.state;
    /*console.log(
      "push: sceneIndex: ",
      sceneIndex,
      ", sceneLength: ",
      scenes.length
    );*/
    scenes = [...scenes];
    const scene = {
      component,
      ref: undefined,
      setRef: ref => {
        const idx = this.state.scenes.findIndex(s => s.component === component);
        if (idx >= 0) {
          const newScenes = [...this.state.scenes];
          newScenes[idx] = {
            ...newScenes[idx],
            ref
          };
          this.setState({
            scenes: newScenes
          });
        }
      },
      animValue: Animated.add(animValue, -sceneIndex),
      renderSharedElements: true
    };
    if (sceneIndex >= scenes.length) {
      scenes.push(scene);
    } else {
      scenes[sceneIndex] = scene;
    }
    sceneIndex++;
    this._animate(sceneIndex);
    this.setState({
      scenes,
      sceneIndex
    });
  }

  pop() {
    let { sceneIndex, scenes } = this.state;
    /*console.log(
      "pop: sceneIndex: ",
      sceneIndex,
      ", sceneLength: ",
      scenes.length
    );*/
    if (sceneIndex <= 0) return;
    sceneIndex--;
    const newScenes = [...scenes];
    newScenes[sceneIndex] = {
      ...newScenes[sceneIndex],
      renderSharedElements: true
    };
    this._animate(sceneIndex);
    this.setState({
      sceneIndex,
      scenes: newScenes
    });
  }

  _animate(sceneIndex) {
    // console.log("Animating to: ", sceneIndex);
    const animation = DEBUG
      ? Animated.timing(this.state.animValue, {
          toValue: sceneIndex,
          duration: 2000,
          useNativeDriver: true
        })
      : Animated.spring(this.state.animValue, {
          toValue: sceneIndex
        });
    animation.start(event => {
      console.log("Animation onEnd: ", event);
      if (!event.finished) return;
      const { sceneIndex, scenes } = this.state;
      const newScenes = scenes.map(scene => ({
        ...scene,
        renderSharedElements: false
      }));
      this.setState({
        scenes:
          sceneIndex < newScenes.length
            ? newScenes.slice(0, sceneIndex)
            : newScenes
      });
    });
  }

  get length() {
    return this.state.scenes.length;
  }
}
