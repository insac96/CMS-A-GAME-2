import { defineStore } from 'pinia'
import type { IDBConfigStore } from '~~/types'

export const useConfigStore = defineStore('config', () => {
  const config : IDBConfigStore = reactive({
    name: '...',
    short_name: '...',
    description: '...',
    og_image: '',
    logo_image: '',
    logo_long_image: '',
    makeby: '',
    menu: {
      action: {
        payment: false,
        withdraw: false,
        giftcode: false,
      },
      shop: {
        pack: false,
        item: false,
        currency: false
      },
      event: {
        login: false,
        pay: false,
        spend: false,
        limitedevent: false
      },
      minigame: {
        wheel: false,
        dice: false
      },
      rank: {
        level: false,
        power: false
      },
      social: {
        facebook: false,
        group: false,
      }
    },
    enable: {
      signin: true,
      signup: true,
      play: true,
      referral: true,
      teaser: false,
      landing: false,
      limitedevent: false
    },
    download: {
      apk: '',
      ios: ''
    },
    contact: {
      name: '',
      phone: '',
      email: '',
      address: '',
      prefix: ''
    },
    social: {
      facebook: '',
      messenger: '',
      zalo: '',
    },
    game: {
      image: '',
      landing: ''
    },
    facebook: {
      client_id: '',
      client_version: '',
      client_verify: '',
    },
    google: {
      client_id: '',
      client_verify: '',
    },
    tiktok: {
      client_id: '',
      client_verify: '',
    },
    zalo: {
      client_id: '',
      client_verify: '',
    }
  })

  const bootConfig = async () => {
    const cfg : IDBConfigStore = await useAPI('config/get')
    Object.assign(config, cfg)
  }

  return { config, bootConfig }
})