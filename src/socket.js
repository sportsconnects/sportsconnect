import { io } from "socket.io-client"

const URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"

let socket = null

export const connectSocket = (token) => {
  if (socket?.connected) return socket

  socket = io(URL, {
    auth:                  { token },
    transports:            ["websocket", "polling"], // try websocket first, fall back to polling
    reconnection:          true,
    reconnectionDelay:     1000,
    reconnectionAttempts:  Infinity,
    timeout:               20000,
    forceNew:              false,
  })

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id)
  })

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason)
    // If server closed it, reconnect manually
    if (reason === "io server disconnect") {
      socket.connect()
    }
  })

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket