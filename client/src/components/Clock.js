import React from 'react';

import moment from 'moment'
import { Col, Row } from 'react-bootstrap';
moment.locale('sv');

const styles = {
  container: {

  },
  clock: {
    color: 'white',
    fontSize: '6.3em',
    lineHeight: 1,
    lineWidth: 1,
    marginLeft: -30,
    paddingLeft: 20,
  },
  clockSeconds: {
    color: 'white',
    fontSize: '0.4em',
    verticalAlign: 'top',
    paddingLeft: 1,
    textAlign: 'left',
  },
  smallText: {
    color: 'white',
    fontSize: '2.7em',
  },
}

export default class Clock extends React.Component {

  static propTypes = {
    visible: React.PropTypes.bool,
    showTemperature: React.PropTypes.bool
  };

  static defaultProps = {
    visible: true,
    showTemperature: true,
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
            <div style={styles.smallText}> {day}</div>
          <Col/>
        </Row>
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={12}>
                <div style={styles.clock}>
                  {this.state.date.format('HH:mm')}
                  <span style={styles.clockSeconds}>
                    {this.state.date.format('ss')}
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12}/>
            <p hidden={!this.props.showTemperature} style={styles.smallText}>{this.props.temperature} °C</p>
          <Col/>
        </Row>
      </div>
    );
  }
}
