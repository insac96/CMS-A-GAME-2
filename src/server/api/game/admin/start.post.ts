import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { username } = body

    const url = await gameStart(event, username)
    return resp(event, { result: url })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})