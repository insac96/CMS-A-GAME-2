import type { Mongoose } from 'mongoose'
import type { IDBEvent, IDBEventConfig, IDBEventHistory } from '~~/types'

export const DBEventConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEventConfig>({ 
    type: { type: String },
    name: { type: String },
    start: { type: Date },
    end: { type: Date },
    display: { type: Number, default: 1 }
  }, {
    timestamps: true
  })

  const model = mongoose.model('event_configs', schema)

  const autoCreate = async () => {
    const event1 = await model.count({ type: 'login.month' })
    if(!event1) await model.create({ type: 'login.month', name: 'Đăng nhập tháng' })

    const event2 = await model.count({ type: 'login.total' })
    if(!event2) await model.create({ type: 'login.total', name: 'Đăng nhập tổng' })

    const event9 = await model.count({ type: 'pay.total.money' })
    if(!event9) await model.create({ type: 'pay.total.money', name: 'Tích nạp tổng' })

    const event3 = await model.count({ type: 'pay.day.money' })
    if(!event3) await model.create({ type: 'pay.day.money', name: 'Tích nạp ngày' })

    const event4 = await model.count({ type: 'pay.month.money' })
    if(!event4) await model.create({ type: 'pay.month.money', name: 'Tích nạp tháng' })

    const event5 = await model.count({ type: 'spend.total.coin' })
    if(!event5) await model.create({ type: 'spend.total.coin', name: 'Tiêu phí tổng' })

    const event6 = await model.count({ type: 'spend.day.coin' })
    if(!event6) await model.create({ type: 'spend.day.coin', name: 'Tiêu phí ngày' })

    const event7 = await model.count({ type: 'spend.month.coin' })
    if(!event7) await model.create({ type: 'spend.month.coin', name: 'Tiêu phí tháng' })

    const event8 = await model.count({ type: 'musty' })
    if(!event8) await model.create({ type: 'musty', name: 'Nạp đơn' })
  }

  autoCreate()
  return model 
}

export const DBEvent = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEvent>({ 
    type: { type: String },
    need: { type: Number, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }],
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('events', schema)
  return model 
}

export const DBEventHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEventHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('event_histories', schema)
  return model 
}

