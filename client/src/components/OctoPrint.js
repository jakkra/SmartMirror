import React from 'react';

import BaseComponent from './BaseComponent';
import { get3DPrinterState } from '../lib/fetch';
import FA from 'react-fontawesome';

const styles = {
  container: {
  },
  listName: {
    color: 'white',
    fontSize: '2.1em',
    textAlign: 'right',
  },
  listItem: {
    color: 'white',
    fontSize: '1.8em',
    textAlign: 'right',
  },
  icon: {
    color: 'white',
    marginLeft: 15,
    fontSize: '0.9em',
  },
};

export default class OctoPrint extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentPrinterState: {},
      currentJob: {}
    };
    this.refreshPrinterState = this.refreshPrinterState.bind(this);
  }

  componentDidMount() {
    this.refreshTimer = setInterval(() => this.refreshPrinterState(), 1000 * 10);
    this.refreshPrinterState();
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  refreshPrinterState() {
    get3DPrinterState()
      .then(state => this.setState({ currentPrinterState: state.state, currentJob: state.job }))
      .catch(err => {
        console.log('Printer offline', err);
        this.setState({ currentPrinterState: {}, currentJob: {} })
      });
  }

  render() {
    if (!this.state.currentPrinterState.state || !this.state.currentPrinterState.state.flags.printing) return null;
    let progress = null;
    if (this.state.currentJob && this.state.currentJob.job.file.name) {
      progress = (
        <div style={styles.listName}>
          {'Printing ' + this.state.currentJob.job.file.name + ' ' + Math.round(this.state.currentJob.progress.completion)} %
          <FA name="spinner" spin style={styles.icon} />
        </div>
      );
    } else {
      progress = (
        <div style={styles.listName}>
          Printer idle
          <FA name="bed" style={styles.icon} />
        </div>
      );
    }
    return (
      <div hidden={!this.props.visible} style={styles.container}>
        {progress}

        <div style={styles.listItem}>
          Nossle {this.state.currentPrinterState.temperature.tool0.actual}°C
          <FA name="thermometer-half" style={styles.icon} />
        </div>
        <div style={styles.listItem}>
          Bed {this.state.currentPrinterState.temperature.bed.actual}°C
          <FA name="thermometer-half" style={styles.icon} />
        </div>
      </div>
    );
  }
}
