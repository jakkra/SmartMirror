import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { getForecast, getIconClass } from './lib/yahoo_weather';
import moment from 'moment';

const styles = {
  container: {
    'margin': 40
  },
  forecast: {
    color: 'white',
    fontSize: '3em',
    margin: 0,
    padding: 0
  },
  weatherImg: {
  	position: 'absolute',
  	right: '40px'
  },
  forecastText: {
  	color: 'white',
    fontSize: '2em',
    margin: 0,
    padding: 0
  }
}

export default class Forecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	forecast: []
    };
    this.refreshForecast = this.refreshForecast.bind(this);
    this.handleNewForecast = this.handleNewForecast.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.refreshForecast.bind(this),
      1000 * 60 * 10
    );
    this.refreshForecast();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  refreshForecast() {
  	getForecast()
  	.then(this.handleNewForecast)
  	.catch((err) => console.log(err));
  }

  handleNewForecast(forecast){
  	console.log(forecast);
  	this.setState({
  		forecast: forecast
  	})
  }

  render() {
  	console.log('forecasts', this.state.forecast);

    return (
      <div style={styles.container}>
	      {this.state.forecast.map(function(object, i){
	      	if(i > 4) return null;
	        return (
	        	<Row key={i}>
		          <Col xs={4}>
		          	<div style={styles.forecastText}>
		          		{moment(new Date(object.date)).format('dddd')}
		          	</div>
		          </Col>
		          <Col xs={4}>
		          	<i style={styles.forecastText} className={getIconClass(object.code)}></i>
		          </Col>
		          <Col xs={4}>
		          	<div style={styles.forecastText}>
		          		{object.high} / {object.low}
		          	</div>
		          </Col>
		        </Row>
	        	)
	    	})}
      </div>
    );
  }
}
