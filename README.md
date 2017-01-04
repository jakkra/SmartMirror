# SmartMirror

## Running locally

```
git clone thsi repo
cd SmartMirror
npm i

cd client
npm i

cd ..
npm start
```

## Building


Running `npm run build` creates the static bundle which we can then use any HTTP server to serve:

```
cd client/
npm run build
```

## Solutions
Webpack doesn't reload when saving: $echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p