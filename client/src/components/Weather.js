import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { getCurrentWeather, fileFromInt } from '../lib/smhi';

const styles = {
  container: {},
  weather: {
    color: 'white',
    fontSize: '1.6em',
    margin: 0,
    textAlign: 'right',
  },
  weatherImg: {
    maxWidth: '100%',
    height: 'auto',
  },
};

export default class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: {},
    };
    this.refreshWeather = this.refreshWeather.bind(this);
    this.handleNewWeather = this.handleNewWeather.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.refreshWeather(), 1000 * 60 * 10);
    this.refreshWeather();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  refreshWeather() {
    getCurrentWeather()
      .then(this.handleNewWeather)
      .catch(err => console.log(err));
  }

  handleNewWeather(weather) {
    this.setState({
      weather: weather,
    });
  }

  render() {
    let weatherSymbol;
    if (this.state.weather.weatherSymbol) {
      weatherSymbol = (
        <img
          style={styles.weatherImg}
          role="presentation"
          src={require('../../resources/weather-icons/' + fileFromInt(this.state.weather.weatherSymbol))}
        />
      );
    } else {
      weatherSymbol = null;
    }
    let windDirectionSymbol;
    if (this.state.weather.windDirection) {
      windDirectionSymbol = (
        <img
          style={{
            position: 'absolute',
            right: 40,
            textAlign: 'right',
            marginTop: 20,
            marginLeft: 0,
            maxWidth: '16%',
            height: 'auto',
            WebkitTransform: 'rotate(' + this.state.weather.windDirection + 'deg)',
          }}
          role="presentation"
          src={require('../../resources/weather-icons/wind_arrow.png')}
        />
      );
    } else {
      windDirectionSymbol = null;
    }

    return (
      <div hidden={!this.props.visible} style={styles.container}>
        <Row>
          <Col xs={8}>
            <p style={styles.weather}>{this.state.weather.temp} °C</p>
            <p style={styles.weather}>
              {this.props.phrases.feels_like} {this.state.weather.windChill} °C
            </p>
            <p style={styles.weather}>
              {this.props.phrases.wind_speed} {this.state.weather.windVelocity} m/s
            </p>
            {windDirectionSymbol}
          </Col>
          <Col style={{ textAlign: 'center', paddingLeft: 0 }} xs={4}>
            {weatherSymbol}
          </Col>
        </Row>
      </div>
    );
  }
}
