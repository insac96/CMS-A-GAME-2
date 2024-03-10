import type { Mongoose } from 'mongoose'
import type { IDBSocketChat, IDBSocketOnline } from '~~/types'

export const DBSocketOnline = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketOnline>({ 
    socket_id: { type: 'String' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
  }, {
    timestamps: true
  })

  const model = mongoose.model('socket_onlines', schema)

  const autoCreate = async () => {
    await model.deleteMany()
  }
  autoCreate()

  return model 
}

export const DBSocketChat = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChat>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    text: { type: String },
    type: { type: String, default: 'message' }
  }, {
    timestamps: true
  })

  const model = mongoose.model('socket_chats', schema)
  return model 
}