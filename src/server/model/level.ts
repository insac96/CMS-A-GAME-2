import type { Mongoose } from 'mongoose'
import type { IDBLevel } from '~~/types'

export const DBLevel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLevel>({ 
    number: { type: Number, index: true },
    need: {
      login: { type: String, default: 0, index: true },
      pay: {
        money: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      },
      spend: {
        coin: { type: Number, default: 0, index: true },
        count: { type: Number, default: 0, index: true },
      }
    },
    limit: {
      pay: {
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
        day: { type: Number, default: 0, index: true },
        month: { type: Number, default: 0, index: true },
      },
      dice: {
        day: {
          coin: { type: Number, default: 0, index: true },
          count: { type: Number, default: 0, index: true },
        },
        month: {
          coin: { type: Number, default: 0, index: true },
          count: { type: Number, default: 0, index: true },
        }
      }
    },
    bonus: { type: Number, default: 0, index: true },
    bonus_wheel: { type: Number, default: 0, index: true },
    bonus_presentee_pay: { type: Number, default: 0, index: true },
    discount: { type: Number, default: 0, index: true },
    gift_invited: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }]
  }, {
    timestamps: true
  })

  const model = mongoose.model('levels', schema)

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({ number: 1 })
  }

  autoCreate()
  return model 
}

