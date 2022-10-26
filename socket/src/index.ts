import "reflect-metadata";

import http from "http";
import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";

import {
  createConnection,
  getConnection,
  getRepository,
  getMongoRepository,
} from "typeorm";
import { mgConfig } from "./config";
//import {User} from './user'

import { Conversation, Message } from "./conversation";

interface ISocket extends Socket {
  username?: string;
  // other additional attributes here, example:
  // surname?: string;
}

async function main() {
  //  how to handle authentication
  // should it be that try catch be here?
  //connection
  const conn = await createConnection(mgConfig);
  const convoRepository = getMongoRepository(Conversation, "dbMgCon");
  // Socket
  const app = express();
  app.use(cors());
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:19006",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  /*
  io.use((socket:any, next) => {
    const username = socket.handshake.auth.username;
    console.log('username', username)
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

*/

  io.on("connection", (socket: ISocket) => {
    console.log(socket);
    console.log(`User Connected: ${socket.id}`);
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    // either with send()
    //console.log(socket.username)
    //socket.send("Hello!");

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", async (data) => {
      console.log("send_message");
      const { room, ...mdata } = data;
      console.log(room);
      socket.to(data["room"]).emit("receive_message", mdata);
      const convoToAdd: any = await convoRepository.findOne(room);
      convoToAdd.messages = [
        ...convoToAdd.messages,
        new Message(mdata["sender"], mdata["text"]),
      ];
      await convoRepository.save(convoToAdd);
    });
  });

  server.listen(process.env.PORT || 5000, () => {
    console.log("Server Started on port 5000");
  });
}

main();
