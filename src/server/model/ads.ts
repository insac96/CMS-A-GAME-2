import type { Mongoose } from 'mongoose'
import type { IDBAdsTeaser, IDBAdsLanding, IDBAdsFrom } from '~~/types'

export const DBAdsTeaser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdsTeaser>({ 
    code: { type: String },
    link: { type: String },
    view: { type: Number, default: 0, index: true },
    sign: {
      up: { type: Number, default: 0, index: true }
    },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('ads_teaser', schema, 'ads_teaser')
  return model 
}

export const DBAdsLanding = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdsLanding>({ 
    code: { type: String },
    link: { type: String },
    view: { type: Number, default: 0, index: true },
    sign: {
      in: { type: Number, default: 0, index: true },
      up: { type: Number, default: 0, index: true },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('ads_landing', schema, 'ads_landing')
  return model 
}

export const DBAdsFrom = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdsFrom>({ 
    code: { type: String },
    note: { type: String },
    view: { type: Number, default: 0, index: true },
    sign: {
      in: { type: Number, default: 0, index: true },
      up: { type: Number, default: 0, index: true },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('ads_from', schema, 'ads_from')
  return model 
}