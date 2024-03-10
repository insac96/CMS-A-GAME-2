import type { Mongoose } from 'mongoose'
import type { IDBNotifyUser, IDBNotifyAdmin } from '~~/types'

export const DBNotifyUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBNotifyUser>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    to: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      watched: { type: Number, default: 0 }
    }],
    type: { type: Number, default: 0, index: true }, // 0-Default, 1-News, 2-Private, 3-Bot
    color: { type: String, default: 'gray' },
    title: { type: String },
    content: { type: String },
    link: { type: String },
    pin: { type: Number, default: 0, index: true }, // 0-False, 1-True
    global: { type: Number, default: 0, index: true }, // 0-False, 1-True
  }, {
    timestamps: true
  })

  const model = mongoose.model('user_notifies', schema)
  return model 
}

export const DBNotifyAdmin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBNotifyAdmin>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    type: { type: Number, default: 0, index: true }, // 0-Default, 1-Register, 2-Payment
    color: { type: String, default: 'gray' },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('admin_notifies', schema)
  return model 
}