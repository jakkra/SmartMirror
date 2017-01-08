import React from 'react';
import Clock from './Clock';
import Weather from './Weather';
import Forecast from './Forecast'
import News from './News';
import RecordingStatus from './RecordingStatus';
import Message from './Message';
import Tasks from './Tasks';

import { config } from './config.js';

import { Col, Row } from 'react-bootstrap';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    let s = new WebSocket('ws://' + config.wsServerBaseURL);
    s.onmessage = this.handleMessage.bind(this);
    s.addEventListener('error', m => console.log(m));
    s.addEventListener('open', m => {
      console.log(m);
      s.send({event: 'connect', data: 'Hey there'});
    });
    this.state = {
      temperature: '22.6',
      isRecording: false,
      message: {
        text: 'No messages set',
        visible: false
      }
    };

  }

  handleMessage(message) {
    message = JSON.parse(message.data);
    console.log('new message', message);
    const data = message.data;
    switch(message.event){
      case 'temperature':
        this.setState({
          temperature: data.temperature
        })
        break;
      case 'recording':
        this.setState({
          isRecording: message.data.isRecording
        })
        break;
      case 'motion':
        if(!this.state.message.visible){
          this.setState({
            message: {
              text: data.message,
              visible: true
            }
          })
          setTimeout(() => {
            this.setState({
              message: {
                visible: false
              }
            })
          }, 10000)
        }
        break;
      default:
        console.log('Unhandled event: ' + message.event);
        break;
    }
  }

  render() {
    return (
      <div style={{fontFamily: 'Sawasdee', fontWeight: 500}} className='App'>
        <Row>
          <Col xs={7}>
            <Clock temperature={this.state.temperature}/>
            <RecordingStatus isRecording={this.state.isRecording} />
            <Tasks/>

          </Col>
          <Col xs={5}>
            <Row>
              <Weather/>
            </Row>
            <Row style={{marginTop: 150}}>
              <Forecast/>
            </Row>
          </Col>
        </Row>
        <Row style={{height: '20%'}}/>
        <Row >
          <Message props={{visible: this.state.message.visible, message: this.state.message.text}}/>
        </Row>
        <Row style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%'}}>
          <News/>
        </Row>
      </div>
    );
  }
}
