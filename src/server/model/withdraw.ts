import type { Mongoose } from 'mongoose'
import type { IDBWithdraw } from '~~/types'

export const DBWithdraw = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBWithdraw>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    bank: {
      name: { type: String }, 
      person: { type: String }, 
      number: { type: String },
    },
    diamond: { type: Number, index: true },
    code: { type: String }, 
    status: { type: Number, default: 0 , index: true }, // 0-Wait 1-Success 2-Refuse,
    verify: {
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      time: { type: Date },
      reason: { type: String },
    }
  }, {
    timestamps: true
  })

  schema.index({ code: 'text' })

  const model = mongoose.model('withdraws', schema)
  return model 
}
