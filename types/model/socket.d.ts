import type { Types } from 'mongoose'


export interface IDBSocketOnline {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  socket_id: string
  user: Types.ObjectId
}

export interface IDBSocketChat {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  text: string
  type: string
}