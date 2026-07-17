import { getIO, getOnlineUsers } from "../config/socket.js"

const emitNotification = (user_id, data) => {
    const io = getIO()
    const onlineUsers = getOnlineUsers()

    const socketId = onlineUsers.get(user_id)

    if (socketId) {
        io.to(socketId).emit("notification:new", data)
    }
}

export default emitNotification 