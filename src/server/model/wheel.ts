import type { Mongoose } from 'mongoose'
import type { IDBWheel, IDBWheelHistory, IDBWheelLuckyUser } from '~~/types'

export const DBWheel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBWheel>({ 
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('wheels', schema)
  return model 
}

export const DBWheelHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBWheelHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('wheel_histories', schema)
  return model 
}

export const DBWheelLuckyUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBWheelLuckyUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true },
    action: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('wheel_lucky_users', schema)
  return model 
}