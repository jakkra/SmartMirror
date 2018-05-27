import React from 'react';

const styles = {
  message: {
    color: 'white',
    fontSize: '3.5em',
    textAlign: 'center',
  },
};

const Message = ({ props }) => (
  <div hidden={!props.visible} style={styles.message}>
    {props.message}
  </div>
);
export default Message;
