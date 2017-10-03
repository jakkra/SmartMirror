import React from 'react';

const config = require('../config');
import Clock from '../components/Clock';
import Weather from '../components/Weather';
import Forecast from '../components/Forecast'
import News from '../components/News';
import RecordingStatus from '../components/RecordingStatus';
import Message from '../components/Message';
import Tasks from '../components/Tasks';
import Article from '../components/Article';
import TemperatureGraph from '../components/TemperatureGraph';
import Transfers from '../components/Transfers';

import moment from 'moment'
config.language ? moment.locale(config.language) : moment.locale('sv');

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
      },
      visibility: {
        news: true,
        forecasts: true,
        article: false,
        tasks: true,
        weather: true,
        clock: true,
        temperatureGraph: false,
        transfers: true,
      }
    };
  }

  handleMessage(message) {
    message = JSON.parse(message.data);
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
      case 'visibility':
        const prevStateVisability = this.state.visibility;
        prevStateVisability[data.component] = data.visible;
        this.setState({
          visibility: prevStateVisability
        })
        break;
      case 'command':
        this.refs[data.component].onEvent(data);
        break;
      default:
        console.log('Unhandled event: ' + message.event);
        break;
    }
  }

  render() {
    let dateTime, transfers, news, tasks, weather, forecast, temperatureGraph, articles = null;
    if (config.modules.dateTime === true) {
      dateTime = (<Clock temperature={this.state.temperature} visible={this.state.visibility.clock} showTemperature={config.modules.tempPirSensor}/>)
    }
    if (config.modules.transfer === true) {
      transfers = (<Transfers visible={this.state.visibility.transfers} />);
    }
    if (config.modules.news === true) {
      news = (<News visible={this.state.visibility.news} />)
    }
    if (config.modules.wunderlistTasks === true) {
      tasks = (<Tasks visible={this.state.visibility.tasks} />)
    }
    if (config.modules.weather === true) {
      weather = (<Weather visible={this.state.visibility.weather} />)
    }
    if (config.modules.forecast === true) {
      forecast = (<Forecast visible={this.state.visibility.forecasts} />)
    }
    if (config.modules.temperatureGraph === true) {
      temperatureGraph = (<TemperatureGraph ref='temperatureGraph' visible={this.state.visibility.temperatureGraph} />)
    }
    if (config.modules.articles === true) {
      articles = (<Article ref='article' visible={this.state.visibility.article} />)
    }

    const AppStyles = {
      fontSize: config.styles.textScale,
      fontFamily: config.styles.fontFamily,
      fontWeight: config.styles.fontWeight,
      paddingTop: config.styles.paddingTop,
      paddingLeft: config.styles.paddingLeft,
      paddingRight: config.styles.paddingRight,
      paddingBottom: config.styles.paddingBottom
    };

    return (
      <div style={AppStyles} className='App'>
        {articles}
        {temperatureGraph}

        <Row className='Container'>
          <Col xs={4}>
            {dateTime}
            <RecordingStatus isRecording={this.state.isRecording} />
            {tasks}
            {transfers}

          </Col>
          <Col xs={4} />
          <Col xs={4}>
            <Row>
              {weather}
            </Row>
            <Row style={{marginTop: 50}}>
              {forecast}
            </Row>
          </Col>
        </Row>
        <Row style={{height: '1%'}}/>
        <Row style={{marginBottom: 100, marginTop: 50}}>
          <Message props={{visible: this.state.message.visible, message: this.state.message.text}}/>
        </Row>
        <Row style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%', padding: 60, paddingBottom: 0}}>
          {news}
        </Row>
      </div>
    );
  }
}
