import type { Types } from 'mongoose'

export interface IDBAdsLanding {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  code: string
  link: string
  view: number
  sign: {
    in: number
    up: number
  }
}

export interface IDBAdsFrom {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  code: string
  note: string
  view: number
  sign: {
    in: number
    up: number
  }
}