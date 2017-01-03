import React from 'react';

import moment from 'moment'
import { Col, Row } from 'react-bootstrap';

const styles = {
  container: {
    'margin': 40
  },
  clock: {
    color: 'white',
    fontSize: '3em',
    marginLeft: 30,
    margin: 0,
    padding: 0
  },
}

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new moment()
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
          <Col xs={12} md={8}/>
            <p style={styles.clock}> {this.state.date.format('HH:mm')}</p>
          <Col/>
        </Row>
        <Row>
          <Col xs={12} md={8}/>
            <p style={styles.clock}> {this.state.date.format('LL')}</p>
          <Col/>
        </Row>
        <Row>
          <Col xs={12} md={8}/>
            <p style={styles.clock}>Temperatur ute: {this.props.temperature}</p>
          <Col/>
        </Row>
      </div>
    );
  }
}