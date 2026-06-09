import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
  autoConnect: false // we connect manually after login
})

export default socket