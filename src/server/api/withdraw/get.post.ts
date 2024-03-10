import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id, secret } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID giao dịch'

    let auth : IAuth | null = null
    if(!secret){
      auth = await getAuth(event) as IAuth
    }
    else {
      const runtimeConfig = useRuntimeConfig()
      if(secret != runtimeConfig.apiSecret) throw 'Khóa bí mật không đúng'
    }

    const withdraw = await DB.Withdraw.findOne({ _id: _id })
    if(!withdraw) throw 'Giao dịch không tồn tại'
    if(!secret || (!!auth && (auth as IAuth).type < 1)){
      if(withdraw.user.toString() != (auth as IAuth)._id.toString()) throw 'Bạn không phải chủ giao dịch'
    }

    return resp(event, { result: withdraw })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})