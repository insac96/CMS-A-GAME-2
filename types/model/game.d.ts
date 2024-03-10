import type { Types } from 'mongoose'

export interface IDBGameServerLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
}

export interface IDBGameRankGift {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  server: string
  type: string
  start: number
  end: number
  expired: Date
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
}

export interface IDBGameRankGiftHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  rankgift: Types.ObjectId
  user: Types.ObjectId
  server: string
  role: string
  rank: number
}