import type { Server as SocketServer, Socket } from 'socket.io'
import OnlineAction from './online'

export default (event : any, io : SocketServer) => {
  io.on('connection', (socket : Socket) => {
    OnlineAction(io, socket)
  })

  global.IO = io
}