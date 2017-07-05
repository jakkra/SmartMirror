import React from 'react';
import Konva from 'konva';
import {Layer, Rect, Circle, Stage} from 'react-konva';

import Ball from './Ball';

export default class BounceGame extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {
        color: Konva.Util.getRandomColor(),
        ballX: 500,
        ballY: 1000,
        ballSpeedX: 10,
        ballSpeedY: 10,
        paddleX: window.innerWidth / 2,
        paddleY: window.innerHeight - 50,
      };
      this.draw = this.draw.bind(this);
      this.mosueMoved = this.mosueMoved.bind(this);
    }

    componentDidMount(){
      this.timer = setInterval(this.draw, 20);
    }

    draw() {
      let ballX = this.state.ballX + this.state.ballSpeedX;
      let ballY = this.state.ballY + this.state.ballSpeedY;
      let ballSpeedY = this.state.ballSpeedY;
      let ballSpeedX = this.state.ballSpeedX;

      if (ballY <= 25) {
        ballSpeedY = -ballSpeedY;
      }
      // check if the ball has hit the left wall
      if (ballX <= 25) {
        ballSpeedX = -ballSpeedX;
      }
      // check if the ball has hit the right wall
      if (ballX >= window.innerWidth) {
        ballSpeedX = -ballSpeedX;
      }
      // check if the ball has hit the paddle

      if (ballY <= window.innerHeight - 25 && ballY > window.innerHeight - 100 && ballX >= this.state.paddleX && ballX <= ballX + this.state.paddleX + 400) {
          ballSpeedY = -ballSpeedY;
          console.log("here")
      } else if(ballY >= window.innerHeight) {
         //ballSpeedY = -ballSpeedY;
         ballX = 500;
         ballY = 1000;
         console.log("dead")
      }
      this.setState({
        ballX: ballX,
        ballY: ballY,
        ballSpeedX: ballSpeedX,
        ballSpeedY: ballSpeedY
      })
    }

    mosueMoved(e) {
      this.setState({
        paddleX: e.screenX,
      });
    }

    render() {
      return (
        <Stage onMouseMove={this.mosueMoved} width={window.innerWidth} height={window.innerHeight} >
          <Layer>
            <Ball
              x={this.state.ballX}
              y={this.state.ballY}
              radius={50}
              color={this.state.color}
            />
            <Rect
                x={this.state.paddleX} y={this.state.paddleY} width={400} height={50}
                fill={this.state.color}
                shadowBlur={10}
                onClick={this.handleClick}
            />
          </Layer>
        </Stage>
        );
    }
}
