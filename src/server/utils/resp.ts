import type { H3Event } from 'h3'
import type { IResp } from '~~/types'

export default (event: H3Event, respData: IResp) => {
  let code = respData.code || 200
  setResponseStatus(event, 200)
  return { ...respData, code: code }
}