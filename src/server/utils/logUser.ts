import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

export default async (event: H3Event, user: Types.ObjectId, action: string) => {
  await DB.LogUser.create({
    user: user,
    action: action
  })
}