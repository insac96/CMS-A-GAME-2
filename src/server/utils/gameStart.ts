import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'

export default async (event: H3Event, account : string) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    const get = await fetch(config.game.api.start, {
      method: 'post',
      body: JSON.stringify({
        secret: config.game.secret,
        account: account
      }),
      headers: {'Content-Type': 'application/json'}
    })
    
    const res = await get.json()
    if(res.error) throw res.error
    
    return Promise.resolve(res.data)
  }
  catch (e:any) {
    throw e.toString()
  }
}