const zigbeeConfig = {
  devices:[
  {
    ieeeAddr: '0x14b457fffe7c928a',
    longPressFunctionality: {
      type: 'sonos',
      sonosIp: '192.168.1.206',
    },
    endpointsOn: [
      { type: 'url', url: 'http://192.168.1.129/cm?cmnd=Power%20On'},
      { type: 'url', url: 'http://192.168.1.188/cm?cmnd=Power%20On'},
      { type: 'url', url: 'http://192.168.1.180:80/msg?code=4C:RC5:12'},
      { type: 'url', url: 'http://192.168.1.30:8080/hyperion/on'},
    ],
    endpointsOff: [
      { type: 'url', url: 'http://192.168.1.129/cm?cmnd=Power%20off'},
      { type: 'url', url: 'http://192.168.1.188/cm?cmnd=Power%20off'},
      { type: 'url', url: 'http://192.168.1.180:80/msg?code=4C:RC5:12'},
      { type: 'url', url: 'http://192.168.1.30:8080/hyperion/off'},
    ],
  },
  {
    ieeeAddr: '0xccccccfffe2d74f8',
    longPressFunctionality: {
      type: 'sonos',
      sonosIp: '192.168.1.120',
    },
    endpointsOn: [
      { type: 'url', url: 'http://192.168.1.199/cm?cmnd=Power%20On'},
    ],
    endpointsOff: [
      { type: 'url', url: 'http://192.168.1.199/cm?cmnd=Power%20off'},
    ]
  },
  {
    ieeeAddr: '0x14b457fffe5d4e14',
    longPressFunctionality: {
      type: 'wledBrightness',
      wledIp: 'http://192.168.1.187',
    },
    endpointsOn: [
      { type: 'url', url: 'http://192.168.1.187/win&T=1' },
    ],
    endpointsOff: [
      { type: 'url', url: 'http://192.168.1.187/win&T=0' },
    ]
  },
  {
    ieeeAddr: '0x000d6ffffe52a40d',
    longPressFunctionality: {
      type: 'sonos',
      sonosIp: '192.168.1.206',
    },
    endpointsLevelUp: [
      { type: 'url', url: 'http://192.168.1.129/cm?cmnd=Power%20On'},
      { type: 'url', url: 'http://192.168.1.188/cm?cmnd=Power%20On'},
      { type: 'url', url: 'http://192.168.1.180:80/msg?code=4C:RC5:12'},
      { type: 'url', url: 'http://192.168.1.30:8080/hyperion/on'},
      { type: 'hue', name: 'star-livingroom', action: 'on'},
      { type: 'hue', name: 'star-kitchen', action: 'on'},
    ],
    endpointsLevelDown: [
      { type: 'url', url: 'http://192.168.1.129/cm?cmnd=Power%20off'},
      { type: 'url', url: 'http://192.168.1.188/cm?cmnd=Power%20off'},
      { type: 'url', url: 'http://192.168.1.180:80/msg?code=4C:RC5:12'},
      { type: 'url', url: 'http://192.168.1.30:8080/hyperion/off'},
      { type: 'hue', name: 'star-livingroom', action: 'off'},
      { type: 'hue', name: 'star-kitchen', action: 'off'},
    ],
    endpointsLeft: [
      { type: 'hue', name: 'star-livingroom', action: 'briDown'},
      { type: 'hue', name: 'star-kitchen', action: 'briDown'},
    ],
    endpointsRight: [
      { type: 'hue', name: 'star-livingroom', action: 'briUp'},
      { type: 'hue', name: 'star-kitchen', action: 'briUp'},
    ],
    endpointsToggleOn: [
      { type: 'hue', name: 'star-livingroom', action: 'on'},
      { type: 'hue', name: 'star-kitchen', action: 'on'},
    ],
    endpointsToggleOff: [
      { type: 'hue', name: 'star-livingroom', action: 'off'},
      { type: 'hue', name: 'star-kitchen', action: 'off'},
    ],
  },
]};

module.exports = zigbeeConfig;