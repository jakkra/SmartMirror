import React from 'react';

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
        <div className='text'>
          {this.state.test}
        </div>
      </div>
    );
  }
}
