import { Server as SocketServer } from 'socket.io'
import type { Server } from 'http'
import SocketHandler from '../socket'

declare global {
  var IO : SocketServer
}

export default defineEventHandler(async (event) => {
  if(!global.IO){
    const httpServer = (event.node.req.socket as any).server as Server
    
    if(!!httpServer){
      const io = new SocketServer(httpServer, {})
      SocketHandler(event, io)
    }
  }
})