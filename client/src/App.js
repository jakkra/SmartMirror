import React from 'react';
import Clock from './Clock';


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
      temperature: 'E',
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
      default:
        console.log('Unhandled event: ' + message.event);
        break;
    }
  }

  render() {
    return (
      <div className='App'>
        <Clock temperature={this.state.temperature}/>
      </div>
    );
  }
}
