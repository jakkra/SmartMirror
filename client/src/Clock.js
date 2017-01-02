import React from 'react';

import moment from 'moment'

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
      <div>
        <h1 className='Clock'>{this.state.date.format('HH:mm')}</h1>
        <h1 className='Clock'>{this.state.date.format('LL')}</h1>
      </div>
    );
  }
}