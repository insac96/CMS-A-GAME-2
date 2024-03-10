import type { Mongoose } from 'mongoose'
import type { IDBGiftcode, IDBGiftcodeHistory } from '~~/types'

export const DBGiftcode = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGiftcode>({ 
    code: { type: String },
    limit: { type: Number, default: 0, index: true },
    server: [{ type: String }],
    public: { type: Boolean, default: false },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }],
    expired: { type: Date },
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('giftcodes', schema)
  return model 
}

export const DBGiftcodeHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGiftcodeHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    giftcode: { type: mongoose.Schema.Types.ObjectId, ref: 'giftcodes' },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('giftcode_histories', schema)
  return model 
}

