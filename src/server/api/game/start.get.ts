import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    const url = await gameStart(event, auth.username)

    setCookie(event, 'play-url', url, runtimeConfig.public.cookieConfig)
    return resp(event, { result: 'Playing' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})