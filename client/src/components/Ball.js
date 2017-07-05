import React from 'react';
import Konva from 'konva';
import {Layer, Rect, Circle, Stage} from 'react-konva';

const Ball = ({x, y, radius, color}) => (
  <Circle
    x={x}
    y={y}
    radius={radius}
    fill={color}
  />
);

export default Ball;
