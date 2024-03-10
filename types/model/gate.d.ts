import type { Types } from 'mongoose'

export interface IDBGate {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  type: number
  name: string
  person: string
  number: string
  key: string
  qrcode: string
  display: number
  bonus: {
    default: number
    limit: {
      number: number,
      expired: Date
    }
  }
}