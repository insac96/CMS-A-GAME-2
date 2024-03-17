import type { Types } from 'mongoose'

export interface IDBLevel {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  number: number
  need: {
    login: number
    pay: {
      money: number
      count: number
    }
    spend: {
      coin: number
      count: number
    }
  }
  limit: {
    pay: {
      day: {
        money: number
        count: number
      },
      month: {
        money: number
        count: number
      }
    },
    spend: {
      day: {
        coin: number
        count: number
      },
      month: {
        coin: number
        count: number
      }
    },
    wheel: {
      day: number
      month: number
    }
  }
  bonus: number
  bonus_wheel: number
  discount: number
}