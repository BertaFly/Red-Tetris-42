import * as express from 'express';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { handleClient } from '@src/server/client';

const app = express();

app.use(express.static('build'));

const server = new Server(app);

const io = require('socket.io')(server);

io.on('connection', (s: Socket) => handleClient(s));

server.listen(8000, () => {
  console.log('Server on port : 8000');
});
