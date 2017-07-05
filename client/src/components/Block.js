import React from 'react';
import Konva from 'konva';
import {Layer, Rect, Circle, Stage} from 'react-konva';

export default class Block extends React.Component {
  constructor(...args) {
    super(...args);
    this.checkHit = this.checkHit.bind(this);
    this.state = {
      hit: false,
      color: 'red'
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.hit === true && this.state.hit === false){
      return true;
    }
    return false;
  }

  checkHit(ballX, ballY){
    console.log('CheckHit');
    if (this.state.hit === false && ballX >= this.props.x && ballX <= this.props.x + 200 && ballY >= this.props.y - 50 && ballY <= this.props.y) {
      this.setState({
        hit: true,
        color: 'transparent'
      });
      return true;
    }
    return false;
  }

  render() {
    return (
      <Rect
        x={this.props.x} y={this.props.y} width={200} height={50}
        fill={this.state.color}
        shadowBlur={10}
      />
      );
  }
}
