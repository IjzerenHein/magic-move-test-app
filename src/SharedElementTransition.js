export function dissolveTransition({ from, to, interpolate, render }) {
  //
  // Move & scale source component from start
  // position/size to the ending position
  //
  from.style.transform = [
    { translateX: interpolate(from.start.x, from.end.x) },
    { translateY: interpolate(from.start.y, from.end.y) },
    { scaleX: interpolate(from.start.scaleX, from.end.scaleX) },
    { scaleY: interpolate(from.start.scaleY, from.end.scaleY) }
  ];
  from.style.opacity = interpolate(from.start.opacity, 0, {
    type: "opacity"
  });

  //
  // Move & scale target component from starting
  // position/size to the ending position
  //
  to.style.transform = [
    { translateX: interpolate(to.start.x, to.end.x) },
    { translateY: interpolate(to.start.y, to.end.y) },
    { scaleX: interpolate(to.start.scaleX, to.end.scaleX) },
    { scaleY: interpolate(to.start.scaleY, to.end.scaleY) }
  ];
  to.style.opacity = interpolate(0, to.end.opacity, {
    type: "opacity"
  });

  //
  // Render
  //
  return [render(to), render(from)];
}

export function getSharedElementTransitionSourceConfig({
  source,
  sourceLayout,
  sourceStyle,
  targetLayout,
  targetStyle,
  nativeContentType
}) {
  return {
    isTarget: false,
    component: source,
    width: sourceLayout.width,
    height: sourceLayout.height,
    imageWidth: sourceLayout.imageWidth,
    imageHeight: sourceLayout.imageHeight,
    blurRadius: 0,
    start: {
      x: sourceLayout.x,
      y: sourceLayout.y,
      scaleX: sourceLayout.scaleX,
      scaleY: sourceLayout.scaleY,
      opacity: sourceStyle.opacity !== undefined ? sourceStyle.opacity : 1
    },
    end: {
      x: targetLayout.x - (sourceLayout.width - targetLayout.width) / 2,
      y: targetLayout.y - (sourceLayout.height - targetLayout.height) / 2,
      scaleX:
        ((targetLayout.width * targetLayout.scaleX) /
          (sourceLayout.width * sourceLayout.scaleX)) *
        sourceLayout.scaleX,
      scaleY:
        ((targetLayout.height * targetLayout.scaleY) /
          (sourceLayout.height * sourceLayout.scaleY)) *
        sourceLayout.scaleY,
      opacity: targetStyle.opacity !== undefined ? targetStyle.opacity : 1
    },
    props: {
      ...source.props
    },
    style: {
      ...sourceStyle,
      position: "absolute",
      width: sourceLayout.width,
      height: sourceLayout.height,
      left: 0,
      top: 0,
      transform: [
        { translateX: sourceLayout.x },
        { translateY: sourceLayout.y },
        { scaleX: sourceLayout.scaleX },
        { scaleY: sourceLayout.scaleY }
      ],
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    },
    contentStyle: undefined,
    nativeContentType
  };
}

export function getSharedElementTransitionTargetConfig({
  target,
  sourceLayout,
  sourceStyle,
  targetLayout,
  targetStyle,
  nativeContentType
}) {
  return {
    isTarget: true,
    component: target,
    width: targetLayout.width,
    height: targetLayout.height,
    imageWidth: targetLayout.imageWidth,
    imageHeight: targetLayout.imageHeight,
    blurRadius: 0,
    start: {
      x: sourceLayout.x - (targetLayout.width - sourceLayout.width) / 2,
      y: sourceLayout.y - (targetLayout.height - sourceLayout.height) / 2,
      scaleX:
        ((sourceLayout.width * sourceLayout.scaleX) /
          (targetLayout.width * targetLayout.scaleX)) *
        targetLayout.scaleX,
      scaleY:
        ((sourceLayout.height * sourceLayout.scaleY) /
          (targetLayout.height * targetLayout.scaleY)) *
        targetLayout.scaleY,
      opacity: sourceStyle.opacity !== undefined ? sourceStyle.opacity : 1
    },
    end: {
      x: targetLayout.x,
      y: targetLayout.y,
      scaleX: targetLayout.scaleX,
      scaleY: targetLayout.scaleY,
      opacity: targetStyle.opacity !== undefined ? targetStyle.opacity : 1
    },
    props: {
      ...target.props
    },
    style: {
      ...targetStyle,
      position: "absolute",
      width: targetLayout.width,
      height: targetLayout.height,
      left: 0,
      top: 0,
      transform: [
        { translateX: targetLayout.x },
        { translateY: targetLayout.y },
        { scaleX: targetLayout.scaleX },
        { scaleY: targetLayout.scaleY }
      ],
      margin: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    },
    contentStyle: undefined,
    nativeContentType
  };
}
