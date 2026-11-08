import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // key: user_id, value: socket.id

const broadcastOnlineCount = () => {
  if (!io) return;
  const count = onlineUsers.size;
  const totalSockets = io.engine?.clientsCount || 0;
  io.emit("admin:online_count", {
    count,
    totalSockets,
  });
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Broadcast current count to newly connected socket
    socket.emit("admin:online_count", {
      count: onlineUsers.size,
      totalSockets: io.engine?.clientsCount || 0,
    });

    socket.on("register", (user_id) => {
      if (user_id) {
        onlineUsers.set(Number(user_id), socket.id);
        broadcastOnlineCount();
      }
    });

    socket.on("disconnect", () => {
      for (const [user_id, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(user_id);
        }
      }

      broadcastOnlineCount();
    });
  });

  return io;
};

const getIO = () => io;

const getOnlineUsers = () => onlineUsers;

const getOnlineUsersCount = () => {
  return {
    registeredOnline: onlineUsers.size,
    totalConnected: io?.engine?.clientsCount || 0,
  };
};

export { initSocket, getIO, getOnlineUsers, getOnlineUsersCount };
