import React from "react";
import { View } from "react-native";
import { SceneComponent } from "../SceneComponent";

const Scene1 = () => (
  <View style={{ flex: 1, backgroundColor: "blue" }}>
    <SceneComponent
      sharedId="square"
      animation={["fadeInUp", "fadeOut"]}
      style={{
        left: 20,
        top: 20,
        width: 100,
        height: 100,
        backgroundColor: "white",
        borderRadius: 50
      }}
    />
  </View>
);
const Scene2 = () => (
  <View style={{ flex: 1, backgroundColor: "green" }}>
    <SceneComponent
      sharedId="square"
      style={{
        left: 40,
        top: 40,
        width: 200,
        height: 200,
        backgroundColor: "white",
        borderRadius: 100
      }}
    />
  </View>
);
const Scene3 = () => (
  <View style={{ flex: 1, backgroundColor: "red" }}>
    <SceneComponent
      sharedId="square"
      style={{
        left: 60,
        top: 60,
        width: 20,
        height: 20,
        backgroundColor: "white",
        borderRadius: 10
      }}
    />
  </View>
);
const Scene4 = () => <View style={{ flex: 1, backgroundColor: "yellow" }} />;

const scenes = [Scene1, Scene2, Scene3, Scene4];

export default scenes;
