import React from 'react';
import Clock from './Clock';
import Weather from './Weather';
import Forecast from './Forecast'
import News from './News';
import RecordingStatus from './RecordingStatus';

import { Col, Row } from 'react-bootstrap';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('Constructor');
    let s = new WebSocket("ws://localhost:3001/");
    s.onmessage = this.handleMessage.bind(this);
    s.addEventListener('error', m => console.log(m));
    s.addEventListener('open', m => {
      console.log(m);
      s.send({event: 'connect', data: 'Hey there'});
    });
    this.state = {
      temperature: '22',
      isRecording: false
    };
  }

  handleMessage(message) {
    console.log(message);
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
        <Row style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%'}}>
          <News/>
        </Row>
      </div>
    );
  }
}
