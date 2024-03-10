import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không đủ'

    const news = await DB.News
    .findOne({ _id: _id })
    .select('content') 

    if(!news) throw 'Tin tức không tồn tại'
    return resp(event, { result: news.content })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})