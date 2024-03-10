import type { Types } from 'mongoose'

export interface IDBNotifyUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  from: Types.ObjectId
  to: {
    user?: Types.ObjectId
    watched?: number
  }[]
  type: number
  color: string
  title: string
  content: string
  link: string
  pin: number
  global: number
}

export interface IDBNotifyAdmin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  from: Types.ObjectId
  type: number
  color: string
  content: string
}