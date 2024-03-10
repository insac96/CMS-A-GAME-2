import type { Types } from 'mongoose'
import type { IDBLevel } from './level'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  username: string
  password: string
  email: string
  phone: string
  avatar: string
  level: Types.ObjectId | IDBLevel
  reg: {
    teaser: Types.ObjectId
    landing: Types.ObjectId
    from: Types.ObjectId
    platform: string
  }
  social: {
    facebook: string
    zalo: string
    google: string
    tiktok: string
  }
  referral: {
    code: string
    person: Types.ObjectId
    count: number
    receive_gift: number
  }
  currency: {
    coin: number
    wheel: number
    notify: number
    diamond: number
  }
  limitedevent: {
    luckymoney: number
    payment: {
      day: number
      receive: number
    }
    paymission: Array<{
      money: number
      receive: boolean
    }>
    egg: {
      1: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
        index: number
      }>
      2: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
        index: number
      }>
      3: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
        index: number
      }>
      4: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
        index: number
      }>
      5: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
        index: number
      }>
    }
  }
  pay: {
    total: {
      money: number
      count: number
    },
    day: {
      money: number
      count: number
    },
    month: {
      money: number
      count: number
    }
  }
  spend: {
    total: {
      coin: number
      count: number
    },
    day: {
      coin: number
      count: number
    },
    month: {
      coin: number
      count: number
    }
  }
  wheel: {
    total: number
    day: number
    month: number
  }
  dice: {
    total: {
      coin: number
      count: number
    },
    day: {
      coin: number
      count: number
    },
    month: {
      coin: number
      count: number
    }
  }
  login: {
    month: number
    total: number
    update: Date
    last_ip: string
  }
  type: number
  block: number
  token: string
  // Function
  save: {
    () : void
  }
}

export interface IDBUserLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : string
  level? : number
  type?: number
  referral_code?: string
  notify?: number
}