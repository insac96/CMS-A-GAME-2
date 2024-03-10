import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { username } = await readBody(event)
    if(!username) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({ username: username }).select('_id')
    if(!user) throw 'Không thể tìm tài khoản người dùng'

    return resp(event, { result: user._id })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})