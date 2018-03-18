import React from 'react';

import { getCurrentPlaying } from '../lib/fetch';
import FA from 'react-fontawesome';

const styles = {
  container: {
	  marginLeft: -15,
  },
  songName: {
    color: 'white',
    fontSize: '2em',
    textAlign: 'left',
  },
  musicIcon: {
    color: 'white',
    marginLeft: 0,
    fontSize: '0.9em',
    paddingRight: 15
  },
}

export default class Spotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	currentPlaying: null,

    };
    this.refreshPlaying = this.refreshPlaying.bind(this);
    this.handleSpotifyCurrentData = this.handleSpotifyCurrentData.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.refreshPlaying(),
      1000 
    );
    this.refreshPlaying();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  refreshPlaying() {
  	getCurrentPlaying()
  	.then(this.handleSpotifyCurrentData)
  	.catch((err) => console.log(err));
  }

  handleSpotifyCurrentData(currentPlaying){
  	console.log("Got data", currentPlaying)
  	this.setState({
  		currentPlaying: currentPlaying
  	})
  }

  render() {
  	if (this.state.currentPlaying === null) return null;
  	let icon = null;
  	const iconName = this.state.currentPlaying.is_playing ? 'play' : 'pause';
    return (
      <div hidden={!this.props.visible}  style={styles.container}>
        <div style={styles.songName}>
          <FA
            name={iconName}
            style={styles.musicIcon}
          />
          {this.state.currentPlaying.item.name} av {this.state.currentPlaying.item.artists[0].name}
        </div>
      </div>
    );
  }
}
