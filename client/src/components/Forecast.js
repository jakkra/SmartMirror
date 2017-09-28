import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { getForecast } from '../lib/fetch';
import moment from 'moment';
import Skycons from 'react-skycons';

const styles = {
  container: {

  },
  weatherImg: {
  	
  },
  forecastText: {
  	color: 'white',
    fontSize: '1.7em',
  },
  foreacstIcon: {
    height: '40px',
  	color: 'white',
    fontSize: '1.8em',
    textAlign: 'center'
  },
  sunIcon: {
    color: 'white',
    fontSize: '1.8em',
    textAlign: 'right',
    lineHeight: 2
  },
  foreacstTemp: {
    whiteSpace: 'nowrap',
  	color: 'white',
    fontSize: '1.6em',
    textAlign: 'right',
  },
  locationLabel: {
  	color: 'white',
    fontSize: '2.9em',
    lineHeight: 1,
    marginBottom: 10
  }
}

export default class Forecast extends React.Component {

  static propTypes = {
    visible: React.PropTypes.bool
  };

  static defaultProps = {
    visible: true
  };

  constructor(props) {
    super(props);
    // Save the API limit when developing
    const dummy = 
    {
      forecast: [],
      sunrise: '8:35 AM',
      sunset: '2:52 PM'
    };
    this.state = {
    	weather: dummy
    };
    this.refreshForecast = this.refreshForecast.bind(this);
    this.handleNewForecast = this.handleNewForecast.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.refreshForecast(),
      1000 * 60 * 10
    );
     this.refreshForecast();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  refreshForecast() {
    getForecast()
    .then(res => {
      console.log(res);
      const f = {
        forecast: res.daily.data.slice(1),
        sunrise: new Date(res.daily.data["0"].sunriseTime * 1000),
        sunset: new Date(res.daily.data["0"].sunsetTime * 1000)
      };
      this.handleNewForecast(f);
    })
  	.catch((err) => console.log(err));
  }

  handleNewForecast(weather){
    console.log(weather);
  	this.setState({
  		weather: weather
  	})
  }

  render() {
    return (
      <div hidden={!this.props.visible} style={styles.container} className="pull-right">
  	       <p style={styles.locationLabel}> Lund </p>
        <Row>
          <Col xs={6}>
            <p style={styles.sunIcon} className='wi wi-sunrise'> {moment(this.state.weather.sunrise, ["h:mm A"]).format("HH:mm")}</p>
          </Col>
          <Col style={{ textAlign: 'right' }} xs={6}>
            <p style={styles.sunIcon} className='wi wi-sunset'> {moment(this.state.weather.sunset, ["h:mm A"]).format("HH:mm")}</p>
          </Col>
        </Row>
        
	      {this.state.weather.forecast.map(function(object, i){
	      	if(i > 4) return null;
	        return (
	        	<Row key={i}>
		          <Col xs={4}>
		          	<div style={styles.forecastText}>
		          		{moment(new Date(object.temperatureMaxTime) * 1000).format('dddd')}
		          	</div>
		          </Col>
		          <Col style={{ textAlign: 'center' }}xs={4}>
                <Skycons style={styles.foreacstIcon} color='white' icon={object.icon.replace(new RegExp('-', 'g'), '_').toUpperCase()} autoplay={true}/>
		          </Col>
		          <Col xs={4}>
		          	<div style={styles.foreacstTemp}>
		          		{Math.round(object.temperatureMax)} / {Math.round(object.temperatureMin)}
		          	</div>
		          </Col>
		        </Row>
	        	)
	    	})}
      </div>
    );
  }
}
