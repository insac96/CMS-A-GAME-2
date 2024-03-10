import type { Types } from 'mongoose'

export interface IDBLogAdmin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  action: string
}

export interface IDBLogAdminSendItem {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  from: Types.ObjectId
  to: Types.ObjectId
  server: string
  role: string
  reason: string
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
}

export interface IDBLogUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  action: string
}

export interface IDBLogUserIP {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  ip: string
}

export interface IDBLogBlockIP {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  ip: string
}