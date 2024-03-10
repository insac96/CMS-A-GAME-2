import type { H3Event } from 'h3'

interface ICardData {
  net: string
  seri: string
  pin: string
  money: number
  token: string
  key: string
}

export default async (event: H3Event, card : ICardData) : Promise<void> => {
  const config = useRuntimeConfig(event)
  const { net, seri, pin, money, token, key } = card
  const url = 'http://muabanthe.vn/API/NapThe'
  const params = {
    'APIKey': key,
    'Network': net,
    'CardCode': pin,
    'CardSeri': seri,
    'CardValue': String(money),
    'URLCallback': config.public.clientURL + '/api/callback/card',
    'TrxID': token
  }
  const str = new URLSearchParams(params).toString()
  const send = await fetch(`${url}?${str}`)
  const res = await send.json()
  
  if(!res['Code'] || res['Code'] != 1) throw res['Message'] || 'Thẻ không hợp lệ'
}