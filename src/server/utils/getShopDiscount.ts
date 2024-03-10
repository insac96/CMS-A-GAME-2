import type { H3Event } from 'h3'
import type { IDBShopConfig } from '~~/types'

export default (event: H3Event, body : IDBShopConfig) : number => {
  const defaultBonus = 0
  const limitDiscount = parseInt(String(body.discount.number || 0))
  const limitExpired = body.discount.expired

  if(!limitExpired) return limitDiscount
  else {
    const now = DayJS().unix()
    const expired = DayJS(limitExpired).unix()

    if(now <= expired) return limitDiscount
    else return defaultBonus
  }
}