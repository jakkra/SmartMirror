import React from 'react';
import Clock from './Clock';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('Constructor');
    this.state = {
      test: 'HEJ',
    };
  }

  render() {
    return (
      <div className='App'>
        <Clock/>
      </div>
    );
  }
}
