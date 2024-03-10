import type { Server as SocketServer, Socket } from 'socket.io'
import type { Types } from 'mongoose'

const getCountOnline = async () => {
  const online = await DB.SocketOnline
  .aggregate([
    { $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      pipeline: [{
        $project: { type: 1 },
      }],
      as: "user"
    }},
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true }},
    { $addFields: {
      type: { $cond: [{$not: ["$user"]}, -1, '$user.type']},
    }},
    { $project: {
      guest: { $cond: [{$eq: ['$type', -1]} , 1, 0] },
      member: { $cond: [{$eq: ['$type', 0]} , 1, 0] },
      admin: { $cond: [{$gt: ['$type', 0]} , 1, 0] },
    }},
    { $group: {
      _id: null,
      guest: { $sum: '$guest' },
      member: { $sum: '$member' },
      admin: { $sum: '$admin' }
    }}
  ])

  return {
    guest: online[0] ? online[0].guest : 0,
    member: online[0] ? online[0].member : 0,
    admin: online[0] ? online[0].admin : 0
  }
}

export default (io : SocketServer, socket : Socket) => {
  socket.on('join-online', async (id : Types.ObjectId | null) => {
    if(!id){
      await DB.SocketOnline.create({ socket_id: socket.id })
    }
    else {
      const user = await DB.User.findOne({ _id: id }).select('_id')
      if(!user) return
      const userOnline = await DB.SocketOnline.findOne({ user: user._id }).select('_id')
      if(!userOnline){
        await DB.SocketOnline.create({ socket_id: socket.id, user: user._id })
      }
      else {
        await DB.SocketOnline.updateOne({ user: user._id },{ socket_id: socket.id })
      }
    }

    const online = await getCountOnline()
    io.emit('online', online)
  })

  socket.on('update-online', async () => {
    const online = await getCountOnline()
    io.emit('online', online)
  })

  socket.on('login', async (id : Types.ObjectId) => {
    const user = await DB.User.findOne({ _id: id }).select('_id')
    if(!user) return

    await DB.SocketOnline.updateOne({ socket_id: socket.id }, { user: user.id })

    const online = await getCountOnline()
    io.emit('online', online)
  })

  socket.on('disconnect', async () => {
    await DB.SocketOnline.deleteOne({ socket_id: socket.id })

    const online = await getCountOnline()
    io.emit('online', online)
  })
}