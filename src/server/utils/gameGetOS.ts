import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'

export default async (event: H3Event) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.os) throw 'Tính năng lấy thông tin VPS đang bảo trì'

    const send = await fetch(config.game.api.os, {
      method: 'post',
      body: JSON.stringify({
        secret: config.game.secret
      }),
      headers: {'Content-Type': 'application/json'}
    })

    const res = await send.json()
    if(res.error) throw res.error
    
    return Promise.resolve(res.data || {
      disk: null,
      ram: null
    })
  }
  catch (e:any) {
    throw e.toString()
  }
}