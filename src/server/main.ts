import express from "express";
import { Socket } from 'socket.io';
import { Server } from "http";

import handleClient from "./handleClient"

const app = express();

app.use(express.static("build"));

const server = new Server(app);

const io = require("socket.io")(server);

io.on("connection", (socket: Socket) => handleClient(socket));

server.listen(8080, () => {
  console.log("listen to port 8080");
});
