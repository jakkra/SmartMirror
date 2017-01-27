# SmartMirror

# Running locally

## Create and fill in a .env file.
```
RuleThemAllBackendAccessToken=''
wunderlistAccessToken=''
wunderlistClientID=''

GOOGLE_APPLICATION_CREDENTIALS = '/home/user/../credentials.json'
GCLOUD_PROJECT = 'project_ID'

target='Krantz-Ubuntu' // Set to 'PI' on your Raspberry Pi. Avoids errors initializing gpio when not on Pi.
```

## Fill in client/config.js
```
export const config = {
	YAHOO_WOEID: '897819',
	SMHI_COORD: {
		longitude: '13.19',
		latitude: '55.7'
	},
	serverBaseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:3001' : 'http://localhost:3000',
	wsServerBaseURL: process.env.NODE_ENV === 'production' ? 'localhost:3001/' : 'localhost:3001/'
};
```

## 

## Run it
```
git clone https://github.com/jakkra/SmartMirror.git
cd SmartMirror
npm i

cd client
npm i

cd ..
npm start
```

# Building

Running `npm run build` creates the static bundle.

```
cd client/
npm run build
```

# Solutions
Webpack doesn't reload when saving: 
```
$echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

Auto open chrome in SSH on RaspberryPi:
```
export DISPLAY=:0.0
npm start
```

# Useful commands
```
$ sudo apt-get install unclutter
$ unclutter -display :0.0 -idle 5 # Hides cursor after 5 seconds of inactivity

$ export DISPLAY=:0.0 # When starting chromium over SSH. this must be done
$ chromium-browser --kiosk --incognito http://localhost:3001 # Launch Chromium in kiosk mode

$ sudo apt-get install -y fonts-tlwg-sawasdee # Installs the font I use.
```