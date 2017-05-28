import React from 'react';
import Modal from 'react-modal';
import BaseComponent from './BaseComponent';
import moment from 'moment';

import {
  LineChart,
  Line, XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import { getTemperaturesSevenDays } from '../lib/fetch';

const customModalStyle = {
  overlay: {
    border: '0.5px solid #ccc',
    backgroundColor: 'transparent'

  },
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black'
  }
};

export default class TemperatureGraph extends BaseComponent {

  static propTypes = {
    visible: React.PropTypes.bool,
  };

  static defaultProps = {
    visible: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      temperatures: []
    };
    this.days = [];
    this.renderTemp = this.renderTemp.bind(this);
    this.handleNewTemp = this.handleNewTemp.bind(this);
    this.refreshTemps = this.refreshTemps.bind(this);
    this.formatX = this.formatX.bind(this);
    this.formatY = this.formatY.bind(this);
  }

  onEvent(event){
    if(event.action === 'next'){
      this.rotateList();
    }
  }

  componentDidMount() {
    this.refreshTimer = setInterval(
      () => this.refreshTemps(),
      1000 * 60 * 5 
    );
    this.refreshTemps();
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  refreshTemps() {
  	getTemperaturesSevenDays()
  	.then(this.handleNewTemp)
  	.catch((err) => console.log(err));
  }

  handleNewTemp(temps){
    const t = temps.filter(function(obj) {
      return obj.temperature !== 0;
    });
  	this.setState({
  		temperatures: t,
    });
  }

  formatX(x) {
    if (this.days.indexOf(moment(new Date(x)).format('dddd')) > -1){
      return '';
    } else {
      this.days.push(moment(new Date(x)).format('dddd'));
      return moment(new Date(x)).format('dddd')
    }
  }

  formatY(y) {
    return y + ' °C';
  }

  renderTemp(temps) {
  	return (
  		<LineChart width={800} height={500} data={this.state.temperatures} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis axisLine={false} mirror={true} strokeWidth="2" tick={{stroke: 'white', fontSize: 18}} interval={Math.round(this.state.temperatures.length/7)} tickFormatter={this.formatX} dataKey="createdAt"/>
        <YAxis tick={{stroke: 'white', fontSize: 18}} type="number" domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={this.formatY}/>
        <CartesianGrid horizontal={false} strokeWidth="2" strokeDasharray="10 10"/>
        <Line name="Temperatur" dot={false} width={200} type="monotone" dataKey="temperature" strokeWidth="4" stroke="#FFA500" activeDot={{r: 8}}/>
      </LineChart>
  	);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.visible}
        style={customModalStyle}
        contentLabel="Modal"
      >
        {this.renderTemp(this.state.temps)}
      </Modal>
    );
  }
}
