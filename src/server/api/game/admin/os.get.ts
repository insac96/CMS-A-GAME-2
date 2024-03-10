import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const os = await gameGetOS(event)
    return resp(event, { result: os })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})