import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id, secret } = await readBody(event)

    let auth : IAuth | null = null
    if(!secret){
      auth = await getAuth(event, false) as IAuth | null
    }
    else {
      const runtimeConfig = useRuntimeConfig()
      if(secret != runtimeConfig.apiSecret) throw 'Khóa bí mật không đúng'
    }

    const select = ['username', 'avatar', 'level', 'type']
    if(!!secret || (!!auth && (auth.type > 0 || auth._id == _id))){
      select.push(...['currency', 'email', 'phone', 'block', 'pay', 'spend'])
    }

    const user = await DB.User
    .findOne({ _id: _id })
    .select(select.join(' '))
    .populate({
      path: 'level',
      select: 'number'
    })

    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    if(!!user.phone && (!auth || (!!auth && auth.type < 1))){
      const fullNumber = user.phone
      const last4Digits = fullNumber.slice(-2)
      const maskedNumber = last4Digits.padStart(fullNumber.length, '*')
      user.phone = maskedNumber
    }

    return resp(event, { result: user })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})