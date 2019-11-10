const zigbeeConfig = {
  devices:[
  {
    ieeeAddr: '0x14b457fffe7c928a',
    longPressFunctionality: {
      type: 'sonos',
      sonosIp: '192.168.1.206',
    },
    endpointsOn: [
      'http://192.168.1.129/cm?cmnd=Power%20On',
      'http://192.168.1.188/cm?cmnd=Power%20On',
      'http://192.168.1.180:80/msg?code=4C:RC5:12',
      'http://192.168.1.30:8080/hyperion/on'
    ],
    endpointsOff: [
      'http://192.168.1.129/cm?cmnd=Power%20off',
      'http://192.168.1.188/cm?cmnd=Power%20off',
      'http://192.168.1.180:80/msg?code=4C:RC5:12',
      'http://192.168.1.30:8080/hyperion/off'
    ],
  },
  {
    ieeeAddr: '0xccccccfffe2d74f8',
    longPressFunctionality: {
      type: 'sonos',
      sonosIp: '192.168.1.120',
    },
    endpointsOn: [
      'http://192.168.1.199/cm?cmnd=Power%20On',
    ],
    endpointsOff: [
      'http://192.168.1.199/cm?cmnd=Power%20off',
    ]
  },
  {
    ieeeAddr: '0x14b457fffe5d4e14',
    longPressFunctionality: {
      type: 'wledBrightness',
      wledIp: 'http://192.168.1.187',
    },
    endpointsOn: [
      'http://192.168.1.187/win&T=1',
    ],
    endpointsOff: [
      'http://192.168.1.187/win&T=0',
    ]
  },
]};

module.exports = zigbeeConfig;