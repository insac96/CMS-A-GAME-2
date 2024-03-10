import type { Types } from 'mongoose'

export interface IDBNewsCategory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  name: string
  color: string
}

export interface IDBNews {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  category: Types.ObjectId
  title: string
  description: string 
  og_image: string
  keywords: string[]
  content: string
  view: number
  pin: number
  creator: Types.ObjectId
  updater: Types.ObjectId
  display: number
}
