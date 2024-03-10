import type { Types } from 'mongoose'

export interface IDBWheel {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  item: Types.ObjectId
  amount: number
  percent: number
  lose: number
  display: number
}

export interface IDBWheelHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  item: Types.ObjectId
  amount: number
  percent: number
  server: string
  role: string
}

export interface IDBWheelLuckyUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  action: string
}