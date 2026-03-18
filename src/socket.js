import { io } from "socket.io-client"

const URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"

let socket = null

export const connectSocket = (token) => {
  if (socket?.connected) return socket

    if (socket) {
    socket.disconnect()
    socket = null
  }

  
  socket = io(URL, {
    auth:                  { token },
    transports:            ["polling", "websocket"], 
    reconnection:          true,
    reconnectionDelay:     2000,
    reconnectionAttempts:  Infinity,
    timeout:               30000,
    forceNew:              false,
    upgrade:               true,  
  })

  socket.on("connect", () => {
    console.log("Socket connected via:", socket.io.engine.transport.name)
  })

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason)
    if (reason === "io server disconnect") {
      socket.connect()
    }
  })

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message)
  })

  socket.on("connect", () => {
  console.log("Socket connected via:", socket.io.engine.transport.name)
  
  // Listen for transport upgrade
  socket.io.engine.on("upgrade", (transport) => {
    console.log("Socket upgraded to:", transport.name)
  })
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