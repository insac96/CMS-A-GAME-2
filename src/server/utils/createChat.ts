import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

export default async (event: H3Event, user : Types.ObjectId | string, text: string, notify : boolean = false) : Promise<void> => {
  const match : any = {}
  if(user == 'bot') match['username'] = 'bot'
  else match['_id'] = user

  const userdata = await DB.User
  .findOne(match)
  .select('username level avatar type')
  .populate({
    path: 'level',
    select: 'number'
  })

  if(!!userdata){
    const chat = await DB.SocketChat.create({
      user: userdata._id,
      text: text,
      type: !!notify ? 'notify' : 'message'
    })

    IO.emit('chat-push', {
      _id: chat._id,
      user: userdata,
      text: text,
      type: !!notify ? 'notify' : 'message'
    })
  }
}