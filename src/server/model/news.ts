import type { Mongoose } from 'mongoose'
import type { IDBNewsCategory, IDBNews } from '~~/types'

export const DBNewsCategory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBNewsCategory>({ 
    name: { type: String },
    color: { type: String, default: 'primary' }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text' })

  const model = mongoose.model('news_categories', schema)
  return model 
}

export const DBNews = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBNews>({ 
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'news_categories' },
    title: { type: String },
    description: { type: String }, 
    og_image: { type: String },
    keywords: [{ type: String }],
    content: { type: String },
    view: { type: Number, default: 0, index: true  },
    pin: { type: Number, default: 0, index: true  },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    updater: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    display: { type: Number, default: 1 , index: true },
  }, {
    timestamps: true
  })

  schema.index({ title: 'text' })

  const model = mongoose.model('news', schema)
  return model 
}
