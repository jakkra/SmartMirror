import React from 'react';

import moment from 'moment'
import { Col, Row } from 'react-bootstrap';
moment.locale('sv');

const styles = {
  container: {
    'margin': 40
  },
  clock: {
    color: 'white',
    fontSize: '6em',
    marginLeft: 30,
    margin: 0,
    padding: 0
  },
  smallText: {
    color: 'white',
    fontSize: '2.2em',
    marginLeft: 30,
    margin: 0,
    padding: 0
  },
}

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new moment(),
      lol: 'hej'
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new moment()
    });
  }

  render() {
    return (
      <div  style={styles.container}>
        <Row>
          <Col xs={12}/>
            <p style={styles.clock}> {this.state.date.format('HH:mm')}</p>
          <Col/>
        </Row>
        <Row>
          <Col xs={12}/>
            <p style={styles.smallText}> {this.state.date.format('dddd LL')}</p>
          <Col/>
        </Row>
        <Row>
          <Col xs={12}/>
            <p style={styles.smallText}>Temperatur inne: {this.props.temperature}</p>
          <Col/>
        </Row>
      </div>
    );
  }
}