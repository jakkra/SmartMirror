import React from 'react';

const styles = {
  redCircle: {
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    backgroundColor: 'red',
  },
};

const RecordingStatus = ({ isRecording }) => <canvas hidden={!isRecording} style={styles.redCircle} />;
export default RecordingStatus;
