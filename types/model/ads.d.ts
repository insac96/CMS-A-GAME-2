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
  notice: string
  facebook_ads: string
  google_ads: string
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