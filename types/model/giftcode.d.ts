import type { Types } from 'mongoose'
import type { IDBItem } from './item'

export interface IDBGiftcode {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  code: string
  limit: number
  server: Array<Types.ObjectId>
  public: boolean
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  expired: Date
  display: number
}

export interface IDBGiftcodeHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  giftcode: Types.ObjectId
  server: string
  role: string
}