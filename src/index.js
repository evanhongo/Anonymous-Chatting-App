/* eslint-disable no-loop-func */
import { v4 as uuidv4 } from "uuid";
import path from "path";
import express from "express";
import http from "http";
import io from "socket.io";

const app = express();
const server = http.createServer(app);
const myio = io.listen(server);
let userTable = [];
let messages = [];
let myMap = [];

if(process.env.NODE_ENV === "production"){
  app.use(express.static(__dirname + "/../front-end/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"../front-end","build","index.html"));
  });
}

const PORT = process.env.PORT || 4000;
server.listen(PORT,function(){
	console.log(`server is running at port ${PORT}`);
});

myio.on("connection", (socket) => {
  socket.once("init", (userId) => {
    const me = userTable.find((user) => user.userId === userId);
    if(me){
      socket.userId = userId;
      socket.join(socket.userId);//
      myMap[userId].push(socket.id);//
      switch(me.status){
        case "waiting":
          socket.emit("init",{status: me.status, matcher: me.matcher, room: me.room});
          break;
        case "chatting":
          const roomMessages = messages.filter((message)=>message.room === me.room);
          socket.join(me.room);//
          socket.emit("init",{status: me.status, matcher: me.matcher, room: me.room, messages: roomMessages});
          break;
        default:
          socket.emit("init",{status: me.status, matcher: me.matcher, room: me.room});
          break;
      }
    }
    else {
      socket.userId = uuidv4();
      socket.join(socket.userId);//
      myMap[socket.userId] = [];//
      myMap[socket.userId].push(socket.id);//
      userTable.push({ userId: socket.userId, status: "idle", matcher: "", room: "" });
      socket.emit("init",{ userId: socket.userId, status: "idle", matcher: "", room: "" });
    }
    console.log(socket.userId + "進入ChatApp");//
  });

	socket.on("waiting", () => {		 
    const me = userTable.find((user) => user.userId === socket.userId);    
    const matcher = userTable.find((user) => user.status === "waiting");
    console.log(me.userId + "等待配對");//

    if(matcher){
      const room = uuidv4();
      me.status = "chatting";
      me.matcher = matcher.userId;
      me.room = room;
      matcher.status = "chatting";
      matcher.matcher = me.userId;
      matcher.room = room;
      
      for(let socketId of myMap[socket.userId])
        myio.sockets.connected[socketId].join(room);
      for(let socketId of myMap[matcher.userId])
        myio.sockets.connected[socketId].join(room);   
      myio.in(socket.userId).emit("matched", { matcher: matcher.userId, room });   
      myio.in(matcher.userId).emit("matched", { matcher: me.userId, room }); 
      console.log("配對成功");//
    }
    else {
      me.status = "waiting";
      socket.emit("waiting");
    }
  });

  socket.on("cancels", () => {
    const me = userTable.find((user) => user.userId === socket.userId);
    me.status = "idle";
    myio.in(socket.userId).emit("cancels");
    console.log(me.userId + "取消配對");
  });

  socket.on("leaves", () => {
    const me = userTable.find((user) => user.userId === socket.userId);
    const matcher = userTable.find((user) => user.userId === me.matcher);
    messages = messages.filter((message) => message.room !== me.room);//
    for(let socketId of myMap[socket.userId])
      myio.sockets.connected[socketId].leave(me.room);
    for(let socketId of myMap[matcher.userId])
      myio.sockets.connected[socketId].leave(me.room);
    myio.in(socket.userId).emit("leaves");
    myio.in(matcher.userId).emit("matcher leaves");
  
    me.status = "idle";
    me.matcher = "";
    me.room = "";
    matcher.status = "idle";
    matcher.matcher = "";
    matcher.room = "";
    console.log(me.userId + "離開聊天室");
  });

  socket.on("message", (text) => {
    const me = userTable.find((user) => user.userId === socket.userId);
    const message = {id: uuidv4(), userId: me.userId, room: me.room, text};
    messages.push(message);    
    myio.in(me.room).emit("message",message);
  });

	socket.on("disconnect", () => {
    console.log(socket.userId + "離開ChatApp");
    myMap[socket.userId].splice(myMap[socket.userId].indexOf(socket.id),1);//
	});
});