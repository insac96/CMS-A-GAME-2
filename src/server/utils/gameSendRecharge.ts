import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'

interface ISendData {
  account: string
  server_id: string
  role_id: string
  recharge_id: string
  save_pay: number
}

export default async (event: H3Event, data : ISendData) : Promise<void> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.recharge) throw 'Tính năng gửi gói nạp vào trò chơi đang bảo trì'

    const send = await fetch(config.game.api.recharge, {
      method: 'post',
      body: JSON.stringify({
        secret: config.game.secret,
        ...data
      }),
      headers: {'Content-Type': 'application/json'}
    })
    
    const res = await send.json()
    if(res.error) throw res.error
  }
  catch (e:any) {
    throw e.toString()
  }
}