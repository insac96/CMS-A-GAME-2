import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const data = await readBody(event)
    const { user } = data
    if(!user) throw 'Dữ liệu đầu vào không hợp lệ'

    const userData = await DB.User.findOne({ _id: user }).select('username limitedevent.egg') as IDBUser
    if(!userData) throw 'Không tìm thấy thông tin tài khoản'

    userData.limitedevent.egg = {
      1: [], 
      2: [],  
      3: [],  
      4: [],  
      5: []
    } 

    await userData.save()

    logAdmin(event, `Reset dữ liệu <b>đập trứng</b> của tài khoản <b>${userData.username}</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})