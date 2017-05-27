import React from 'react';
import Modal from 'react-modal';
import BaseComponent from './BaseComponent';
import moment from 'moment';

import {
  LineChart,
  Line, XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import { getTemperaturesSevenDays } from '../lib/fetch';


const styles = {
  container: {
    margin: 50,
    marginLeft: 30,
    marginTop: 60
  },
  taskTitle: {
    color: 'white',
    fontSize: '1.7em',
    margin: 0,
    padding: 0,
    textAlign: 'left'
  },
  articleText: {
    color: 'white',
    fontSize: '1.2em',
    margin: 0,
    padding: 0,
    textAlign: 'left'
  }
}

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
      console.log(x);
      this.days.push(moment(new Date(x)).format('dddd'));
      return moment(new Date(x)).format('dddd')
    }
  }

  renderTemp(temps) {
    console.log(this.state.temperatures)
  	return (
  		<LineChart width={800} height={500} data={this.state.temperatures} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis interval={50} tickFormatter={this.formatX} dataKey="createdAt"/>
        <YAxis type="number" domain={['dataMin - 1', 'dataMax + 1']}/>
        <CartesianGrid horizontal={false} strokeDasharray="3 3"/>
        <Legend />
        <Line dot={false} type="monotone" dataKey="temperature" stroke="#FFA500" activeDot={{r: 8}}/>
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
