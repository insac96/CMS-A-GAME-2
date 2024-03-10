import type { Types } from 'mongoose'
import type { IDBItem } from './item'

export interface IDBEventConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  type: string
  name: string
  start: Date
  end: Date
  display: number
}

export interface IDBEvent {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  type: string
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  need: number
  display: number
}

export interface IDBEventHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  event: Types.ObjectId
  server: string
  role: string
}