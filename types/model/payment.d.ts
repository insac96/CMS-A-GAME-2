import type { Types } from 'mongoose'

export interface IDBPaymentConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  maintenance: boolean
  pay: {
    number: number
    expired: Date
  }
}

export interface IDBPayment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  gate: Types.ObjectId
  user: Types.ObjectId
  card: {
    net: string
    seri: string
    pin: string
  }
  money: number
  code: string
  token: string
  qrcode: string
  status: number,
  verify: {
    person: Types.ObjectId
    time: Date
    reason: string
  }
}