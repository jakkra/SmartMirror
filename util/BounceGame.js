const LEDS_TOP = 16;
const LEDS_SIDE_SIDE_START = 7;
const LEDS_SIDE = 22;

module.exports = (mirrorSocket, serialHandler) => {
  return {
    handleBounce: function(data) {
      const x = data.x;
      const y = data.y;
      const side = data.side;
      switch(side) {
      	case 'top':
      	  serialHandler.writeString('setLed:' + Math.round(x * LEDS_TOP + LEDS_SIDE));
      	break;
      	case 'right':
      		if (Math.round(y * LEDS_SIDE) < LEDS_SIDE_SIDE_START){
      			serialHandler.writeString('setLed:' + Math.round(LEDS_SIDE - y * LEDS_SIDE));
      		}
      	break;
      	case 'left':
      		if (Math.round(y * LEDS_SIDE) < LEDS_SIDE_SIDE_START){
      			serialHandler.writeString('setLed:' + Math.round(LEDS_SIDE + LEDS_TOP + y * LEDS_SIDE));
      		}
      	break;
      	case 'bottom':
      		serialHandler.writeString('rgb:226:88:34');
      	break;
      }
    },
  }
}
