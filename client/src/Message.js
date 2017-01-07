import React from 'react';

const styles = {
  message: {
    marginLeft: 40,
    color: 'white',
    fontSize: '5.5em',
    textAlign: 'center'
  },
}

const Message = ({props}) => (
  <div hidden={!props.visible} style={styles.message}>{props.message}</div>
);
export default Message;

