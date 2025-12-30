import { Server } from "socket.io";

let io;

const socketConfig = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join_room", (debateId) => {
      socket.join(debateId);
    });

    socket.on("new_argument", (data) => {
      io.to(data.debateId).emit("receive_argument", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

export { socketConfig };
