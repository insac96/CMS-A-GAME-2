import type { Mongoose } from 'mongoose'
import type { IDBShop, IDBShopPack, IDBShopPackHistory, IDBShopConfig, IDBShopHistory } from '~~/types'

export const DBShopConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopConfig>({ 
    maintenance: { type: Boolean, default: false },
    discount: {
      number: { type: Number, default: 0 },
      expired: { type: Date }
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('shop_config', schema, 'shop_config')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }
  autoCreate()
  
  return model 
}

export const DBShop = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShop>({ 
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
    item_amount: { type: Number, default: 1, index: true },
    price: { type: Number, index: true },
    limit: { type: Number, default: 0, index: true },
    pin: { type: Number, default: 0, index: true },
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('shops', schema)
  return model 
}

export const DBShopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
    amount: { type: Number, index: true },
    price: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('shop_histories', schema)
  return model 
}

export const DBShopPack = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopPack>({ 
    name: { type: String },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }],
    price: { type: Number, index: true },
    limit: { type: Number, default: 0, index: true },
    pin: { type: Number, default: 0, index: true },
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  schema.index({ name: 'text' })

  const model = mongoose.model('shop_packs', schema)
  return model 
}

export const DBShopPackHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopPackHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_packs' },
    amount: { type: Number, default: 1, index: true },
    price: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('shop_box_histories', schema)
  return model 
}