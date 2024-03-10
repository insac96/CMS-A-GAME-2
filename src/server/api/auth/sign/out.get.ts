import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    await DB.SocketOnline.updateOne({ user: auth._id }, { user: null })
    IO.emit('online-update')

    const runtimeConfig = useRuntimeConfig(event)
    deleteCookie(event, 'token-auth', runtimeConfig.public.cookieConfig)
    return resp(event, { message: 'Đăng xuất thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})