import React from 'react';
import Konva from 'konva';
import {Layer, Rect, Circle, Stage} from 'react-konva';
import BaseComponent from './BaseComponent';

import Ball from './Ball';

export default class BounceGame extends BaseComponent {

  static propTypes = {
    visible: React.PropTypes.bool,
    ballBounce: React.PropTypes.func
  };

  static defaultProps = {
    visible: true
  };

    constructor(...args) {
      super(...args);
      this.state = {
        color: Konva.Util.getRandomColor(),
        ballX: 100,
        ballY: 100,
        ballSpeedX: 10,
        ballSpeedY: 10,
        paddleX: 700,
        paddleY: window.innerHeight - 50,
        visaible: true,
      };
      this.draw = this.draw.bind(this);
      this.movePaddleRight = this.movePaddleRight.bind(this);
      this.movePaddleLeft = this.movePaddleLeft.bind(this);

    }

    componentDidMount(){
      this.timer = setInterval(this.draw, 20);
    }

    onEvent(event){
      console.log('Bounce game onEvent', event)
      if (event.action === 'left'){
        this.movePaddleLeft();
      } else if (event.action === 'right'){
        this.movePaddleRight();
      }
    }

    draw() {
      let ballX = this.state.ballX + this.state.ballSpeedX;
      let ballY = this.state.ballY + this.state.ballSpeedY;
      let ballSpeedY = this.state.ballSpeedY;
      let ballSpeedX = this.state.ballSpeedX;

      if (ballY <= 25) {
        this.props.ballBounce({ event: 'bounce', data: {side: 'top', x: ballX / window.innerWidth , y: ballY / window.innerHeight }});
        ballSpeedY = -ballSpeedY;
      }
      // check if the ball has hit the left wall
      if (ballX <= 25) {
        this.props.ballBounce({ event: 'bounce', data: {side: 'left', x: ballX / window.innerWidth , y: ballY / window.innerHeight }});
        ballSpeedX = -ballSpeedX;
      }
      // check if the ball has hit the right wall
      if (ballX >= window.innerWidth - 25) {
        this.props.ballBounce({ event: 'bounce', data: {side: 'right', x: ballX / window.innerWidth , y: ballY / window.innerHeight }});
        ballSpeedX = -ballSpeedX;
      }
      // check if the ball has hit the paddle
      if (ballY <= window.innerHeight - 10 && ballY > window.innerHeight - 100 && (ballX >= this.state.paddleX) && (ballX <= this.state.paddleX + 200)) {
        ballSpeedY = -ballSpeedY;
        console.log("here")
      } else if(ballY >= window.innerHeight) {
         //ballSpeedY = -ballSpeedY;
        ballX = 100;
        ballY = 100;
        console.log("dead")
        this.props.ballBounce({ event: 'bounce', data: {side: 'bottom', x: ballX / window.innerWidth , y: ballY / window.innerHeight }});
      }
      this.setState({
        ballX: ballX,
        ballY: ballY,
        ballSpeedX: ballSpeedX,
        ballSpeedY: ballSpeedY
      })
    }

    movePaddleLeft() {
      this.setState({
        paddleX: this.state.paddleX - 70,
      });
    }
    movePaddleRight() {
      this.setState({
        paddleX: this.state.paddleX + 70,
      });
    }

    render() {
      return (
        <div>
          <Stage width={window.innerWidth} height={window.innerHeight} >
            <Layer>

              <Ball
                x={this.state.ballX}
                y={this.state.ballY}
                radius={50}
                color={this.state.color}
              />
              <Rect
                x={this.state.paddleX} y={this.state.paddleY} width={200} height={50}
                fill={this.state.color}
                shadowBlur={10}
              />
            </Layer>
          </Stage>
        </div>
        );
    }
}
