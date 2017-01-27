import React from 'react';

import moment from 'moment'
import { Col, Row } from 'react-bootstrap';
moment.locale('sv');

const styles = {
  container: {
    marginLeft: 40,
    marginTop: 40
  },
  clock: {
    color: 'white',
    fontSize: '6.3em',
    marginLeft: 20,
    margin: 0,
    padding: 0,
    lineHeight: 1,
    lineWidth: 1,
  },
  clockSeconds: {
    color: 'white',
    fontSize: '2.4em',
    margin: 0,
    marginLeft: 60,
    padding: 0,
    lineHeight: 1,
    paddingTop: 7
  },
  smallText: {
    color: 'white',
    fontSize: '2.7em',
    marginLeft: 30,
    margin: 0,
    padding: 0
  },
}

export default class Clock extends React.Component {

  static propTypes = {
    visible: React.PropTypes.bool
  };

  static defaultProps = {
    visible: true
  };
  constructor(props) {
    super(props);
    this.state = {
      date: new moment(),
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
    let day = this.state.date.format('dddd, LL');
    day = day.charAt(0).toUpperCase() + day.slice(1);
    return (
      <div hidden={!this.props.visible} style={styles.container}>
        <Row>
          <Col xs={12}/>
            <p style={styles.smallText}> {day}</p>
          <Col/>
        </Row>
        <Row>
          <Col xs={12}>
            <Row>
              <Col style={{padding: 0}} xs={4}>
                <div style={styles.clock}>
                  {this.state.date.format('HH:mm')}
                </div>
              </Col>
              <Col xs={8}>
                <div style={styles.clockSeconds}>
                  {this.state.date.format('ss')}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12}/>
            <p style={styles.smallText}>{this.props.temperature} °C</p>
          <Col/>
        </Row>
      </div>
    );
  }
}
