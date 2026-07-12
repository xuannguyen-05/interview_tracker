import {Server} from "socket.io"

let io
const onlineUsers = new Map()

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("register", (user_id) => {
      onlineUsers.set(user_id, socket.id)
    })

    socket.on("disconnect", () => {
      for (const [user_id, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(user_id)
        }
      }
    })
  })

  return io
}

const getIO = () => io

const getOnlineUsers = () => onlineUsers

export {
  initSocket,
  getIO,
  getOnlineUsers
}