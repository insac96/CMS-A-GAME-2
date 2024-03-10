import type { H3Event } from 'h3'
import type { IDBNotifyUser, IDBUser, ISendNotifyUser } from '~~/types'

export default async (event: H3Event, sendData: ISendNotifyUser) : Promise<void> => {
  let from : IDBNotifyUser['from'],
  to : IDBNotifyUser['to']

  // Set From
  if(!sendData.from){
    const bot = await DB.User.findOne({ username: 'bot' }).select('_id') as IDBUser
    from = bot._id
  }
  else {
    from = sendData.from
  }

  // Set To
  if(!!sendData.to){
    to = sendData.to.map(i => { return { user: i, watched: 0 }})
  }
  else {
    to = []
  }

  // Create Notify User
  await DB.NotifyUser.create({
    from: from,
    to: to,
    title: sendData.title,
    content: sendData.content,
    type: sendData.type,
    color: sendData.color,
    link: sendData.link
  })

  return Promise.resolve()
}