import type { Mongoose } from 'mongoose'
import type { IDBConfig } from '~~/types'

export const DBConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBConfig>({ 
    name: { type: String, default: 'Game' },
    short_name: { type: String, default: 'Game' },
    description: { type: String, default: 'A Online Game Web' },
    og_image: { type: String },
    logo_image: { type: String },
    logo_long_image: { type: String },
    makeby: { type: String, default: 'Galvin' },
    about: { type: String },
    privacy: { type: String },
    terms: { type: String },
    menu: {
      action: {
        payment: { type: Boolean, default: true },
        withdraw: { type: Boolean, default: true },
        giftcode: { type: Boolean, default: true },
      },
      shop: {
        pack: { type: Boolean, default: true },
        item: { type: Boolean, default: true },
        currency: { type: Boolean, default: true },
      },
      event: {
        login: { type: Boolean, default: true },
        pay: { type: Boolean, default: true },
        spend: { type: Boolean, default: true },
        limitedevent: { type: Boolean, default: true },
      },
      minigame: {
        wheel: { type: Boolean, default: true },
        dice: { type: Boolean, default: true },
      },
      rank: {
        level: { type: Boolean, default: true },
        power: { type: Boolean, default: true },
      },
      social: {
        facebook: { type: Boolean, default: true },
        group: { type: Boolean, default: true },
      }
    },
    enable: {
      signin: { type: Boolean, default: true },
      signup: { type: Boolean, default: true },
      play: { type: Boolean, default: true },
      referral: { type: Boolean, default: true },
      teaser: { type: Boolean, default: false },
      landing: { type: Boolean, default: false },
      limitedevent: { type: Boolean, default: false },
    },
    homepage: {
      teaser: { type: mongoose.Schema.Types.ObjectId, ref: 'ads_teaser' },
      landing: { type: mongoose.Schema.Types.ObjectId, ref: 'ads_landing' },
    },
    download: {
      apk: { type: String },
      ios: { type: String },
    },
    contact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      prefix: { type: String, default: 'CVV' },
    },
    social: {
      facebook: { type: String, default: '' },
      messenger: { type: String, default: '' },
      zalo: { type: String, default: '' },
    },
    game: {
      image: { type: String, default: '' },
      secret: { type: String, default: '' },
      landing: { type: String, default: '' },
      api: {
        start: { type: String, default: '' },
        server: { type: String, default: '' },
        role: { type: String, default: '' },
        roles: { type: String, default: ''},
        rank_level: { type: String, default: '' },
        rank_power: { type: String, default: '' },
        mail: { type: String, default: '' },
        recharge: { type: String, default: '' },
        os: { type: String, default: '' },
      }
    },
    facebook: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_version: { type: String, default: '' },
      client_verify: { type: String, default: '' },
      client_ads: { type: String, default: '' },
    },
    google: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
      client_ads: { type: String, default: '' },
    },
    tiktok: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
    },
    zalo: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('configs', schema)

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }

  autoCreate()
  return model 
}

