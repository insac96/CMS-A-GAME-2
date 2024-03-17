import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { user, secret } = await readBody(event)

    let auth : IAuth | null = null
    let userCheck = null
    if(!secret){
      auth = await getAuth(event) as IAuth
      userCheck = !!user ? user : auth._id
    }
    else {
      const runtimeConfig = useRuntimeConfig()
      if(secret != runtimeConfig.apiSecret) throw 'Khóa bí mật không đúng'
      userCheck = user
    }
    
    const userData = await DB.User
    .findOne({ _id: userCheck })
    .select('login pay spend wheel')
    if(!userData) throw 'Không tìm thấy thông tin tài khoản'

    return resp(event, { result: userData })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})