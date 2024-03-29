# Bubbles
Bubbles is a simple webhook visualizer. When the application loads, the user is presented with a URL. When data is posted to that URL, a bubble appears and floats across the screen.

The bubbles can be configured to scale their sizes based on the payload sent to the URL. Adding more bubble configuration options would be cool, and I'm hoping I'll get around to it :)

Occasionally there's a live demo at https://bubbles.rolsdorph.io/. If not, check out these screenshots to get a sense of what this thing is:

![Bubbles flowing across screen](docs/bubbler_bubbling.png)
![Bubble radius configuration](docs/radius_config_dynamic.png)
![Saving a bubble config](docs/persisted_bubble.png)


## Overview

### New webhook flow
Bubbles consists of a client application (mostly pure Javascript, the bubble settings modal uses React) and a server (Node.js).

When the client starts, it opens a WebSocket connection to the server. The server generates a random webhook URL, and sends it to the client over the WebSocket.

Whenever a request arrives on the webhook URL, it's proxied to the client application over the Websocket.

### Persisted webhook flow
The user can choose to save a configuration (the webhook URL + bubble config) in order to avoid getting a new webhook URL next time they reload the page.

When the user clicks the "Share" button, the client sends a persistence request to the backend over the WebSocket. The request contains its current bubble configuration.

The server generates a long persistence key and stores it in a database (mapping the persistence key to the webhook URL and the provided config). It then passes
the persistence key back to the client, which creates a restore URL on the form `{current client Url}?restoreFrom={persistence key}`.

When loading, the client checks for a `restoreFrom` query param, and appends it to the WebSocket URL it connects to (e.g. `ws://hook.example.com/mykey123`).

If the server finds a stored webhook URL and bubble configuration for the provided persistence key, it passes the stored URL and config back to the client instead of creating a random webhook URL

## Development
### Running the server
The first time you run the server, you'll need to install the [ws](https://www.npmjs.com/package/ws) package, which is the WebSocket library used by the server:

```
cd backend
npm install
```

In the future, you just need to execute server.js somehow. I recommend using `nodemon` (included as a dev dependency) for automatically reloading it when you make change:

```
npx nodemon server.js
```

### Building the frontend
The frontend uses Webpack to manage the Bootstrap and React dependencies. Webpack, in turn, delegates to Babel in order to preprocess the React JSX. For development, I recommend:

```
cd frontend
npm install # only first time
npx webpack --watch
```

This will compile every necessary file from `frontend/src` into `frontend/out/bundle.js`.

After this, open [index.html](frontend/index.html) in a browser to run the application. I recommend using some sort of auto-reload functionality for index.html as well (for example, [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VSCode).

## Deploying
Deploying Bubbles consist of a couple of steps:

1) Run the server somewhere publicly accessible
2) Create a production config:

```
cd frontend
cp .env .env.production
```

Edit `.env.production`, pointing WS_URL to the location of the server from step 1

3) Create a production build
```
npx webpack --env production
```

The only difference at the time of writing is that this causes the build to read `.env.production` rather than `.env`, but there might be other differences in the future.

4) At this point, [out](frontend/out) contains the files needed for the client application (index.html and bundle.js). Deploy them somewhere publicly accessible.

5) Bubbler should now be working! Navigate to the place you deployed index.html in step 4 to check it out.

### Instrumentation
The backend can run with basic OTEL instrumentation (the automatic Node.js instrumentation, shipping to Honeycomb).
In order to enable instrumentation, define the relevant environment variables (see [backend/.env](backend/.env)).

To use `dotenv` for reading environment variables (like the frontend does), one approach would be to run the server using

```
npx nodemon -r dotenv/config server.js dotenv_config_path=.env.production`
```
