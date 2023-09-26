const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const usersRouter = require("./routes/Users");
const workspacesRouter = require("./routes/Workspaces");
const messagesRouter = require("./routes/Messages");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;
io.origins("http://localhost:3000");

app.use("/users", usersRouter);
app.use("/workspace", workspacesRouter);
app.use("/messages", messagesRouter);

io.on("connection", (socket) => {
  // Should only join a room once
  socket.on("join room", (userRoom) => {
    socket.join(userRoom.room, (err, room) => {
      if (err) console.log(err);
      const joinRoomMessage = {
        request: "joinRoom",
        channelId: userRoom.id,
        name: userRoom.room,
        secondary: `${userRoom.user} joined ${userRoom.room}`,
      };
      socket.to(userRoom.room).emit("joined room", joinRoomMessage);
    });
  });

  socket.on("set rooms", (allUserRooms) => {
    socket.join(allUserRooms);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
  });

  socket.on("new message", (data) => {
    console.log("data  =>>> ", data);
    const roomMessage = {
      request: "newMessage",
      channelId: data.channelId,
      primary: data.username,
      secondary: data.text,
      createdAt: new Date().toISOString(),
      userId: data.userId,
    };
    socket.broadcast.to(data.room).emit("release new message", roomMessage);
  });

  socket.on("user typing", () => {
    console.log("user is typing");
    io.emit("user typing", "user is typing");
  });

  socket.on("stop typing", () => {
    io.emit("stop typing", "no typing");
  });

  socket.on("disconnect", (reason) => {
    console.log("user disconnected");
    console.log(reason);
  });
});

server.listen(port, async () => {
  console.log(`Server is running on port: ${port}`);
});
