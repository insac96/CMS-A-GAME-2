import type { Types } from 'mongoose'

export interface IDBAdsTeaser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  code: string
  link: string
  view: number
  sign: {
    up: number
  }
  gift: [{
    item: Types.ObjectId | IDBItem,
    amount: number
  }]
}

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