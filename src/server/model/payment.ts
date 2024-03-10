import type { Mongoose } from 'mongoose'
import type { IDBPayment, IDBPaymentConfig } from '~~/types'

export const DBPaymentConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBPaymentConfig>({ 
    maintenance: { type: Boolean, default: false },
    pay: {
      number: { type: Number, default: 0 },
      expired: { type: Date }
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('payment_config', schema, 'payment_config')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }
  autoCreate()
  
  return model 
}

export const DBPayment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBPayment>({ 
    gate: { type: mongoose.Schema.Types.ObjectId, ref: 'gates' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    card: {
      net: { type: String }, 
      seri: { type: String }, 
      pin: { type: String },
    },
    money: { type: Number, index: true },
    code: { type: String }, 
    token: { type: String },
    qrcode: { type: String },
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

  const model = mongoose.model('payments', schema)
  return model 
}
