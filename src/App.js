import React, { Component, createRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Router } from "./Router";
import screens from "./screens";

class App extends Component {
  routerRef = createRef();

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.button} onPress={this.onPressPop}>
            <Text style={styles.text}>Pop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.onPressPush}>
            <Text style={styles.text}>Push</Text>
          </TouchableOpacity>
        </View>
        <Router style={styles.router} ref={this.routerRef} />
      </View>
    );
  }

  onPressPush = () => {
    this.routerRef.current.push(
      screens[this.routerRef.current.length % screens.length]
    );
  };

  onPressPop = () => {
    this.routerRef.current.pop();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  router: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    margin: 8
  },
  button: {
    flex: 1,
    backgroundColor: "blue",
    margin: 2,
    padding: 10,
    borderRadius: 4
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    color: "white"
  }
});

export default App;
