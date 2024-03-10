import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

export default async (event: H3Event, action: string, admin?: Types.ObjectId) => {
  const auth = admin ? admin : event.context.auth
  
  await DB.LogAdmin.create({
    user: auth._id,
    action: action
  })
}