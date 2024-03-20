import type { H3Event } from 'h3'
import md5 from 'md5'
interface ICardData {
  net: string
  seri: string
  pin: string
  money: number
  token: string
  key: string
}

export default async (event: H3Event, card : ICardData) : Promise<void> => {
  const { net, seri, pin, money, token, key } = card

  const url = 'http://rinshop247.com/chargingws/v2'
  const keyArr = key.split('-')
  const request_id = token
  const sign = md5(keyArr[1]+''+pin.toString()+''+seri.toString())

  const send = await fetch(url, {
    method: 'post',
    body: JSON.stringify({
      telco: net,
      code: pin,
      serial: seri,
      amount: money,
      command: 'charging',
      partner_id: keyArr[0] || null,
      request_id: request_id,
      sign: sign
    }),
    headers: {'Content-Type': 'application/json'}
  })
  const res = await send.json()
  
  if(!res['status']) throw 'Gửi thẻ không thành công'
  if(res['status'] == 3) throw 'Thẻ lỗi'
  if(res['status'] == 4) throw 'Hệ thống bảo trì'
  if(res['status'] == 100) throw res['message'] || 'Thẻ không hợp lệ'
}