import React from 'react';

export default class BaseComponent extends React.Component {
  static propTypes = {
    visible: React.PropTypes.bool
  };

  static defaultProps = {
    visible: true
  };

  onEvent(event){
    
  }

}