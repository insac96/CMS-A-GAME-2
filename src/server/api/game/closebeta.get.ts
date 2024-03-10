import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  try {
    const auth = await getAuth(event) as IAuth
    const user = await DB.User.findOne({ _id: auth._id }).select('reg type') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.type < 1 && !user.reg.teaser) throw 'Tài khoản của bạn không có trong danh sách tham gia CloseBeta'

    const url = await gameStartCloseBeta(event, auth.username)
    setCookie(event, 'play-url', url, runtimeConfig.public.cookieConfig)
    return resp(event, { result: 'Playing' })
  } 
  catch (e:any) {
    deleteCookie(event, 'token-auth', runtimeConfig.public.cookieConfig)
    return resp(event, { code: 400, message: e.toString() })
  }
})