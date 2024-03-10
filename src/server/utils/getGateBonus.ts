import type { H3Event } from 'h3'

interface IBodyData {
  default: number,
  limit: {
    number: number,
    expired: Date
  },
}

export default (event: H3Event, body : IBodyData) : number => {
  const defaultBonus = parseInt(String(body.default))
  const limitBonus = parseInt(String(body.limit.number || 0))
  const limitExpired = body.limit.expired

  if(limitBonus < 1 || (limitBonus > 0 && !limitExpired)) return defaultBonus
  else {
    const now = DayJS().unix()
    const expired = DayJS(limitExpired).unix()

    if(now <= expired) return limitBonus
    else return defaultBonus
  }
}