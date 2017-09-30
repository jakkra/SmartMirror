import React from 'react';

import BaseComponent from './BaseComponent';
import { getJourney } from '../lib/fetch';
import FA from 'react-fontawesome';

const styles = {
  container: {
    marginLeft: -15,
    marginTop: '30%',
  },
  route: {
    color: 'white',
    fontSize: '1.7em',
    textAlign: 'left',
  },
  listName: {
    color: 'white',
    fontSize: '2.4em',
    textAlign: 'left'
  },
  trainIcon: {
    color: 'white',
    marginLeft: 15,
    fontSize: '0.9em'
  },
}

export default class Transfers extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    	transfers: [],
    };
    this.refreshTransfers = this.refreshTransfers.bind(this);
    this.renderToptransfers = this.renderToptransfers.bind(this);
  }

  componentDidMount() {
    this.refreshTimer = setInterval(
      () => this.refreshTransfers(),
      1000 * 10 
    );
    this.refreshTransfers();
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  refreshTransfers() {
  	getJourney()
  	.then(t => this.setState({ transfers: t}))
  	.catch((err) => console.log("hehehe", err));
  }

  getMinutesDiff(date){
    const today = new Date();
    const diffMs = (date - today);
    // const diffDays = Math.floor(diffMs / 86400000);
    // const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    return diffMins;
  }


  renderToptransfers() {
    let time;
    return this.state.transfers.map((route, i) => {
      time = new Date(route.DepDateTime[0])
    	return (
    		<div key={route.JourneyKey[0]}>
    			<div style={styles.route}> {'Om ' + this.getMinutesDiff(time) + ' minuter'} </div>
    		</div>
    	);
    });
  }

  render() {
    if (this.state.transfers.length < 1) return null;
    return (
      <div hidden={!this.props.visible} style={styles.container}>
      	<div style={styles.listName}>
          Malmö C
          <FA
            name='train'
            style={styles.trainIcon}
          />
        </div>
        {this.renderToptransfers(this.state.transfers)}
      </div>
    );
  }
}
