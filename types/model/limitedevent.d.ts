import type { Types } from 'mongoose'

export interface IDBLimitedEventLuckyMoney {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  item: Types.ObjectId
  amount: number
  percent: number
}

export interface IDBLimitedEventPayment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  need: number
}

export interface IDBLimitedEventPayMission {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  need: number
}

export interface IDBLimitedEventEgg {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  price1: number
  price2: number
  price3: number
  price4: number
  price5: number
  row1: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
    percent: number
  }>
  row2: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
    percent: number
  }>
  row3: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
    percent: number
  }>
  row4: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
    percent: number
  }>
  row5: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
    percent: number
  }>
}