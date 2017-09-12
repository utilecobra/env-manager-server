import * as http from 'http';

import App from './App';

const port = 3000;
App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('listening', onListening);

function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
