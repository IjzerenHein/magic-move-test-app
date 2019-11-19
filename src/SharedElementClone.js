import React, { Component } from "react";
import { Animated } from "react-native";
import PropTypes from "prop-types";

export class SharedElementClone extends Component {
  static propTypes = {
    style: PropTypes.any,
    element: PropTypes.any.isRequired,
    onMeasureElement: PropTypes.func
  };

  constructor(props) {
    super(props);
    this._measureElementLayout();
  }

  async _measureElementLayout() {
    const { element, onMeasureElement } = this.props;
    const elementLayout = await element.measure();
    onMeasureElement(elementLayout);
    /*this.setState({
      elmentLayout
    });*/
  }

  render() {
    const { element, style } = this.props;
    return <Animated.View {...element.props} style={style} />;
  }
}
