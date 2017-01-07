# SmartMirror

## Running locally

# Create and fill in a .env file.
```
RuleThemAllBackendAccessToken=''
wunderlistAccessToken=''
wunderlistClientID=''

GOOGLE_APPLICATION_CREDENTIALS = '/home/user/../credentials.json'
GCLOUD_PROJECT = 'project_ID'
```

# Fill in client/config.js
```
export const config = {
	YAHOO_WOEID: '897819',
	SMHI_COORD: {
		longitude: '13.19',
		latitude: '55.7'
	}, 
};
```

# Run it
```
git clone https://github.com/jakkra/SmartMirror.git
cd SmartMirror
npm i

cd client
npm i

cd ..
npm start
```

## Building

Running `npm run build` creates the static bundle.

```
cd client/
npm run build
```

## Solutions
Webpack doesn't reload when saving: 
```
$echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

Auto open chrome in SSH on RaspberryPi:
```
export DISPLAY=:0.0
npm start
```