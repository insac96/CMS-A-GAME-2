import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { text } = await readBody(event)
    if(!text) throw 'Vui lòng nhập nội dung'

    await createChat(event, auth._id, text)
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})