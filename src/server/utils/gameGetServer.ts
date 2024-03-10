import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'

export default async (event: H3Event) : Promise<any> => {
  try {
    //return Promise.resolve([{ server_id: 1, server_name: 'Test' }])

    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.server) throw 'Tính năng tìm máy chủ trong trò chơi đang bảo trì'

    const send = await fetch(config.game.api.server, {
      method: 'post',
      body: JSON.stringify({
        secret: config.game.secret
      }),
      headers: {'Content-Type': 'application/json'}
    })

    const res = await send.json()
    if(res.error) throw res.error
    
    return Promise.resolve(res.data || [])
  }
  catch (e:any) {
    throw e.toString()
  }
}