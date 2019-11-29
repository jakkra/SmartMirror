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
  {
    ieeeAddr: '0x90fd9ffffeea9ede',
    longPressFunctionality: {
      type: 'sonos',
      sonosIp: '192.168.1.120',
    },
    endpointsLevelUp: [
      { type: 'hue', name: 'Lekrum-spot-right', action: 'on'},
      { type: 'hue', name: 'Lekrum-spot-middle', action: 'on'},
      { type: 'hue', name: 'Lekrum-spot-left', action: 'on'},
      { type: 'url', url: 'http://192.168.1.33/win&T=1'},
      { type: 'url', url: 'http://192.168.1.196/win&T=1'},
      { type: 'url', url: 'http://192.168.1.62/win&T=1'},
    ],
    endpointsLevelDown: [
      { type: 'hue', name: 'Lekrum-spot-right', action: 'off'},
      { type: 'hue', name: 'Lekrum-spot-middle', action: 'off'},
      { type: 'hue', name: 'Lekrum-spot-left', action: 'off'},
      { type: 'url', url: 'http://192.168.1.33/win&T=0'},
      { type: 'url', url: 'http://192.168.1.196/win&T=0'},
      { type: 'url', url: 'http://192.168.1.62/win&T=0'},
    ],
    endpointsLeft: [
      { type: 'hue', name: 'Lekrum-spot-right', action: 'briDown'},
      { type: 'hue', name: 'Lekrum-spot-middle', action: 'briDown'},
      { type: 'hue', name: 'Lekrum-spot-left', action: 'briDown'},
    ],
    endpointsRight: [
      { type: 'hue', name: 'Lekrum-spot-right', action: 'briUp'},
      { type: 'hue', name: 'Lekrum-spot-middle', action: 'briUp'},
      { type: 'hue', name: 'Lekrum-spot-left', action: 'briUp'},
    ],
    endpointsToggleOn: [
      { type: 'url', url: 'http://192.168.1.196/win&T=1'},
    ],
    endpointsToggleOff: [
      { type: 'url', url: 'http://192.168.1.196/win&T=0'},
    ],
  },
]};

module.exports = zigbeeConfig;