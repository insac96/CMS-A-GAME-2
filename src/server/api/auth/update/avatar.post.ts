import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { avatar } = await readBody(event)
    if(!avatar) throw 'Vui tải ảnh lên trước'
  
    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('avatar block') as IDBUser

    if(!user) throw 'Tài khoản không tồn tại'
    if(user.block == 1) throw 'Tài khoản đang bị khóa, không thể thay ảnh đại diện'

    user.avatar = avatar
    await user.save()

    return resp(event, { message: 'Thay ảnh đại diện thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})